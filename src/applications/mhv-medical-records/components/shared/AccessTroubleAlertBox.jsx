/**
 * Alert Box component specific to access trouble
 *
 * @author Matthew Wright
 * @desc: Alert that displays an access trouble message with embedded phone link
 * @notes :
 */

import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { ALERT_TYPE_ERROR, accessAlertTypes } from '../../util/constants';

const AccessTroubleAlertBox = props => {
  const { className, alertType, documentType } = props;

  return (
    <VaAlert
      status={ALERT_TYPE_ERROR}
      visible
      class={`vads-u-margin-top--4 ${className}`}
      aria-live="polite"
    >
      <h2 slot="headline" data-testid="expired-alert-message">
        {alertType === accessAlertTypes.DOCUMENT
          ? `We can't download your ${documentType} right now`
          : `We can’t access your ${alertType} records right now`}
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

export default AccessTroubleAlertBox;

AccessTroubleAlertBox.propTypes = {
  alertType: PropTypes.string.isRequired,
  className: PropTypes.any,
  documentType: PropTypes.string,
};
