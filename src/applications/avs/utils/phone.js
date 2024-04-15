const normalizePhoneNumber = number => {
  const digitsOnly = number.replace(/\D/g, '');
  return digitsOnly.replace(/^1/, '');
};

const numberIsClickable = number => {
  return number.length === 10;
};

export { normalizePhoneNumber, numberIsClickable };
