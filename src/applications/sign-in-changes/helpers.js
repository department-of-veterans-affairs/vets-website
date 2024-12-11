import React from 'react';

export const maskEmail = (email, testid) => {
  if (!email) {
    return <span data-testid={testid}>No email provided</span>;
  }

  const [displayedEmail, domain] = email.split('@');

  // Display the first 3 characters of the email
  const displayedChars =
    displayedEmail.length >= 3
      ? displayedEmail.substring(0, 3)
      : displayedEmail;

  // Obfuscate the rest of the email with asterisks
  const obfuscatedChars =
    displayedChars.length >= 3 ? '*'.repeat(displayedEmail.length - 3) : '';

  // Create an aria-label for screen reader users
  const ariaLabel = `Email address starting with ${displayedChars} at ${domain}`;

  return (
    <span aria-label={ariaLabel} data-testid={testid}>
      {displayedChars}
      <span aria-hidden="true">
        {obfuscatedChars}@{domain}
      </span>
    </span>
  );
};
