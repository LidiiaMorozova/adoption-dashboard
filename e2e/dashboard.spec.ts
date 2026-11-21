import {expect, test} from '@playwright/test';

test('loads the adoption dashboard from the API', async ({page}) => {
  await page.goto('/#adoption-dashboard');

  await expect(page.getByRole('tab', {name: 'Adoption dashboard'})).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', {name: 'Patient Logins'})).toBeVisible();
  await expect(page.locator('.trend-badge', {hasText: '4.1% this month'})).toBeVisible();
});

test('offers a retry when the dashboard fails to load', async ({page}) => {
  await page.route('**/api/dashboard', (route) => route.fulfill({status: 500, body: '{}'}));
  await page.goto('/#adoption-dashboard');

  await expect(page.getByRole('alert')).toContainText("We couldn't load the dashboard");

  await page.unroute('**/api/dashboard');
  await page.getByRole('button', {name: 'Try again'}).click();
  await expect(page.getByRole('heading', {name: 'Patient Logins'})).toBeVisible();
});

test('View details explains the chart colors in a dialog', async ({page}) => {
  await page.goto('/#adoption-dashboard');

  const card = page.locator('.middle-card', {has: page.getByRole('heading', {name: 'Measurements'})});
  const viewDetails = card.getByRole('button', {name: 'View details'});
  await viewDetails.click();

  const dialog = page.getByRole('dialog', {name: 'Measurements: what the colors mean'});
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('row', {name: /Telemonitoring/})).toContainText('56%');
  await expect(dialog.getByRole('listitem').filter({hasText: 'This card'})).toContainText('Lower than last month');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(viewDetails).toBeFocused();
});

test('View details on a card without a chart explains the badge', async ({page}) => {
  await page.goto('/#adoption-dashboard');

  await page.locator('.large-card', {has: page.getByRole('heading', {name: 'Services'})})
    .getByRole('button', {name: 'View details'}).click();

  const dialog = page.getByRole('dialog', {name: 'Services: what the colors mean'});
  await expect(dialog).toContainText('instead of a chart');
  await expect(dialog.getByRole('listitem').filter({hasText: 'This card'})).toContainText('A current total');

  await dialog.getByRole('button', {name: 'Got it'}).click();
  await expect(dialog).toBeHidden();
});
