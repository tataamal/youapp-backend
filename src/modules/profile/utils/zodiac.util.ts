import * as fs from 'fs';
import * as path from 'path';

type ZodiacRow = { start: Date; end: Date; animal: string };

const MONTH_MAP: Record<string, number> = {
  January: 1,
  February: 2,
  Februry: 2,
};

function parseCsvDate(s: string): Date {
  const [yearStr, monthStr, dayStr] = s.trim().split(/\s+/);
  const y = Number(yearStr);
  const m = MONTH_MAP[monthStr];
  const d = Number(dayStr);
  return new Date(Date.UTC(y, m - 1, d));
}

function loadZodiacCsv(): ZodiacRow[] {
  const filePath = path.join(process.cwd(), 'data', 'zodiac.csv');
  const raw = fs.readFileSync(filePath, 'utf8');

  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [startStr, endStr, animal] = line.split(',').map((s) => s.trim());
      return {
        start: parseCsvDate(startStr),
        end: parseCsvDate(endStr),
        animal,
      };
    });
}

let ZODIAC_TABLE: ZodiacRow[] | null = null;

export function getChineseZodiac(date: Date): string {
  if (!ZODIAC_TABLE) ZODIAC_TABLE = loadZodiacCsv();

  const t = date.getTime();
  const row = ZODIAC_TABLE.find(
    (r) => t >= r.start.getTime() && t <= r.end.getTime(),
  );
  return row?.animal ?? 'Unknown';
}
