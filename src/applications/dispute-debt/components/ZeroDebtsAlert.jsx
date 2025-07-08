import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const ZeroDebtsAlert = () => {
  return (
    <>
      <br />
      <va-card
        show-shadow
        class="vads-u-padding--3 vads-u-margin-bottom--3"
        data-testid="zero-debts-alert-card"
      >
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--1p5 vads-u-font-size--h3">
          You don’t have any current VA debt
        </h2>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--1p5 vads-u-font-size--h4 vads-u-font-family--serif">
          Our records show you don’t have any current debt related to VA
          benefits. If you think this is incorrect, call the Debt Management
          Center (DMC) at <va-telephone contact={CONTACTS.DMC} /> (
          <va-telephone contact={CONTACTS[711]} tty />
          ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
        </p>
      </va-card>
      <va-additional-info trigger="If your debt isn't listed here">
        To dispute a benefit overpayment debt that’s not listed here, call us at{' '}
        <va-telephone contact={CONTACTS.DMC} /> (or{' '}
        <va-telephone contact={CONTACTS.DMC_OVERSEAS} international /> from
        overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </va-additional-info>
      <a
        className="vads-c-action-link--green vads-u-margin-top--1p5 vads-u-margin-bottom--2p5"
        href={`${environment.BASE_URL}`}
      >
        Go back to VA.gov
      </a>
    </>
  );
};
ZeroDebtsAlert.propTypes = {
  debtType: PropTypes.string,
};

export default ZeroDebtsAlert;
