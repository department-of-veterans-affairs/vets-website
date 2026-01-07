import React from 'react';

import PropTypes from 'prop-types';
import FacilityInfo from './FacilityInfo';
import InfoAlert from '../../../components/InfoAlert';
import NewTabAnchor from '../../../components/NewTabAnchor';
import RequestAppointmentLink from './RequestAppointmentLink';

function BackendProviderServiceAlert({ facility, pageKey }) {
  const headline = `We can't load your providers right now`;

  return (
    <div aria-atomic="true" aria-live="assertive">
      <InfoAlert
        status="warning"
        headline={headline}
        className="vads-u-margin-top--3"
      >
        <>
          <p>
            We're sorry. There's a problem with our system. Try again later.
          </p>
          <p>If you need to schedule now, call your VA facility.</p>
          <RequestAppointmentLink pageKey={pageKey} />

          <FacilityInfo facility={facility} />
          <p>
            <NewTabAnchor href="/find-locations">
              Find a different VA health facility
            </NewTabAnchor>
          </p>
        </>
      </InfoAlert>
    </div>
  );
}

export default BackendProviderServiceAlert;

BackendProviderServiceAlert.propTypes = {
  facility: PropTypes.object,
  pageKey: PropTypes.string,
};
