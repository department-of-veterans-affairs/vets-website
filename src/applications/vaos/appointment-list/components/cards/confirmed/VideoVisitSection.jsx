import React from 'react';
import { getVAAppointmentLocationId } from '../../../../services/appointment';
import { VIDEO_TYPES } from '../../../../utils/constants';
import VideoLink from './VideoLink';
import AtlasLocation from './AtlasLocation';
import VAFacilityLocation from '../../../../components/VAFacilityLocation';

export default function VideoVisitLocation({ appointment, facility }) {
  const videoData = appointment.videoData;
  if (
    appointment.vaos.isPastAppointment &&
    appointment.videoData.kind === VIDEO_TYPES.clinic
  ) {
    return (
      <VAFacilityLocation
        facility={facility}
        facilityId={getVAAppointmentLocationId(appointment)}
      />
    );
  }

  if (appointment.vaos.isPastAppointment) {
    return <span>Video conference</span>;
  }

  return (
    <>
      <h4 className="vaos-appts__block-label">
        How to join your video appointment
      </h4>
      <div>
        <VideoLink appointment={appointment} />
        {videoData.isAtlas && (
          <div className="vads-u-margin-top--2">
            <AtlasLocation appointment={appointment} />
          </div>
        )}
        {appointment.videoData.kind === VIDEO_TYPES.clinic &&
          !videoData.isAtlas && (
            <div className="vads-u-margin-top--2">
              <VAFacilityLocation
                facility={facility}
                facilityId={getVAAppointmentLocationId(appointment)}
              />
            </div>
          )}
      </div>
    </>
  );
}
