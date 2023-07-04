import React from 'react';
import PropTypes from 'prop-types';
import {
  getVAAppointmentLocationId,
  isClinicVideoAppointment,
} from '../../../services/appointment';
import { VIDEO_TYPES } from '../../../utils/constants';
import AppointmentDateTime from '../AppointmentDateTime';
import BackLink from '../../../components/BackLink';
// import Breadcrumbs from '../../../components/Breadcrumbs';
import CalendarLink from './CalendarLink';
import StatusAlert from './StatusAlert';
import TypeHeader from './TypeHeader';
import PrintLink from './PrintLink';
import VideoVisitProvider from './VideoVisitProvider';
import NoOnlineCancelAlert from './NoOnlineCancelAlert';
import VideoInstructionsLink from './VideoInstructionsLink';
import VideoLocation from './VideoLocation';

function formatHeader(appointment) {
  if (appointment.videoData.kind === VIDEO_TYPES.gfe) {
    return 'VA Video Connect using VA device';
  }
  if (isClinicVideoAppointment(appointment)) {
    return 'VA Video Connect at VA location';
  }
  if (appointment.videoData.isAtlas) {
    return 'VA Video Connect at an ATLAS location';
  }
  return 'VA Video Connect at home';
}

export default function DetailsVideo({ appointment, facilityData }) {
  const locationId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[locationId];

  const header = formatHeader(appointment);

  return (
    <>
      {/* <Breadcrumbs>
        <a
          href={`/health-care/schedule-view-va-appointments/appointments/va/${
            appointment.id
          }`}
        >
          Appointment detail
        </a>
      </Breadcrumbs> */}
      <BackLink appointment={appointment} />

      <h1 style={{ marginTop: '2rem' }}>
        <AppointmentDateTime appointment={appointment} />
      </h1>

      <StatusAlert appointment={appointment} facility={facility} />

      <TypeHeader isVideo>{header}</TypeHeader>

      <VideoLocation appointment={appointment} facility={facility} />

      <VideoVisitProvider appointment={appointment} />

      <VideoInstructionsLink appointment={appointment} />

      <CalendarLink appointment={appointment} facility={facility} />
      <PrintLink appointment={appointment} />
      <NoOnlineCancelAlert appointment={appointment} facility={facility} />
    </>
  );
}

DetailsVideo.propTypes = {
  appointment: PropTypes.object.isRequired,
  facilityData: PropTypes.object,
};
