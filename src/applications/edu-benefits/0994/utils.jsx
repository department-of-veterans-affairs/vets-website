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

export const hasNewBankInformation = (bankAccount = {}) => {
  const { accountType, accountNumber, routingNumber } = bankAccount;
  return accountType || accountNumber || routingNumber;
};

export const VerifiedAlert = (
  <div>
    <div className="usa-alert usa-alert-info schemaform-sip-alert">
      <div className="usa-alert-body">
        <strong>Note:</strong> Since you’re signed in to your account and your
        account is verified, we can prefill part of your application based on
        your account details. You can also save your form in progress for up to
        1 year and come back later to finish filling it out.
      </div>
    </div>
    <br />
  </div>
);
