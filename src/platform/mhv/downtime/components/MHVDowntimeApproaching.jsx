import React from 'react';
import PropTypes from 'prop-types';
import { formatDatetime } from '../utils/date';

function MHVDowntimeApproaching({
  appLabel = 'This tool',
  children,
  endTime,
  startTime,
}) {
  const startString = startTime ? formatDatetime(startTime) : '';
  const endString = endTime ? formatDatetime(endTime) : '';
  return (
    <>
      <va-alert
        class="vads-u-margin-bottom--4"
        status="warning"
        closeable
        uswds
        visible
      >
        <h3 slot="headline">{appLabel} will be down for maintenance</h3>
        <p>
          We’re going to work on My HealtheVet. If you have trouble using tools,
          check back after we're finished. Thank you for your patience.
        </p>
        {startString && (
          <p>
            Start time: <time dateTime={startTime}>{startString}</time>
          </p>
        )}
        {endString && (
          <p>
            End time: <time dateTime={endTime}>{endString}</time>
          </p>
        )}
        <p>
          If you need any assistance, please contact your{' '}
          <va-link href="" text="near facilities" />
        </p>
      </va-alert>
      {children}
    </>
  );
}

MHVDowntimeApproaching.propTypes = {
  appLabel: PropTypes.string,
  children: PropTypes.node,
  endTime: PropTypes.instanceOf(Date),
  startTime: PropTypes.instanceOf(Date),
};

export default MHVDowntimeApproaching;
