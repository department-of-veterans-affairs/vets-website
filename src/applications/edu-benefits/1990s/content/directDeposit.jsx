import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const directDepositAlert = () => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  <div className="vads-u-padding-top--1p5" tabIndex="0">
    <p>
      <b>Note:</b> Any updates you make here to your bank account information
      won’t change your existing accounts for VA education or health benefits.
    </p>
  </div>
);

export const bankInfoHelpText = (
  <VaAdditionalInfo trigger="What if I don’t have a bank account?">
    <p>
      The{' '}
      <a
        href="https://veteransbenefitsbanking.org/"
        target="_blank"
        rel="noreferrer"
      >
        Veterans Benefits Banking Program (VBBP)
      </a>{' '}
      provides a list of Veteran-friendly banks and credit unions. They’ll work
      with you to set up an account, or help you qualify for an account, so you
      can use direct deposit.
    </p>

    <p>
      To get started, call one of the participating banks or credit unions
      listed on the VBBP website. Be sure to mention the Veterans Benefits
      Banking Program. After you have direct deposit set up, call the GI Bill
      Hotline at <va-telephone contact={CONTACTS.GI_BILL} />. We’re here Monday
      through Friday, 8:00 a.m. to 7:00 p.m. ET.
    </p>

    <p>
      <strong>Note:</strong> The Department of the Treasury requires us to make
      electronic payments. If you don’t want to use direct deposit, you’ll need
      to call the Department of the Treasury at{' '}
      <va-telephone contact={CONTACTS.TESC} />. Ask to talk with a
      representative about waiver requests. They can answer any questions or
      concerns you may have.
    </p>
  </VaAdditionalInfo>
);

export const paymentText = (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  <div tabIndex="0">
    We make payments only through direct deposit, also called electronic funds
    transfer (EFT). Please provide your direct deposit information below. We’ll
    send your housing payment to this account.
  </div>
);
