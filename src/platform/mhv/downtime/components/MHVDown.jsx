import React from 'react';
import PropTypes from 'prop-types';
import { formatDatetime, formatElapsedHours } from '../utils/date';

function MHVDown({
  appTitle = 'some of our health tools',
  endTime,
  startTime,
}) {
  const startString = startTime ? formatDatetime(startTime) : '';
  const endString = endTime ? formatDatetime(endTime) : '';
  const timeInterval = formatElapsedHours(startTime, endTime);

  return (
    <>
      <va-alert class="vads-u-margin-bottom--4" status="error" uswds visible>
        <h3 slot="headline">Maintenance on My HealtheVet</h3>
        <p>
          We&#x2019;re working on My HealtheVet. The maintenance will last{' '}
          {timeInterval}. During this time, you may have trouble using
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
  endTime: PropTypes.instanceOf(Date),
  startTime: PropTypes.instanceOf(Date),
};

export default MHVDown;
