import {expect, test, type Page} from '@playwright/test';

async function openCovidMonitoring(page: Page) {
  await page.goto('/#covid-monitoring');
  await expect(page.getByRole('heading', {name: 'Covid monitoring'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Recent entries'})).toBeVisible();
}

const rate = (page: Page, legend: string, label: string) =>
  page.getByRole('group', {name: legend}).getByText(label, {exact: true}).click();

test('saves a check-in and shows it at the top of the history', async ({page}) => {
  await openCovidMonitoring(page);

  await page.getByLabel('Temperature').fill('38,4');
  await rate(page, 'How do you feel overall?', 'Poor');
  await rate(page, 'Appetite', 'Fair');
  await rate(page, 'Sleep last night', 'Very poor');
  await page.getByLabel('Other symptoms or notes').fill('Dry cough');
  await page.getByRole('button', {name: 'Save'}).click();

  const saved = page.getByTestId('symptoms-saved');
  await expect(saved).toBeVisible();
  await expect(saved).toBeFocused();

  const latest = page.getByTestId('symptom-history').getByRole('listitem').first();
  await expect(latest).toContainText('38.4 °C');
  await expect(latest).toContainText('Fever');
  await expect(latest).toContainText('Feeling2/5 · Poor');
  await expect(latest).toContainText('Dry cough');

  await expect(page.getByLabel('Temperature')).toHaveValue('');
});

test('explains what is missing before saving', async ({page}) => {
  await openCovidMonitoring(page);

  await page.getByLabel('Temperature').fill('45');
  await page.getByRole('button', {name: 'Save'}).click();

  await expect(page.getByLabel('Temperature')).toBeFocused();
  await expect(page.getByText('Enter a temperature between 34.0 and 43.0 °C')).toBeVisible();
  await expect(page.getByText('Please rate how you feel.')).toBeVisible();
  await expect(page.getByText('Please rate your appetite.')).toBeVisible();
  await expect(page.getByText('Please rate your sleep.')).toBeVisible();
  await expect(page.getByTestId('symptoms-saved')).toHaveCount(0);
});

test('ratings can be chosen with the arrow keys', async ({page}) => {
  await openCovidMonitoring(page);

  await page.getByLabel('Temperature').fill('36.8');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', {name: '3 Fair'}).first()).toBeChecked();

  for (const legend of ['Appetite', 'Sleep last night']) {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await expect(page.getByRole('group', {name: legend}).getByRole('radio', {name: '1 Very poor'})).toBeChecked();
  }

  await page.getByRole('button', {name: 'Save'}).press('Enter');
  await expect(page.getByTestId('symptoms-saved')).toBeVisible();
  await expect(page.getByTestId('symptom-history').getByRole('listitem').first()).toContainText('36.8 °C');
});
