import React from 'react';
import PropTypes from 'prop-types';

const NonVAPatientMessage = ({ testId }) => (
  <>
    <p data-testid={testId}>
      Our records show that you don’t currently receive health care benefits
      from the VA.
    </p>
    <p>
      If you think this is an error, call us at{' '}
      <va-telephone contact="8008271000" />
      <va-telephone contact="711">TTY : 711</va-telephone>. We’re here Monday
      through Friday, 8:00 a.m. to 9:00 p.m. ET.
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
