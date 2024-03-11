import React from 'react';
import PropTypes from 'prop-types';

function MHVDowntimeApproaching({
  appTitle = 'some of our health tools',
  endString,
  startString,
  timeInterval,
}) {
  return (
    <>
      <va-alert class="vads-u-margin-bottom--4" status="warning" uswds>
        <h2 slot="headline">Upcoming maintenance on My HealtheVet</h2>
        <p>
          We&#x2019;ll be working on My HealtheVet soon. The maintenance will
          last {timeInterval}. During this time, won't be able to use this{' '}
          {appTitle} tool.
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
  endString: PropTypes.string,
  startString: PropTypes.string,
  timeInterval: PropTypes.string,
};

export default MHVDowntimeApproaching;
