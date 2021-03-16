import React from 'react';
import {
  getVideoKind,
  isAtlasLocation,
  getVAAppointmentLocationId,
} from '../../../../services/appointment';
import { VIDEO_TYPES } from '../../../../utils/constants';
import VideoLink from './VideoLink';
import AtlasLocation from './AtlasLocation';
import VAFacilityLocation from '../../../../components/VAFacilityLocation';

export default function VideoVisitLocation({ appointment, facility }) {
  const videoKind = getVideoKind(appointment);
  const isAtlas = isAtlasLocation(appointment);

  if (appointment.vaos.isPastAppointment && videoKind === VIDEO_TYPES.clinic) {
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
        {isAtlas && (
          <div className="vads-u-margin-top--2">
            <AtlasLocation appointment={appointment} />
          </div>
        )}
        {videoKind === VIDEO_TYPES.clinic &&
          !isAtlas && (
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
