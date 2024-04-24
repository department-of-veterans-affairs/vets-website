import React from 'react';
import PropTypes from 'prop-types';
import BackLink from '../../../components/BackLink';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import { getVAAppointmentLocationId } from '../../../services/appointment';
import AppointmentDateTime from '../AppointmentDateTime';
import CalendarLink from './CalendarLink';
import CancelLink from './CancelLink';
import StatusAlert from './StatusAlert';
import TypeHeader from './TypeHeader';
import PrintLink from './PrintLink';
import VAInstructions from './VAInstructions';
import NoOnlineCancelAlert from './NoOnlineCancelAlert';
import PhoneInstructions from './PhoneInstructions';
import { selectTypeOfCareName } from '../../redux/selectors';
import { APPOINTMENT_STATUS } from '../../../utils/constants';
import { formatHeader } from './DetailsVA.util';

export default function DetailsVA({ appointment, facilityData }) {
  const locationId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[locationId];
  const isCovid = appointment.vaos.isCOVIDVaccine;
  const header = formatHeader(appointment);
  const {
    isPastAppointment,
    isCompAndPenAppointment,
    isPhoneAppointment,
    isCancellable: isAppointmentCancellable,
  } = appointment.vaos;
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;

  const typeOfCareName = selectTypeOfCareName(appointment);
  // we don't want to display the appointment type header for upcoming C&P appointments.
  const displayTypeHeader =
    !isCompAndPenAppointment ||
    (isCompAndPenAppointment && (isPastAppointment || canceled));
  const ShowTypeOfCare = () => {
    return (
      !!typeOfCareName && (
        <>
          {isCompAndPenAppointment && !isPastAppointment && !canceled ? (
            <>
              <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-display--inline-block">
                {typeOfCareName}
              </h2>
              <p className="vads-l-col--12 vads-u-margin-top--0 medium-screen:vads-l-col--8">
                This appointment is for disability rating purposes only. It
                doesn’t include treatment. If you have medical evidence to
                support your claim, bring copies to this appointment.
              </p>
            </>
          ) : (
            !isCompAndPenAppointment && (
              <>
                <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-display--inline-block">
                  Type of care:
                </h2>
                <div className="vads-u-display--inline"> {typeOfCareName}</div>
              </>
            )
          )}
        </>
      )
    );
  };

  return (
    <>
      <BackLink appointment={appointment} />
      <h1 className="vads-u-margin-y--2p5">
        <AppointmentDateTime appointment={appointment} />
      </h1>
      <StatusAlert appointment={appointment} facility={facility} />
      <ShowTypeOfCare />
      {displayTypeHeader && <TypeHeader>{header}</TypeHeader>}
      {!isPastAppointment && <PhoneInstructions appointment={appointment} />}
      <VAFacilityLocation
        facility={facility}
        facilityName={facility?.name}
        facilityId={locationId}
        clinicFriendlyName={appointment.location?.clinicName}
        clinicPhysicalLocation={appointment.location?.clinicPhysicalLocation}
        showCovidPhone={isCovid}
        isPhone={isPhoneAppointment}
      />
      <VAInstructions appointment={appointment} />
      <CalendarLink appointment={appointment} facility={facility} />
      <PrintLink appointment={appointment} />
      {isAppointmentCancellable && <CancelLink appointment={appointment} />}
      {!isAppointmentCancellable && (
        <NoOnlineCancelAlert appointment={appointment} facility={facility} />
      )}
    </>
  );
}

DetailsVA.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    comment: PropTypes.string,
    status: PropTypes.string.isRequired,
    vaos: PropTypes.shape({
      isPastAppointment: PropTypes.bool.isRequired,
      isUpcomingAppointment: PropTypes.bool.isRequired,
      isPendingAppointment: PropTypes.bool.isRequired,
      isCompAndPenAppointment: PropTypes.bool.isRequired,
      isCOVIDVaccine: PropTypes.bool.isRequired,
      isPhoneAppointment: PropTypes.bool.isRequired,
      isCancellable: PropTypes.bool.isRequired,
    }),
    location: PropTypes.shape({
      vistaId: PropTypes.string.isRequired,
      clinicId: PropTypes.string.isRequired,
      stationId: PropTypes.string.isRequired,
      clinicName: PropTypes.string.isRequired,
      clinicPhysicalLocation: PropTypes.string,
    }),
  }),
  facilityData: PropTypes.shape({
    locationId: PropTypes.shape({
      id: PropTypes.string.isRequired,
      vistaId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }),
};

DetailsVA.defaultProps = {
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
      clinicPhysicalLocation: '',
    },
  },
  facilityData: {
    locationId: {
      id: '',
      vistaId: '',
      name: '',
    },
  },
};
