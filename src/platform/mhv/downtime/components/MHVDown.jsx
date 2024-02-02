import React from 'react';
import PropTypes from 'prop-types';
import { formatDatetime } from '../utils/date';

function MHVDown({ appTitle = 'This tool', endTime, startTime }) {
  const startString = startTime ? formatDatetime(startTime) : '';
  const endString = endTime ? formatDatetime(endTime) : '';
  return (
    <>
      <va-alert class="vads-u-margin-bottom--4" status="error" uswds visible>
        <h3 slot="headline">{appTitle} is down for maintenance</h3>
        <p>
          We’re working on My HealtheVet right now. If you have trouble using
          tools, check back after we're finished.
        </p>
        {startString && <p>Start time: {startString}</p>}
        {endString && <p>End time: {endString}</p>}
        <p>
          If you need any assistance, please contact your{' '}
          <va-link href="" text="near facilities" />
        </p>
      </va-alert>
    </>
  );
}

MHVDown.propTypes = {
  appTitle: PropTypes.string,
  endTime: PropTypes.instanceOf(Date),
  startTime: PropTypes.instanceOf(Date),
};

export default MHVDown;
