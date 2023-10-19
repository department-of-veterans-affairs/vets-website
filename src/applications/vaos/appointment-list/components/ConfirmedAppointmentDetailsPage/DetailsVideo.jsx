import React from 'react';
import PropTypes from 'prop-types';
import {
  getVAAppointmentLocationId,
  isClinicVideoAppointment,
} from '../../../services/appointment';
import { VIDEO_TYPES } from '../../../utils/constants';
import AppointmentDateTime from '../AppointmentDateTime';
import BackLink from '../../../components/BackLink';
import Breadcrumbs from '../../../components/Breadcrumbs';
import CalendarLink from './CalendarLink';
import StatusAlert from './StatusAlert';
import TypeHeader from './TypeHeader';
import PrintLink from './PrintLink';
import VideoVisitProvider from './VideoVisitProvider';
import NoOnlineCancelAlert from './NoOnlineCancelAlert';
import VideoInstructionsLink from './VideoInstructionsLink';
import VideoLocation from './VideoLocation';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

function formatHeader(appointment) {
  const patientHasMobileGfe =
    appointment.videoData.extension?.patientHasMobileGfe;
  if (
    (appointment.videoData.kind === VIDEO_TYPES.mobile ||
      appointment.videoData.kind === VIDEO_TYPES.adhoc) &&
    (!appointment.videoData.isAtlas && patientHasMobileGfe)
  ) {
    return 'VA Video Connect using VA device';
  }
  if (
    (appointment.videoData.kind === VIDEO_TYPES.mobile ||
      appointment.videoData.kind === VIDEO_TYPES.adhoc) &&
    (!appointment.videoData.isAtlas && !patientHasMobileGfe)
  ) {
    return 'VA Video Connect at home';
  }
  if (isClinicVideoAppointment(appointment)) {
    return 'VA Video Connect at VA location';
  }
  if (appointment.videoData.isAtlas) {
    return 'VA Video Connect at an ATLAS location';
  }
  return null;
}

export default function DetailsVideo({ appointment, facilityData }) {
  const locationId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[locationId];
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const showBackLink = useToggleValue(
    TOGGLE_NAMES.vaOnlineSchedulingDescriptiveBackLink,
  );

  const header = formatHeader(appointment);

  return (
    <>
      {showBackLink ? (
        <BackLink appointment={appointment} />
      ) : (
        <Breadcrumbs>
          <a
            href={`/health-care/schedule-view-va-appointments/appointments/va/${
              appointment.id
            }`}
          >
            Appointment detail
          </a>
        </Breadcrumbs>
      )}

      <h1 className="vads-u-margin-y--2p5">
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
  appointment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    vaos: PropTypes.shape({
      isPastAppointment: PropTypes.bool.isRequired,
      isUpcomingAppointment: PropTypes.bool.isRequired,
      isPendingAppointment: PropTypes.bool.isRequired,
    }),
    location: PropTypes.shape({
      vistaId: PropTypes.string.isRequired,
      clinicId: PropTypes.string.isRequired,
      stationId: PropTypes.string.isRequired,
      clinicName: PropTypes.string.isRequired,
    }),
  }),
  facilityData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    vistaId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
};
DetailsVideo.defaultProps = {
  appointment: {
    id: '',
    start: '',
    comment: '',
    vaos: {
      isPastAppointment: false,
      isUpcomingAppointment: false,
      isPendingAppointment: false,
      isVideo: false,
      isAtlas: false,
      extension: { patientHasMobileGfe: false },
      kind: '',
    },
    location: {
      vistaId: '',
      clinicId: '',
      stationId: '',
      clinicName: '',
    },
  },
  facilityData: {
    id: '',
    vistaId: '',
    name: '',
  },
};
