// Renders og-image.html to a 1200×630 PNG for social link previews.
// Uses the puppeteer install in ~/Desktop/Nar/screenshots/node_modules.
// Run: node render-og.mjs   (from this directory)

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

const url = 'file://' + join(__dirname, 'og-image.html');
await page.goto(url, { waitUntil: 'networkidle0' });
await page.evaluateHandle('document.fonts.ready');

const out = join(__dirname, 'og-image.png');
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
console.log('✓', out);

await browser.close();
