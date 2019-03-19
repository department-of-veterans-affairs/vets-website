import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

export const bankInfoDescription =
  'This is the bank account information we have on file for you. We’ll pay your housing stipend to this account.';

export const bankInfoNote = (
  <p>
    <strong>Note: </strong>
    Any updates you make here to your bank account information will also apply
    to your other VA benefits, including compensation, pension, and education.
  </p>
);

const gaBankInfoHelpText = () => {
  window.dataLayer.push({
    event: 'edu-0994--form-help-text-clicked',
    'help-text-label': 'What if I don’t have a bank account?',
  });
};

export const bankInfoHelpText = (
  <AdditionalInfo
    triggerText="What if I don’t have a bank account?"
    onClick={gaBankInfoHelpText}
  >
    <p>
      The Department of Treasury requires all federal benefit payments be made
      by electronic funds transfer (EFT), also called direct deposit.
    </p>
    <p>
      If you do not have a bank account, you must receive your payment through
      Direct Express Debit MasterCard. To request a Direct Express Debit
      MasterCard, apply at{' '}
      <a
        href="https://www.usdirectexpress.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        www.usdirectexpress.com
      </a>{' '}
      or call{' '}
      <a className="help-phone-number-link" href="tel:1-800-333-1795">
        1-800-333-1795
      </a>
      .
    </p>
    <p>
      If you elect not to enroll, you must contact representatives handling
      waiver requests for the Department of Treasury at{' '}
      <a className="help-phone-number-link" href="tel:1-888-224-2950">
        1-888-224-2950
      </a>
      . They will encourage your participation in EFT and address any questions
      or concerns you may have.
    </p>
  </AdditionalInfo>
);
