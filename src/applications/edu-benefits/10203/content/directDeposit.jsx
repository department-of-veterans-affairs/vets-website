import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

export const directDepositDescription = () => {
  return (
    <div>
      <p>
        VA makes payments only through direct deposit, also called electronic
        funds transfer (EFT). We will need to know where to deposit your Rogers
        STEM Scholarship payments if you are approved for it. Please provide
        your bank account type as well as your current routing number and your
        account number.
      </p>
      <img
        src="/img/direct-deposit-check-guide.png"
        alt="On a personal check, find your bank’s 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."
      />
    </div>
  );
};

const gaBankInfoHelpText = () => {
  window.dataLayer.push({
    event: 'edu-10203--form-help-text-clicked',
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
      or call{' '}
      <a className="help-phone-number-link" href="tel:1-800-333-1795">
        1-800-333-1795
      </a>
      .
    </p>
    <p>
      If you choose not to enroll, you’ll need to call the Department of
      Treasury at{' '}
      <a className="help-phone-number-link" href="tel:1-888-224-2950">
        1-888-224-2950
      </a>{' '}
      and speak to a representative handling waiver requests. They’ll encourage
      you to participate in EFT and address any questions or concerns you have.
    </p>
  </AdditionalInfo>
);
