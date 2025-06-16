import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Middleware para manejar CORS y errores
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Servir archivos estáticos
app.use(express.static(__dirname));

// Función para hacer scraping
async function scrapeEvents() {
    console.log('Iniciando scraping...');
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.goto('https://la14hd.com/eventos/', { 
            waitUntil: 'networkidle0',
            timeout: 60000 
        });
        
        console.log('Página cargada, extrayendo eventos...');
        
        const events = await page.evaluate(() => {
            const eventElements = document.querySelectorAll('.event');
            const eventMap = new Map();

            Array.from(eventElements).forEach(event => {
                const eventName = event.querySelector('.event-name')?.innerText.trim() || '';
                const [time, title] = eventName.split(' - ');
                const status = event.querySelector('.status-button')?.classList.contains('status-live') ? 'EN VIVO' : 'Pronto';
                const link = event.querySelector('.iframe-link')?.value || '';
                
                const key = title || eventName;
                if (!eventMap.has(key)) {
                    eventMap.set(key, {
                        status,
                        time,
                        title: key,
                        options: []
                    });
                }
                
                eventMap.get(key).options.push(link);
            });

            return Array.from(eventMap.values());
        });
        
        await browser.close();
        console.log(`Scraping completado. Se encontraron ${events.length} eventos únicos.`);
        return events;
    } catch (error) {
        console.error('Error durante el scraping:', error);
        if (browser) {
            await browser.close();
        }
        throw error;
    }
}

// Endpoint para obtener eventos
app.get('/api/events', async (req, res) => {
    try {
        const events = await scrapeEvents();
        res.json(events);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ 
            error: 'Error al obtener los eventos',
            message: error.message 
        });
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});