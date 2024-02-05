import React from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { formatDatetime } from '../utils/date';

function MHVDowntimeApproaching({
  appTitle,
  dismissDowntimeWarning,
  isDowntimeWarningDismissed,
  endTime,
  startTime,
}) {
  const startString = startTime ? formatDatetime(startTime) : '';
  const endString = endTime ? formatDatetime(endTime) : '';
  const close = () => {
    dismissDowntimeWarning(appTitle);
  };
  return (
    <>
      <VaAlert
        class="vads-u-margin-bottom--4"
        status="warning"
        closeable
        uswds
        visible={!isDowntimeWarningDismissed}
        onCloseEvent={close}
      >
        <h3 slot="headline">{appTitle} will be down for maintenance</h3>
        <p>
          We’re going to work on My HealtheVet. If you have trouble using tools,
          check back after we're finished. Thank you for your patience.
        </p>
        {startString && <p>Start time: {startString}</p>}
        {endString && <p>End time: {endString}</p>}
        <p>
          If you need any assistance, please contact your{' '}
          <va-link href="" text="near facilities" />
        </p>
      </VaAlert>
    </>
  );
}

MHVDowntimeApproaching.propTypes = {
  appTitle: PropTypes.string.isRequired,
  dismissDowntimeWarning: PropTypes.func.isRequired,
  isDowntimeWarningDismissed: PropTypes.bool.isRequired,
  endTime: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.any, // Momentjs object
  ]),
  startTime: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.any, // Momentjs object
  ]),
};

export default MHVDowntimeApproaching;
