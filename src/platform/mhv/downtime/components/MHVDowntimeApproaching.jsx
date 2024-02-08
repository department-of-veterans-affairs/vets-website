import React from 'react';
import PropTypes from 'prop-types';
import { formatDatetime, formatElapsedHours } from '../utils/date';

function MHVDowntimeApproaching({
  appTitle = 'some of our health tools',
  endTime,
  startTime,
}) {
  const startString = startTime ? formatDatetime(startTime) : '';
  const endString = endTime ? formatDatetime(endTime) : '';
  const timeInterval = formatElapsedHours(startTime, endTime);

  return (
    <>
      <va-alert class="vads-u-margin-bottom--4" status="warning" uswds>
        <h3 slot="headline">Upcoming maintenance on My HealtheVet</h3>
        <p>
          We&#x2019;ll be working on My HealtheVet soon. The maintenance will
          last {timeInterval}. During this time, you may have trouble using{' '}
          {appTitle}.
        </p>
        {startString && (
          <p>
            <b>Start:</b> {startString}
          </p>
        )}
        {endString && (
          <p>
            <b>End:</b> {endString}
          </p>
        )}
      </va-alert>
    </>
  );
}

MHVDowntimeApproaching.propTypes = {
  appTitle: PropTypes.string,
  endTime: PropTypes.instanceOf(Date),
  startTime: PropTypes.instanceOf(Date),
};

export default MHVDowntimeApproaching;
