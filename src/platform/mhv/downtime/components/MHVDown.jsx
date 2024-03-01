import React from 'react';
import PropTypes from 'prop-types';

function MHVDown({
  appTitle = 'some of our health tools',
  endString,
  startString,
  timeInterval,
}) {
  return (
    <>
      <va-alert class="vads-u-margin-bottom--4" status="error" uswds visible>
        <h2 slot="headline">Maintenance on My HealtheVet</h2>
        <p>
          We&#x2019;re working on My HealtheVet. The maintenance will last{' '}
          {timeInterval}. During this time, you may have trouble using{' '}
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
        <p>
          If you need to contact your care team during this time, call your VA
          health facility.
        </p>
        <p>
          Find your{' '}
          <va-link
            href="/find-locations/?facilityType=health"
            text="VA health facility"
          />
        </p>
      </va-alert>
    </>
  );
}

MHVDown.propTypes = {
  appTitle: PropTypes.string,
  endString: PropTypes.string,
  startString: PropTypes.string,
  timeInterval: PropTypes.string,
};

export default MHVDown;
