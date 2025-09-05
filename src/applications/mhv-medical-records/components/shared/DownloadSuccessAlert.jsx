/**
 * Alert Box component specific to access trouble
 *
 * @author Matthew Wright
 * @desc: Alert that displays when a download link is clicked and there are no data issues
 * @notes :
 */

import React, { useEffect } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { datadogRum } from '@datadog/browser-rum';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { ALERT_TYPE_SUCCESS } from '../../util/constants';

const DownloadSuccessAlert = ({
  className,
  type,
  focusId,
  recordEvent = recordEventFn,
}) => {
  const headline = `${type || 'Download'} started`;

  useEffect(
    () => {
      if (focusId) {
        focusElement(`#${focusId}`);
      }
    },
    [focusId],
  );

  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': ALERT_TYPE_SUCCESS,
      });
      datadogRum.addAction('Showed Alert Box: DownloadSuccessAlert');
    },
    [headline, recordEvent],
  );

  return (
    <VaAlert
      id={focusId}
      status={ALERT_TYPE_SUCCESS}
      className={`vads-u-margin-top--4 no-print ${className}`}
      role="alert"
      data-testid="alert-download-started"
    >
      <h2 slot="headline" data-testid="download-success-alert-message">
        {headline}
      </h2>
      <p className="vads-u-margin--0">
        Check your device’s downloads location for your file.
      </p>
    </VaAlert>
  );
};

export default DownloadSuccessAlert;

DownloadSuccessAlert.propTypes = {
  className: PropTypes.any,
  focusId: PropTypes.any,
  recordEvent: PropTypes.func,
  type: PropTypes.any,
};
