import React from 'react';
import PropTypes from 'prop-types';
import { formatDatetime, formatElapsedHours } from '../utils/date';

function MHVDowntimeApproaching({
  appTitle = 'My HealtheVet',
  endTime,
  startTime,
}) {
  const startString = startTime ? formatDatetime(startTime) : '';
  const endString = endTime ? formatDatetime(endTime) : '';
  const timeInterval = formatElapsedHours(startTime, endTime);

  return (
    <>
      <va-alert class="vads-u-margin-bottom--4" status="warning" uswds>
        <h3 slot="headline">Upcoming maintenance on {appTitle}</h3>
        <p>
          We&#x2019;ll be working on My HealtheVet soon. The maintenance will
          last {timeInterval}. During this time, you may have trouble using some
          of our health tools.
        </p>
        {startString && <p>Start time: {startString}</p>}
        {endString && <p>End time: {endString}</p>}
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
