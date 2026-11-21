import {expect, test, type Page} from '@playwright/test';

// Paths start with "./" so they stay under the /adoption-dashboard/ base of the demo.
const open = (page: Page, tab: string) => page.goto(`./#${tab}`);
const freeSlots = (page: Page) => page.locator('[data-slot-id]:not([disabled])');

test('shows the demo notice and loads every tab without an API', async ({page}) => {
  await open(page, 'me');
  await expect(page.getByTestId('demo-banner')).toContainText('saved only in this browser');
  await expect(page.getByRole('img', {name: /temperature over recent days/})).toBeVisible();

  await open(page, 'adoption-dashboard');
  await expect(page.getByRole('heading', {name: 'Patient Logins'})).toBeVisible();

  await open(page, 'appointments');
  await expect(freeSlots(page).first()).toBeVisible();
});

test('a booking is kept after reloading the page', async ({page}) => {
  await open(page, 'appointments');
  const slot = freeSlots(page).first();
  const slotId = await slot.getAttribute('data-slot-id');
  await slot.click();
  await page.getByLabel('Full name').fill('Demo Visitor');
  await page.getByLabel('Email').fill('visitor@example.com');
  await page.getByRole('button', {name: 'Confirm booking'}).click();
  await expect(page.getByRole('heading', {name: 'Your appointment is booked'})).toBeVisible();

  await page.reload();
  await expect(page.locator('[data-slot-id], [data-testid="no-slots"]').first()).toBeVisible();
  await expect(page.locator(`[data-slot-id="${slotId}"]:not([disabled])`)).toHaveCount(0);
});

test('two tabs cannot book the same time', async ({context}) => {
  const first = await context.newPage();
  const second = await context.newPage();
  await open(first, 'appointments');
  await open(second, 'appointments');

  const slotId = await freeSlots(first).first().getAttribute('data-slot-id');
  for (const [page, name] of [[first, 'First Tab'], [second, 'Second Tab']] as const) {
    await page.locator(`[data-slot-id="${slotId}"]`).click();
    await page.getByLabel('Full name').fill(name);
    await page.getByLabel('Email').fill('tabs@example.com');
  }

  await first.getByRole('button', {name: 'Confirm booking'}).click();
  await expect(first.getByRole('heading', {name: 'Your appointment is booked'})).toBeVisible();

  await second.getByRole('button', {name: 'Confirm booking'}).click();
  await expect(second.getByTestId('slot-conflict')).toContainText('was just booked by someone else');
  await expect(second.getByLabel('Full name')).toHaveValue('Second Tab');
});

test('a check-in updates the Me tab and survives a reload', async ({page}) => {
  await open(page, 'covid-monitoring');
  await page.getByLabel('Temperature').fill('36.6');
  for (const legend of ['How do you feel overall?', 'Appetite', 'Sleep last night']) {
    await page.getByRole('group', {name: legend}).getByText('Very good', {exact: true}).click();
  }
  await page.getByRole('button', {name: 'Save'}).click();
  await expect(page.getByTestId('symptoms-saved')).toBeVisible();

  await open(page, 'me');
  await page.reload();
  await expect(page.getByRole('img', {name: 'Smiling face'})).toBeVisible();
});

test('Reset demo data brings back the sample data', async ({page}) => {
  await open(page, 'covid-monitoring');
  await page.getByLabel('Temperature').fill('39.1');
  for (const legend of ['How do you feel overall?', 'Appetite', 'Sleep last night']) {
    await page.getByRole('group', {name: legend}).getByText('Poor', {exact: true}).click();
  }
  await page.getByRole('button', {name: 'Save'}).click();
  await expect(page.getByTestId('symptom-history').getByRole('listitem').first()).toContainText('39.1 °C');

  await page.getByRole('button', {name: 'Reset demo data'}).click();

  await expect(page.getByTestId('symptom-history').getByRole('listitem')).toHaveCount(6);
  await expect(page.getByTestId('symptom-history')).not.toContainText('39.1 °C');
});
