import React from 'react';

/**
 * Show one thing, have a screen reader say another.
 *
 * @param {ReactElement|ReactComponent|String} srIgnored -- Thing to be displayed visually,
 *                                                           but ignored by screen readers
 * @param {String} substitutionText -- Text for screen readers to say instead of srIgnored
 */
export const srSubstitute = (srIgnored, substitutionText) => (
  <span>
    <span aria-hidden>{srIgnored}</span>
    <span className="sr-only">{substitutionText}</span>
  </span>
);

export const maskBankInformation = (string, unmaskedLength) => {
  // If no string is given, tell the screen reader users the account or routing number is blank
  if (!string) {
    return srSubstitute('', 'is blank');
  }
  const repeatCount =
    string.length > unmaskedLength ? string.length - unmaskedLength : 0;
  const maskedString = srSubstitute(
    `${'●'.repeat(repeatCount)}`,
    'ending with',
  );
  return (
    <span>
      {maskedString}
      {string.slice(-unmaskedLength)}
    </span>
  );
};
