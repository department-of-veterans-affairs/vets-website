export const maskEmail = email => {
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
