import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

export const directDepositDescription = () => {
  return (
    <div className="vads-u-margin-top--2">
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
      information for some VA benefits, including{' '}
      {affectedBenefits || '[affected benefits]'}. These updates won’t change
      your bank account information for{' '}
      {unaffectedBenefits || '[unaffected benefits]'}.
    </p>
  </div>
);

export const bankInfoHelpText = (
  <AdditionalInfo
    triggerText="What if I don’t have a bank account?"
    onClick={gaBankInfoHelpText}
  >
    <p>
      The Veterans{' '}
      <a
        href="https://veteransbenefitsbanking.org/"
        target="_blank"
        rel="noreferrer"
      >
        Benefits Banking Program (VBBP)
      </a>{' '}
      provides a list of Veteran-friendly banks and credit unions. They’ll work
      with you to set up an account, or help you qualify for an account, so you
      can use direct deposit.
    </p>

    <p>
      To get started, call one of the participating banks or credit unions
      listed on the VBBP website. Be sure to mention the Veterans Benefits
      Banking Program.
    </p>

    <p>
      <strong>Note:</strong> The Department of the Treasury requires us to make
      electronic payments. If you don’t want to use direct deposit, you’ll need
      to call the Department of the Treasury at{' '}
      <Telephone contact={CONTACTS.TESC} />. Ask to talk with a representative
      who handles waiver requests. They can answer any questions or concerns you
      may have.
    </p>
  </AdditionalInfo>
);
