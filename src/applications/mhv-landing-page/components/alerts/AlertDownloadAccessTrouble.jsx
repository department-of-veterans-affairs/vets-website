import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { datadogRum } from '@datadog/browser-rum';

const AlertDownloadAccessTrouble = ({
  className,
  headline,
  recordEvent,
  testId,
}) => {
  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': 'warning',
      });
      datadogRum.addAction('Showed Alert Box: Pdf download access trouble');
    },
    [headline, recordEvent],
  );

  return (
    <VaAlert
      status="error"
      visible
      class={`vads-u-margin-top--4 ${className}`}
      aria-live="polite"
      data-testid={testId}
    >
      <h2 slot="headline">{headline}</h2>
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

AlertDownloadAccessTrouble.defaultProps = {
  headline: 'We can’t download your report right now',
  recordEvent: recordEventFn,
  testId: 'mhv-alert--download-access-trouble',
};

AlertDownloadAccessTrouble.propTypes = {
  className: PropTypes.string,
  headline: PropTypes.string,
  recordEvent: PropTypes.func,
  testId: PropTypes.string,
};

export default AlertDownloadAccessTrouble;
