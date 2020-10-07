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

// Only use this when we need to pass data that comes back from one of our
// services files to one of the older api functions
function parseFakeFHIRId(id) {
  return id ? id.replace('var', '') : id;
}

export default function VideoVisitLocation({ appointment, facility }) {
  const videoKind = getVideoKind(appointment);
  const isAtlas = isAtlasLocation(appointment);

  if (appointment.vaos.isPastAppointment && videoKind === VIDEO_TYPES.clinic) {
    return (
      <VAFacilityLocation
        facility={facility}
        facilityId={parseFakeFHIRId(getVAAppointmentLocationId(appointment))}
      />
    );
  }

  if (appointment.vaos.isPastAppointment) {
    return <span>Video conference</span>;
  }

  return (
    <dl className="vads-u-margin--0">
      <dt className="vads-u-font-weight--bold">
        How to join your video appointment
      </dt>
      <dd>
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
                facilityId={parseFakeFHIRId(
                  getVAAppointmentLocationId(appointment),
                )}
              />
            </div>
          )}
      </dd>
    </dl>
  );
}
