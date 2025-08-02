/**
 * Alert Box component specific to access trouble
 *
 * @author Matthew Wright
 * @desc: Alert that displays an access trouble message with embedded phone link
 * @notes :
 */

import React, { useEffect, useRef } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { ALERT_TYPE_ERROR, accessAlertTypes } from '../../util/constants';
import { focusOnErrorField } from '../../util/helpers';

const AccessTroubleAlertBox = props => {
  const { className, alertType, documentType } = props;
  const alertRef = useRef(null);

  useEffect(() => {
    if (alertRef.current?.shadowRoot) {
      const focusTarget = alertRef.current.shadowRoot.querySelector(
        '[tabindex], [role="alert"], h2, p',
      );

      if (focusTarget) {
        focusOnErrorField(focusTarget);
      }
    }
  }, []);

  return (
    <VaAlert
      status={ALERT_TYPE_ERROR}
      visible
      class={`vads-u-margin-top--4 ${className}`}
      aria-live="assertive"
      tabIndex={-1} // Make it focusable
      ref={alertRef}
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
