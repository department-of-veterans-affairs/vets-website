import React from 'react';
import FacilityPhone from '../../../components/FacilityPhone';
import NewTabAnchor from '../../../components/NewTabAnchor';
import InfoAlert from '../../../components/InfoAlert';
import { getFacilityPhone } from '../../../services/location';

export default function CantScheduleOnlineAlert({ facility }) {
  const headline = `You can't schedule an appointment online right now`;
  const facilityPhone = getFacilityPhone(facility);
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

          <p className="vaos-u-word-break--break-word">
            {facility.name}
            <br />
            Main phone: <FacilityPhone contact={facilityPhone} icon={false} />
          </p>

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
