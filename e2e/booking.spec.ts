import {expect, test, type Page} from '@playwright/test';

const freeSlots = (page: Page) => page.locator('[data-slot-id]:not([disabled])');

async function openBooking(page: Page) {
  await page.goto('/#appointments');
  await expect(page.getByRole('heading', {name: 'Book an appointment'})).toBeVisible();
  await expect(freeSlots(page).first()).toBeVisible();
}

async function fillDetails(page: Page, name = 'Jane Doe', email = 'jane.doe@example.com') {
  await page.getByLabel('Full name').fill(name);
  await page.getByLabel('Email').fill(email);
}

test('books an appointment and the slot becomes unavailable', async ({page}) => {
  await openBooking(page);

  const slot = freeSlots(page).first();
  const slotId = await slot.getAttribute('data-slot-id');
  const start = (await slot.textContent())?.trim() ?? '';
  await slot.click();
  await expect(slot).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('selected-time')).toContainText(start);

  await fillDetails(page);
  await page.getByLabel('Reason for visit').fill('Annual check-up');
  await page.getByRole('button', {name: 'Confirm booking'}).click();

  const confirmation = page.getByRole('heading', {name: 'Your appointment is booked'});
  await expect(confirmation).toBeVisible();
  await expect(confirmation).toBeFocused();
  await expect(page.getByTestId('confirmation-time')).toContainText(start);

  await page.getByRole('button', {name: 'Book another appointment'}).click();
  // The slot is now shown as booked, or the whole day shows "no free times" if it was the last one.
  await expect(page.locator('[data-slot-id], [data-testid="no-slots"]').first()).toBeVisible();
  await expect(page.locator(`[data-slot-id="${slotId}"]:not([disabled])`)).toHaveCount(0);
});

test('explains when someone else booked the slot first and keeps the form', async ({page, request}) => {
  await openBooking(page);

  const slot = freeSlots(page).first();
  const slotId = await slot.getAttribute('data-slot-id');
  await slot.click();
  await fillDetails(page, 'Second Patient', 'second@example.com');

  // Another user books the same slot while this form is still open.
  const competing = await request.post('/api/appointments/bookings', {
    data: {slotId, patientName: 'First Patient', email: 'first@example.com'},
  });
  expect(competing.status()).toBe(201);

  await page.getByRole('button', {name: 'Confirm booking'}).click();

  const alert = page.getByTestId('slot-conflict');
  await expect(alert).toBeVisible();
  await expect(alert).toBeFocused();
  await expect(alert).toContainText('was just booked by someone else');
  await expect(page.locator(`[data-slot-id="${slotId}"]`)).toBeDisabled();
  await expect(page.getByTestId('selected-time')).toHaveText('No time selected yet.');
  await expect(page.getByLabel('Full name')).toHaveValue('Second Patient');

  await freeSlots(page).first().click();
  await page.getByRole('button', {name: 'Confirm booking'}).click();
  await expect(page.getByRole('heading', {name: 'Your appointment is booked'})).toBeVisible();
});

test('shows an empty state for a fully booked day', async ({page}) => {
  await openBooking(page);

  await page.getByRole('button', {name: /fully booked/}).first().click();

  await expect(page.getByTestId('no-slots')).toContainText('All times on this day are already booked');
});

test('validates the form before sending it', async ({page}) => {
  await openBooking(page);

  await page.getByRole('button', {name: 'Confirm booking'}).click();

  await expect(page.getByLabel('Full name')).toBeFocused();
  await expect(page.getByLabel('Full name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Please enter a valid email address')).toBeVisible();
  await expect(page.getByText('Please choose a day and time first.')).toBeVisible();
});

test('recovers when the calendar fails to load', async ({page}) => {
  await page.route('**/api/appointments/days', (route) =>
    route.fulfill({status: 503, contentType: 'application/json', body: JSON.stringify({message: 'Service unavailable.'})}),
  );
  await page.goto('/#appointments');

  await expect(page.getByRole('alert')).toContainText("We couldn't load the appointment calendar");

  await page.unroute('**/api/appointments/days');
  await page.getByRole('button', {name: 'Try again'}).click();
  await expect(freeSlots(page).first()).toBeVisible();
});

test('can be completed with the keyboard', async ({page}) => {
  await page.goto('/#adoption-dashboard');
  const dashboardTab = page.getByRole('tab', {name: 'Adoption dashboard'});
  await dashboardTab.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', {name: 'Covid monitoring'})).toBeFocused();
  await page.keyboard.press('ArrowRight');

  const bookingTab = page.getByRole('tab', {name: 'Book appointment'});
  await expect(bookingTab).toBeFocused();
  await expect(bookingTab).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/#appointments$/);

  const slot = freeSlots(page).first();
  await slot.focus();
  await page.keyboard.press('Space');
  await expect(slot).toHaveAttribute('aria-pressed', 'true');

  await page.getByLabel('Full name').focus();
  await page.keyboard.type('Keyboard User');
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Email')).toBeFocused();
  await page.keyboard.type('keyboard@example.com');
  await page.keyboard.press('Enter');

  await expect(page.getByRole('heading', {name: 'Your appointment is booked'})).toBeFocused();
});
