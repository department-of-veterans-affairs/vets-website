import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

export const directDepositDescription = () => {
  return (
    <div>
      <p>
        We make payments only through direct deposit, also called electronic
        funds transfer (EFT).
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
    event: 'form-help-text-clicked',
    'help-text-label': 'What if I don’t have a bank account?',
  });
};

export const directDepositAlert = ({
  affectedBenefits,
  unaffectedBenefits,
}) => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  <div className="vads-u-padding-top--1p5" tabIndex="0">
    <p>
      <b>Note:</b> Any updates you make here will change your bank account
      information for VA benefits, including{' '}
      {affectedBenefits || '[affected benefits]'}. These updates won’t change
      your information for {unaffectedBenefits || '[unaffected benefits]'}.
    </p>
  </div>
);

export const bankInfoHelpText = (
  <AdditionalInfo
    triggerText="What if I don’t have a bank account or don’t want to use direct deposit?"
    onClick={gaBankInfoHelpText}
  >
    <p>
      The Department of the Treasury requires all federal benefit payments be
      made by electronic funds transfer (EFT), also called direct deposit.
    </p>
    <p>
      If you don’t have a bank account, or don’t wish to provide your bank
      account information, you must receive your payment through Direct Express
      Debit MasterCard. To request a Direct Express Debit MasterCard:
      <ul>
        <li>
          Apply at{' '}
          <a
            href="https://www.usdirectexpress.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            www.usdirectexpress.com
          </a>{' '}
          <b>or</b>
        </li>
        <li>
          {' '}
          Call <Telephone contact={CONTACTS.GO_DIRECT} />
        </li>
      </ul>
    </p>
    <p>
      If you choose not to enroll, you’ll need to call the Department of the
      Treasury at <Telephone contact={CONTACTS.TESC} /> and speak to a
      representative handling waiver requests. They’ll encourage you to
      participate in EFT and address any questions or concerns you have.
    </p>
  </AdditionalInfo>
);
