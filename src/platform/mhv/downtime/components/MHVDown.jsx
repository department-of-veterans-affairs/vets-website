import React from 'react';
import PropTypes from 'prop-types';
import { parseDate, formatDatetime } from '../utils/date';

function MHVDown({ startTime, endTime, appLabel = 'This tool' }) {
  const startDate = parseDate(startTime);
  const startString = startDate ? formatDatetime(startDate) : '';
  const endDate = parseDate(endTime);
  const endString = endDate ? formatDatetime(endDate) : '';
  return (
    <va-alert class="vads-u-margin-bottom--4" status="error" uswds visible>
      <h3 slot="headline">{appLabel} is down for maintenance</h3>
      <p>
        We’re working on My HealtheVet right now. If you have trouble using
        tools, check back after we're finished.
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
      )}{' '}
    </va-alert>
  );
}

MHVDown.propTypes = {
  appLabel: PropTypes.string,
  endTime: PropTypes.string,
  startTime: PropTypes.string,
};

export default MHVDown;
