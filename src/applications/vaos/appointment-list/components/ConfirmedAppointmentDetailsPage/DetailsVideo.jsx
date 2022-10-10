import React from 'react';
import {
  getVAAppointmentLocationId,
  isClinicVideoAppointment,
} from '../../../services/appointment';
import { VIDEO_TYPES } from '../../../utils/constants';
import AppointmentDateTime from '../AppointmentDateTime';
import Breadcrumbs from '../../../components/Breadcrumbs';
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
  } else if (isClinicVideoAppointment(appointment)) {
    return 'VA Video Connect at VA location';
  } else if (appointment.videoData.isAtlas) {
    return 'VA Video Connect at an ATLAS location';
  } else {
    return 'VA Video Connect at home';
  }
}

export default function DetailsVideo({ appointment, facilityData }) {
  const locationId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[locationId];

  const header = formatHeader(appointment);

  return (
    <>
      <Breadcrumbs>
        <va-link to={`/va/${appointment.id}`} text="Appointment detail" />
      </Breadcrumbs>

      <h1>
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
