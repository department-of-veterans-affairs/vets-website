export const maskEmail = email => {
  if (!email) {
    return '';
  }
  const [name, domain] = email.split('@');
  const maskedName =
    name.length > 1
      ? name
          .split('')
          .map((n, idx) => (idx <= 2 ? n : '*'))
          .join('')
      : name;
  return `${`${maskedName}@${domain}`}`;
};
