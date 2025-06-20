import fetch from 'node-fetch';

function parseTimeToDate(time, date) {
    // time: '21:00', date: '2025-06-19' => Date object in America/Argentina/Buenos_Aires
    const [hour, minute] = time.split(':').map(Number);
    const [year, month, day] = date.split('-').map(Number);
    // Crear fecha en zona horaria de Argentina
    return new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00-03:00`);
}

function getNowArgentina() {
    // Obtener la hora actual en la zona horaria de Argentina
    const now = new Date();
    // Convertir a string en la zona horaria de Argentina y volver a Date
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Argentina/Buenos_Aires',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    });
    const parts = formatter.formatToParts(now);
    const y = parts.find(p => p.type === 'year').value;
    const m = parts.find(p => p.type === 'month').value;
    const d = parts.find(p => p.type === 'day').value;
    const h = parts.find(p => p.type === 'hour').value;
    const min = parts.find(p => p.type === 'minute').value;
    const s = parts.find(p => p.type === 'second').value;
    return new Date(`${y}-${m}-${d}T${h}:${min}:${s}-03:00`);
}

export default async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('Fetching eventos JSON...');
        // Fetch the JSON of the eventos
        const response = await fetch('https://la14hd.com/eventos/json/agenda123.json');
        if (!response.ok) throw new Error('No se pudo obtener el JSON de eventos');
        const events = await response.json();
        console.log(`Eventos obtenidos: ${events.length} eventos.`);
        
        // Agrupar eventos por título y hora, juntar links en options
        const eventMap = new Map();
        events.forEach(event => {
            const key = `${event.title}__${event.time}`;
            if (!eventMap.has(key)) {
                eventMap.set(key, {
                    time: event.time,
                    title: event.title,
                    options: [event.link],
                    category: event.category,
                    language: event.language,
                    date: event.date
                });
            } else {
                eventMap.get(key).options.push(event.link);
            }
        });
        // Obtener hora actual en zona horaria de Argentina
        const nowArgentina = getNowArgentina();
        
        // Convertir el Map a array y ordenar por fecha/hora
        const adaptedEvents = Array.from(eventMap.values())
            .map(ev => {
                const eventDate = parseTimeToDate(ev.time, ev.date);
                let status = 'Pronto';
                if (nowArgentina >= eventDate) status = 'EN VIVO';
                return {
                    ...ev,
                    status,
                    options: ev.options,
                    sortDate: eventDate // Añadimos esta propiedad para ordenar
                };
            })
            .sort((a, b) => a.sortDate - b.sortDate) // Ordenar por fecha/hora
            .map(ev => {
                const { sortDate, ...eventWithoutSortDate } = ev; // Eliminar la propiedad temporal
                return eventWithoutSortDate;
            });

        // Send the extracted events as a JSON response
        return res.status(200).json(adaptedEvents);
    } catch (error) {
        console.error('Error durante la obtención de eventos:', error);
        return res.status(500).json({
            error: 'Error al obtener los eventos',
            message: error.message
        });
    }
};
