const vndFormatter = new Intl.NumberFormat('vi-VN');

const toDigits = (value: unknown) => String(value ?? '').replace(/\D/g, '');

const parseRawAmount = (value: unknown) => {
  if (typeof value === 'number') return value;

  const raw = String(value ?? '').trim();
  if (!raw) return 0;

  const decimalMatch = raw.match(/^(\d+)\.(\d+)$/);
  if (decimalMatch && (decimalMatch[2].length <= 2 || decimalMatch[1].length >= 4)) {
    return Number(raw);
  }

  const digits = toDigits(raw);
  return digits ? parseInt(digits, 10) : 0;
};

export const normalizeVndAmount = (value: unknown) => {
  const amount = parseRawAmount(value);
  if (!Number.isFinite(amount) || amount <= 0) return 0;

  return amount < 1000 ? amount * 1000 : amount;
};

export const formatVndInput = (value: unknown) => {
  const digits = toDigits(value);
  return digits ? vndFormatter.format(parseInt(digits, 10)) : '';
};

export const formatVndInputValue = (value: unknown) => {
  const amount = normalizeVndAmount(value);
  return amount > 0 ? vndFormatter.format(amount) : '';
};

export const parseVndInput = normalizeVndAmount;

export const formatVnd = (value: unknown) => {
  const amount = normalizeVndAmount(value);
  return amount > 0 ? `${vndFormatter.format(amount)} đ` : '0 đ';
};
