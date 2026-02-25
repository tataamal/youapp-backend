import { toUtcYMD } from './date.util';

type Range = {
  name: string;
  start: { m: number; d: number };
  end: { m: number; d: number };
};

const HOROSCOPE_RANGES: Range[] = [
  { name: 'Aries', start: { m: 3, d: 21 }, end: { m: 4, d: 19 } },
  { name: 'Taurus', start: { m: 4, d: 20 }, end: { m: 5, d: 20 } },
  { name: 'Gemini', start: { m: 5, d: 21 }, end: { m: 6, d: 21 } },
  { name: 'Cancer', start: { m: 6, d: 22 }, end: { m: 7, d: 22 } },
  { name: 'Leo', start: { m: 7, d: 23 }, end: { m: 8, d: 22 } },
  { name: 'Virgo', start: { m: 8, d: 23 }, end: { m: 9, d: 22 } },
  { name: 'Libra', start: { m: 9, d: 23 }, end: { m: 10, d: 23 } },
  { name: 'Scorpio', start: { m: 10, d: 24 }, end: { m: 11, d: 21 } },
  { name: 'Sagittarius', start: { m: 11, d: 22 }, end: { m: 12, d: 21 } },
  { name: 'Capricorn', start: { m: 12, d: 22 }, end: { m: 1, d: 19 } },
  { name: 'Aquarius', start: { m: 1, d: 20 }, end: { m: 2, d: 18 } },
  { name: 'Pisces', start: { m: 2, d: 19 }, end: { m: 3, d: 20 } },
];

function inRange(m: number, d: number, r: Range): boolean {
  const afterStart = m > r.start.m || (m === r.start.m && d >= r.start.d);
  const beforeEnd = m < r.end.m || (m === r.end.m && d <= r.end.d);

  // normal range (ga nyebrang tahun)
  if (r.start.m < r.end.m || (r.start.m === r.end.m && r.start.d <= r.end.d)) {
    return afterStart && beforeEnd;
  }

  // nyebrang tahun (Capricorn)
  return afterStart || beforeEnd;
}

export function getHoroscope(date: Date): string {
  const { m, d } = toUtcYMD(date);
  const found = HOROSCOPE_RANGES.find((r) => inRange(m, d, r));
  return found?.name ?? 'Unknown';
}
