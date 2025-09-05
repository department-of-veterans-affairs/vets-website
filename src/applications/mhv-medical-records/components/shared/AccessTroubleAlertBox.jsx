/**
 * Alert Box component specific to access trouble
 *
 * @author Matthew Wright
 * @desc: Alert that displays an access trouble message with embedded phone link
 * @notes :
 */

import React, { useEffect } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { datadogRum } from '@datadog/browser-rum';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { ALERT_TYPE_ERROR, accessAlertTypes } from '../../util/constants';

const AccessTroubleAlertBox = ({
  className,
  alertType,
  documentType,
  recordEvent = recordEventFn,
}) => {
  const headline =
    alertType === accessAlertTypes.DOCUMENT
      ? `We can't download your ${documentType} right now`
      : `We can’t access your ${alertType} records right now`;

  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': ALERT_TYPE_ERROR,
      });
      datadogRum.addAction('Showed Alert Box: AccessTroubleAlertBox');
    },
    [headline, recordEvent],
  );

  return (
    <VaAlert
      status={ALERT_TYPE_ERROR}
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

export default AccessTroubleAlertBox;

AccessTroubleAlertBox.propTypes = {
  alertType: PropTypes.string.isRequired,
  className: PropTypes.any,
  documentType: PropTypes.string,
  recordEvent: PropTypes.func,
};
