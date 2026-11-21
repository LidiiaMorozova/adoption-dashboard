// Dates arrive as `YYYY-MM-DD` calendar dates; formatting them in UTC keeps the day from shifting.
const asUtc = (date: string) => new Date(`${date}T00:00:00Z`);

const longDate = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
});
const weekday = new Intl.DateTimeFormat('en-GB', {weekday: 'short', timeZone: 'UTC'});
const dayOfMonth = new Intl.DateTimeFormat('en-GB', {day: 'numeric', timeZone: 'UTC'});
const month = new Intl.DateTimeFormat('en-GB', {month: 'short', timeZone: 'UTC'});

export const formatLongDate = (date: string) => longDate.format(asUtc(date));
export const formatWeekday = (date: string) => weekday.format(asUtc(date));
export const formatDayOfMonth = (date: string) => dayOfMonth.format(asUtc(date));
export const formatMonth = (date: string) => month.format(asUtc(date));
