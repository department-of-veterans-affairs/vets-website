import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

export const directDepositDescription = () => {
  return (
    <div className="vads-u-margin-top--2">
      <figure style={{ margin: 0 }}>
        <img
          src="/img/direct-deposit-check-guide.svg"
          alt="Personal checks have all the information to set up direct deposit"
        />
        <figcaption style={{ color: '#000', marginTop: '4px' }}>
          Your bank’s routing number is listed along the bottom-left edge of a
          personal check. Your account number is listed to the right of that.
          Routing numbers must be nine digits and account numbers can be up to
          17 digits.
        </figcaption>
      </figure>
    </div>
  );
};

const gaBankInfoHelpText = () => {
  recordEvent({
    event: 'form-help-text-clicked',
    'help-text-label': 'What if I don't have a bank account?',
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
  <va-additional-info
    trigger="What if I don’t have a bank account?"
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
      <va-telephone contact="8882242950" />. Ask to talk with a representative
      who handles waiver requests. They can answer any questions or concerns you
      may have.
    </p>
  </va-additional-info>
);
