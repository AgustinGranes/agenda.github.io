// Cambiamos a la sintaxis de ES modules para las importaciones
import puppeteer from 'puppeteer-core'; // Changed to puppeteer-core
import chromium from '@sparticuz/chromium'; // Import chromium
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

// Obtenemos __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear interfaz para leer entrada del usuario
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para preguntar al usuario
const preguntarContinuar = () => {
    return new Promise((resolve) => {
        rl.question('¿Desea continuar con la iteración? (s/n): ', (respuesta) => {
            resolve(respuesta.toLowerCase() === 's');
        });
    });
};

/**
 * Función principal para realizar el web scraping.
 * Esta función es asíncrona para poder usar las capacidades de Puppeteer.
 */
async function scrapeLa14HD() {
    console.log('Iniciando el scrapper...');
    let browser; // Definimos la variable del navegador fuera del try/catch para acceder a ella en el finally

    try {
        // 1. Lanzar una instancia del navegador Chromium.
        browser = await puppeteer.launch({
            args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'], // Use chromium args
            executablePath: await chromium.executablePath(), // Specify the executable path
            headless: chromium.headless, // Use chromium's headless setting
        });

        // 2. Abrir una nueva página en el navegador.
        const page = await browser.newPage();

        // 3. Navegar a la URL especificada y esperar a que la red esté inactiva.
        console.log('Navegando a https://la14hd.com/eventos/ ...');
        await page.goto('https://la14hd.com/eventos/', { waitUntil: 'networkidle2' });

        // 4. Esperar a que el contenedor de eventos se llene dinámicamente.
        console.log('Esperando que los eventos se carguen dinámicamente...');
        await page.waitForSelector('#events-container .event');

        // 5. Extraer la información de los eventos.
        console.log('Extrayendo datos de los eventos...');
        const eventsData = await page.evaluate(() => {
            const events = [];
            const eventElements = document.querySelectorAll('#events-container .event');

            eventElements.forEach(eventEl => {
                const statusText = eventEl.querySelector('.status-text span')?.innerText.trim();
                const title = eventEl.querySelector('.event-title')?.innerText.trim();
                const relativeLink = eventEl.dataset.url;

                if (statusText && title && relativeLink) {
                    events.push({
                        status: statusText, // Puede ser "EN VIVO" o una hora "14:00"
                        partido: title,
                        enlace: `https://la14hd.com${relativeLink}`
                    });
                }
            });
            return events;
        });

        // 6. Guardar los datos en un archivo JSON.
        // __dirname es una variable global en Node.js (con CommonJS) que da la ruta de la carpeta actual.
        const filePath = join(__dirname, 'events.json');
        const jsonData = JSON.stringify(eventsData, null, 2); 
        
        await fs.writeFile(filePath, jsonData);
        console.log(`Scrapping completado. ${eventsData.length} eventos guardados en events.json`);

        return eventsData;

    } catch (error) {
        console.error('Ocurrió un error durante el scrapping:', error);
        return null;
    } finally {
        if (browser) {
            console.log('Cerrando el navegador...');
            await browser.close();
        }
    }
}

export async function scrapeEvents() {
    console.log('Iniciando el scrapper...');
    // Use puppeteer-core and chromium
    const browser = await puppeteer.launch({
        args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
    });

    try {
        const page = await browser.newPage();
        await page.goto('https://la14hd.com/eventos/', { waitUntil: 'networkidle2' });
        
        // Esperar a que los contenedores de eventos se carguen
        await page.waitForSelector('.event');
        
        // Extraer la información
        const events = await page.evaluate(() => {
            const eventElements = document.querySelectorAll('.event');
            return Array.from(eventElements).map(event => {
                const eventName = event.querySelector('.event-name')?.innerText.trim();
                const status = event.querySelector('.status-button')?.classList.contains('status-live') ? 'EN VIVO' : 'Pronto';
                const link = event.querySelector('.iframe-link')?.value;
                const language = event.querySelector('.language_text')?.innerText;
                const time = eventName.split(' - ')[0];
                const title = eventName.split(' - ')[1];
                const category = event.dataset.category;

                return {
                    status,
                    time,
                    title,
                    link,
                    language,
                    category
                };
            });
        });
        
        await browser.close();
        return events;

    } catch (error) {
        console.error('Error durante el scraping:', error);
        if (browser) await browser.close();
        return [];
    }
}

async function main() {
    do {
        await scrapeLa14HD();
        const continuar = await preguntarContinuar();
        if (!continuar) {
            break;
        }
    } while (true);
    
    rl.close();
    console.log('Programa finalizado.');
}

// Ejecutar la función principal
main();