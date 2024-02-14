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
  endString: PropTypes.string,
  startString: PropTypes.string,
  timeInterval: PropTypes.string,
};

export default MHVDowntimeApproaching;
