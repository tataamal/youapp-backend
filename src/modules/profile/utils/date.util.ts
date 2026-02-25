export function parseDateOnlyDMY(value: string): Date {
  // expected "DD-MM-YYYY"
  const [ddStr, mmStr, yyyyStr] = value.split('-');
  const d = Number(ddStr);
  const m = Number(mmStr);
  const y = Number(yyyyStr);

  if (!y || m < 1 || m > 12 || d < 1 || d > 31) {
    throw new Error('Invalid date format (DD-MM-YYYY)');
  }

  return new Date(Date.UTC(y, m - 1, d));
}

export function toUtcYMD(date: Date) {
  return {
    y: date.getUTCFullYear(),
    m: date.getUTCMonth() + 1,
    d: date.getUTCDate(),
  };
}
