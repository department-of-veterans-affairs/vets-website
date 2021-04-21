import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

export const directDepositAlert = () => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  <div className="vads-u-padding-top--1p5" tabIndex="0">
    <p>
      <b>Note:</b> Any updates you make here to your bank account information
      won't change your existing accounts for VA education or health benefits.
    </p>
  </div>
);

export const bankInfoHelpText = (
  <AdditionalInfo triggerText="What if I don’t have a bank account?">
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
      Banking Program. After you have direct deposit set up, call the GI Bill
      Hotline at <Telephone contact={CONTACTS.GI_BILL} />. We’re here Monday
      through Friday, 8:00 a.m. to 7:00 p.m. ET.
    </p>

    <p>
      <strong>Note:</strong> The Department of the Treasury requires us to make
      electronic payments. If you don’t want to use direct deposit, you’ll need
      to call the Department of the Treasury at{' '}
      <Telephone contact={CONTACTS.TESC} />. Ask to talk with a representative
      about waiver requests. They can answer any questions or concerns you may
      have.
    </p>
  </AdditionalInfo>
);
