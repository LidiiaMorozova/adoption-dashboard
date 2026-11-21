import {expect, test} from '@playwright/test';

const yesterdayMorning = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  date.setHours(8, 30, 0, 0);
  return date.toISOString();
};

test('opens on the Me tab and asks for today\'s check-in when there is none', async ({page}) => {
  // Only an entry from yesterday, so today has no check-in yet.
  await page.route('**/api/covid/symptom-entries', (route) => route.fulfill({
    json: [
      {id: 'b', recordedAt: yesterdayMorning(), temperature: 37.1, wellbeing: 3, appetite: 3, sleep: 4, notes: null},
      {id: 'a', recordedAt: new Date(Date.now() - 2 * 86_400_000).toISOString(), temperature: 38.2, wellbeing: 2, appetite: 2, sleep: 2, notes: null},
    ],
  }));
  await page.goto('/');

  await expect(page.getByRole('tab', {name: 'Me', exact: true})).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', {name: 'Hello!'})).toBeVisible();
  await expect(page.getByRole('img', {name: 'No check-in yet today'})).toBeVisible();

  await page.getByRole('link', {name: "Add today's check-in"}).click();
  await expect(page.getByRole('heading', {name: 'Add symptoms'})).toBeVisible();
  await expect(page).toHaveURL(/#covid-monitoring$/);
});

for (const [wellbeing, face, headline] of [
  [5, 'Smiling face', "You're feeling good today"],
  [3, 'Neutral face', "You're feeling so-so today"],
  [1, 'Sad face', "You're not feeling well today"],
] as const) {
  test(`shows a ${face.toLowerCase()} when today's feeling is ${wellbeing}/5`, async ({page, request}) => {
    const saved = await request.post('/api/covid/symptom-entries', {
      data: {temperature: 37.2, wellbeing, appetite: 3, sleep: 3},
    });
    expect(saved.status()).toBe(201);

    await page.goto('/#me');

    await expect(page.getByRole('img', {name: face})).toBeVisible();
    await expect(page.getByTestId('today-mood')).toContainText(headline);
  });
}

test('charts the recent check-ins and offers a table view', async ({page}) => {
  await page.goto('/#me');

  await expect(page.getByRole('img', {name: /temperature over recent days/})).toBeVisible();
  await expect(page.getByRole('img', {name: /feeling, appetite and sleep ratings/})).toBeVisible();

  const temperatureCard = page.locator('div', {has: page.getByRole('heading', {name: 'Temperature', exact: true})}).last();
  await temperatureCard.getByText('Show as table').click();
  await expect(temperatureCard.getByRole('table')).toBeVisible();
  await expect(temperatureCard.getByRole('row')).not.toHaveCount(1);
});
