import React from 'react';
import PropTypes from 'prop-types';
import InfoAlert from '../../../components/InfoAlert';
import FacilityInfo from './FacilityInfo';
import NewTabAnchor from '../../../components/NewTabAnchor';

function CantScheduleOnlineAlert({ selectedFacility }) {
  const headline = `You can't schedule an appointment online right now`;

  return (
    <div aria-atomic="true" aria-live="assertive">
      <InfoAlert
        status="error"
        headline={headline}
        className="vads-u-margin-top--3"
      >
        <>
          <p>
            We're sorry. There's a problem with our system. Try again later.
          </p>
          <p>If you need to schedule now, call your VA facility.</p>

          <FacilityInfo selectedFacility={selectedFacility} />

          <p>
            <NewTabAnchor href="/find-locations">
              Find a VA health facility
            </NewTabAnchor>
          </p>
        </>
      </InfoAlert>
    </div>
  );
}

CantScheduleOnlineAlert.propTypes = {
  selectedFacility: PropTypes.object.isRequired,
};

export default CantScheduleOnlineAlert;
