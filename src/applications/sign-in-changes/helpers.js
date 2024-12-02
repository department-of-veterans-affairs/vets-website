import React from 'react';

export const maskEmail = (email, testid) => {
  if (!email) {
    return <span aria-label="No email provided" />;
  }
  const [name, domain] = email.split('@');
  const maskedName =
    name.length > 1
      ? name
          .split('')
          .map((n, idx) => (idx <= 2 ? n : '*'))
          .join('')
      : name;
  const maskedEmail = `${maskedName}@${domain}`;
  const ariaLabel = `Email address starting with ${name.slice(
    0,
    3,
  )} and ending with ${domain}`;

  return (
    <span data-testid={testid} aria-label={ariaLabel}>
      {maskedEmail}
    </span>
  );
};
