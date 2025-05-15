import React from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const AccessTroubleAlertBox = props => {
  const { className, documentType } = props;
  const headline = `We can’t download your ${documentType} right now`;

  return (
    <VaAlert
      status="error"
      visible
      class={`vads-u-margin-top--4 ${className}`}
      aria-live="polite"
    >
      <h2 slot="headline" data-testid="expired-alert-message">
        {headline}
      </h2>
      <p>We’re sorry. There’s a problem with our system. Check again later.</p>
      <p>
        If it still doesn’t work, call us at{' '}
        <va-telephone contact={CONTACTS.MY_HEALTHEVET} /> (
        <va-telephone tty contact={CONTACTS['711']} />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </VaAlert>
  );
};

AccessTroubleAlertBox.propTypes = {
  className: PropTypes.any,
  documentType: PropTypes.string,
  testId: PropTypes.string,
};

export default AccessTroubleAlertBox;
