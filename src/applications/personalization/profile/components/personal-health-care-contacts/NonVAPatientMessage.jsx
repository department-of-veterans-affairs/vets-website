import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import PropTypes from 'prop-types';

const NonVAPatientMessage = ({ testId }) => (
  <>
    <p data-testid={testId}>
      Our records show that you don’t currently receive VA health care benefits.
    </p>
    <p>
      If you think this is an error, call us at{' '}
      <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
    </p>
    <a href="/health-care/about-va-health-benefits">
      Learn more about VA health benefits
    </a>
  </>
);

NonVAPatientMessage.defaultProps = {
  testId: 'non-va-patient-message',
};

NonVAPatientMessage.propTypes = {
  testId: PropTypes.string,
};

export default NonVAPatientMessage;
