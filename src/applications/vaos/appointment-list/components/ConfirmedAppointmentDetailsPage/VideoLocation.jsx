import React from 'react';
import PropTypes from 'prop-types';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import {
  isClinicVideoAppointment,
  isVideoHome,
} from '../../../services/appointment';
import { VIDEO_TYPES } from '../../../utils/constants';
import AtlasLocation from './AtlasLocation';
import VideoLink from './VideoLink';

export default function VideoLocation({ appointment, facility }) {
  const isPast = appointment.vaos.isPastAppointment;
  const genericPastContent = <span>Video conference</span>;

  if (isClinicVideoAppointment(appointment)) {
    return (
      <>
        {!isPast && (
          <span>
            You must join this video meeting from the VA location{' '}
            {facility ? 'listed below' : 'where the appointment was scheduled'}.
          </span>
        )}
        {isPast && genericPastContent}

        <div className="vads-u-margin-top--2">
          <VAFacilityLocation
            facility={facility}
            facilityId={appointment.location.stationId}
            clinicFriendlyName={appointment.location.clinicName}
            clinicPhysicalLocation={
              appointment.location?.clinicPhysicalLocation
            }
          />
        </div>
      </>
    );
  }

  if (appointment.videoData.isAtlas) {
    return (
      <>
        {!isPast && (
          <span>
            You must join this video meeting from the ATLAS (non-VA) location
            listed below.
          </span>
        )}
        {isPast && genericPastContent}

        <div className="vads-u-margin-top--2">
          <AtlasLocation appointment={appointment} isPast={isPast} />
        </div>
      </>
    );
  }

  if (appointment.videoData.kind === VIDEO_TYPES.gfe) {
    return (
      <>
        {!isPast && (
          <span>
            You can join this video meeting using a device provided by VA.
          </span>
        )}
        {isPast && genericPastContent}
      </>
    );
  }

  if (isVideoHome(appointment)) {
    return (
      <>
        {!isPast && <VideoLink appointment={appointment} />}
        {isPast && genericPastContent}
      </>
    );
  }

  return null;
}

VideoLocation.propTypes = {
  appointment: PropTypes.object.isRequired,
  facility: PropTypes.object,
};
