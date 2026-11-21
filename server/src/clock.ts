/** Injection token for the current time, so tests can fix "now". */
export const CLOCK = Symbol('CLOCK');
export type Clock = () => Date;

export const clockProvider = {provide: CLOCK, useValue: (() => new Date()) satisfies Clock};
