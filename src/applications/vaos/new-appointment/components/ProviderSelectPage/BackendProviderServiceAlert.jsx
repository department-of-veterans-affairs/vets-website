import React from 'react';

import PropTypes from 'prop-types';
import InfoAlert from '../../../components/InfoAlert';
import NewTabAnchor from '../../../components/NewTabAnchor';
import FacilityPhone from '../../../components/FacilityPhone';
import { getFacilityPhone } from '../../../services/location';

import RequestAppointmentLink from './RequestAppointmentLink';

function BackendProviderServiceAlert({
  selectedFacility,
  isEligibleForRequest,
  overRequestLimit,
  pageKey = 'selectProvider',
}) {
  const facilityPhone = getFacilityPhone(selectedFacility);

  // Not eligible for requests or over the request limit
  const showCallToScheduleAlert = !isEligibleForRequest || overRequestLimit;

  return (
    <>
      {showCallToScheduleAlert && (
        // Patient is NOT eligible for requests
        <div
          aria-atomic="true"
          aria-live="assertive"
          data-testid="backend-relationship-service-alert-call"
        >
          <InfoAlert
            status="error"
            headline="You can't schedule an appointment online right now"
            className="vads-u-margin-top--3"
          >
            <p>
              We're sorry. There's a problem with our system. Try again later.
            </p>
            <p>If you need to schedule now, call your VA facility.</p>

            <p className="vaos-u-word-break--break-word">
              {selectedFacility.name}
              <br />
              Main phone: <FacilityPhone contact={facilityPhone} icon={false} />
            </p>
            <p>
              <NewTabAnchor href="/find-locations">
                Find a VA health facility
              </NewTabAnchor>
            </p>
          </InfoAlert>
        </div>
      )}

      {!showCallToScheduleAlert && (
        // Patient is eligible for requests
        <div
          aria-atomic="true"
          aria-live="assertive"
          data-testid="backend-relationship-service-alert-request"
        >
          <InfoAlert
            status="warning"
            headline="We can't load your providers right now"
            className="vads-u-margin-top--3"
          >
            <p>
              You can request your preferred date and time online. We’ll contact
              you within 2 business days after we receive your request to help
              you finish scheduling your appointment.
            </p>

            <RequestAppointmentLink pageKey={pageKey} />

            <p>You can also call to schedule.</p>

            <p className="vaos-u-word-break--break-word">
              {selectedFacility.name}
              <br />
              Main phone: <FacilityPhone contact={facilityPhone} icon={false} />
            </p>
            <p>
              <NewTabAnchor href="/find-locations">
                Find a different VA health facility
              </NewTabAnchor>
            </p>
          </InfoAlert>
        </div>
      )}
    </>
  );
}

export default BackendProviderServiceAlert;

BackendProviderServiceAlert.propTypes = {
  isEligibleForRequest: PropTypes.bool.isRequired,
  overRequestLimit: PropTypes.bool.isRequired,
  selectedFacility: PropTypes.object.isRequired,
  pageKey: PropTypes.string,
};
