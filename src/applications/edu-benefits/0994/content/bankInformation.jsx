import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

export const bankInfoTitle = <h4>Direct deposit information</h4>;

export const bankInfoDescription =
  'This is the bank account information we have on file for you. We’ll pay your housing stipend to this account.';

export const bankInfoNote = (
  <p>
    <strong>Note: </strong>
    Any updates you make here to your contact information will also apply to
    your other VA benefits, including compensation, pension, and education.
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
      If you don’t have a bank account, or don’t wish to provide your bank
      account information, you must receive your payment through Direct Express
      Debit MasterCard. To request a Direct Express Debit MasterCard, apply at{' '}
      <a
        href="https://www.usdirectexpress.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        www.usdirectexpress.com
      </a>{' '}
      or call 1-800-333-1795.
    </p>
    <p>
      If you choose not to enroll, you’ll need to call the Department of
      Treasury at 1-888-224-2950 and speak to a representative handling waiver
      requests. They’ll encourage you to participate in EFT and address any
      questions or concerns you have.
    </p>
  </AdditionalInfo>
);
