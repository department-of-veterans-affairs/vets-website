import React from 'react';
import {
  getVAAppointmentLocationId,
  isClinicVideoAppointment,
} from '../../../../services/appointment';
import VideoLink from './VideoLink';
import AtlasLocation from './AtlasLocation';
import VAFacilityLocation from '../../../../components/VAFacilityLocation';

export default function VideoVisitLocation({ appointment, facility }) {
  const { isAtlas } = appointment.videoData;

  if (
    appointment.vaos.isPastAppointment &&
    isClinicVideoAppointment(appointment)
  ) {
    return (
      <VAFacilityLocation
        facility={facility}
        clinicName={appointment.location?.clinicName}
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
        <VideoLink appointment={appointment} hasFacility={!!facility} />
        {isAtlas && (
          <div className="vads-u-margin-top--2">
            <AtlasLocation appointment={appointment} />
          </div>
        )}
        {isClinicVideoAppointment(appointment) &&
          !isAtlas && (
            <div className="vads-u-margin-top--2">
              <VAFacilityLocation
                facility={facility}
                clinicName={appointment.location?.clinicName}
                facilityId={getVAAppointmentLocationId(appointment)}
              />
            </div>
          )}
      </div>
    </>
  );
}
