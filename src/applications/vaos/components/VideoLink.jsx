import React from 'react';
import PropTypes from 'prop-types';
import NewTabAnchor from './NewTabAnchor';
import { ClinicOrFacilityPhone } from './layouts/DetailPageLayout';

export default function VideoLink({ appointment }) {
  const { url } = appointment.videoData;
  const { clinicPhone, clinicPhoneExtension, facilityPhone } = appointment;
  const displayVideoLink = appointment.videoData.displayLink;

  return (
    <div className="vaos-appts__video-visit">
      {!displayVideoLink && (
        <>
          We’ll add the link to join this appointment on this page 30 minutes
          before your appointment time.
        </>
      )}

      {displayVideoLink &&
        !url && (
          <div className="vads-u-margin-y--1">
            <va-alert
              close-btn-aria-label="Close notification"
              status="error"
              visible
            >
              <h3 slot="headline">
                We’re sorry, we couldn’t load the link to join your appointment
              </h3>
              <p className="vads-u-margin-y--0">
                Please contact your facility for help joining this appointment.
              </p>
              <ClinicOrFacilityPhone
                clinicPhone={clinicPhone}
                clinicPhoneExtension={clinicPhoneExtension}
                facilityPhone={facilityPhone}
              />
            </va-alert>
          </div>
        )}
      {displayVideoLink &&
        !!url && (
          <>
            Join the video appointment using the link.
            <br />
            <NewTabAnchor
              href={url}
              className="vads-c-action-link--green vaos-hide-for-print vads-u-margin-top--2"
              aria-describedby={`description-join-link-${appointment.id}`}
            >
              Join appointment
            </NewTabAnchor>
          </>
        )}
    </div>
  );
}

VideoLink.propTypes = {
  appointment: PropTypes.object.isRequired,
};
