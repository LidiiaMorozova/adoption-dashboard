// Captures the README screenshots. Needs the API and the web app running (see README).
import {mkdir} from 'node:fs/promises';
import {chromium} from '@playwright/test';

const baseURL = process.env.BASE_URL ?? 'http://localhost:8080';
const outDir = new URL('../docs/screenshots/', import.meta.url);
await mkdir(outDir, {recursive: true});

const browser = await chromium.launch();

async function capture(name, {width, height, hash = '', fullPage = false, prepare}) {
  const page = await browser.newPage({viewport: {width, height}, deviceScaleFactor: 2});
  await page.goto(`${baseURL}/${hash}`);
  await page.waitForLoadState('networkidle');
  if (prepare) await prepare(page);
  await page.mouse.move(0, 0);
  await page.waitForTimeout(300);
  await page.screenshot({path: new URL(`${name}.png`, outDir).pathname, fullPage});
  await page.close();
}

await capture('main', {width: 1280, height: 800, hash: '#me'});
await capture('dashboard', {width: 1400, height: 1150, hash: '#adoption-dashboard'});
await capture('booking', {
  width: 1280,
  height: 820,
  hash: '#appointments',
  prepare: async (page) => {
    await page.locator('[data-slot-id]:not([disabled])').nth(1).click();
    await page.getByLabel('Full name').fill('Jane Doe');
    await page.getByLabel('Email').fill('jane.doe@example.com');
  },
});
await capture('booking-mobile', {width: 390, height: 844, hash: '#appointments'});
await capture('covid-monitoring', {
  width: 1280,
  height: 900,
  hash: '#covid-monitoring',
  prepare: async (page) => {
    await page.getByLabel('Temperature').fill('37.4');
    for (const [legend, label] of [['How do you feel overall?', 'Good'], ['Appetite', 'Fair'], ['Sleep last night', 'Good']]) {
      await page.getByRole('group', {name: legend}).getByText(label, {exact: true}).click();
    }
  },
});

await browser.close();
console.log(`Screenshots saved to ${outDir.pathname}`);
