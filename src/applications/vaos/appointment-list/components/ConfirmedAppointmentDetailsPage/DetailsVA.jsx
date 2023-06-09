import React from 'react';
import PropTypes from 'prop-types';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import { getVAAppointmentLocationId } from '../../../services/appointment';
import AppointmentDateTime from '../AppointmentDateTime';
import Breadcrumbs from '../../../components/Breadcrumbs';
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
  const isPhone = appointment.vaos.isPhoneAppointment;
  const { isPastAppointment, isCompAndPenAppointment } = appointment.vaos;
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isAppointmentCancellable = appointment.vaos.isCancellable;

  const typeOfCareName = selectTypeOfCareName(appointment);
  // we don't want to display the appointment type header for upcoming C&P appointments.
  const displayTypeHeader =
    !isCompAndPenAppointment ||
    (isCompAndPenAppointment && (isPastAppointment || canceled));

  // v0 does not return a stopCode for covid as serviceType, instead we check for isCovid
  // remove the check for isCovid when we migrate entirely to v2
  const ShowTypeOfCare = () => {
    const typeOfCare = isCovid ? 'COVID-19 vaccine' : typeOfCareName;
    return (
      !!typeOfCare && (
        <>
          {isCompAndPenAppointment && !isPastAppointment && !canceled ? (
            <>
              <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-display--inline-block">
                {typeOfCare}
              </h2>
              <p className="vads-l-col--12 vads-u-margin-top--0 medium-screen:vads-l-col--8">
                This appointment is for rating purposes only and will not
                include treatment. If you have any medical evidence to claim,
                please bring copies to your exam.
              </p>
            </>
          ) : (
            !isCompAndPenAppointment && (
              <>
                <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-display--inline-block">
                  Type of care:
                </h2>
                <div className="vads-u-display--inline"> {typeOfCare}</div>
              </>
            )
          )}
        </>
      )
    );
  };

  return (
    <>
      <Breadcrumbs>
        <a
          href={`/health-care/schedule-view-va-appointments/appointments/va/${
            appointment.id
          }`}
        >
          Appointment detail
        </a>
      </Breadcrumbs>
      <h1>
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
        showCovidPhone={isCovid}
        isPhone={isPhone}
      />
      <VAInstructions appointment={appointment} />
      <CalendarLink appointment={appointment} facility={facility} />
      <PrintLink appointment={appointment} />
      {isAppointmentCancellable && <CancelLink appointment={appointment} />}
      {!isAppointmentCancellable && (
        <NoOnlineCancelAlert
          appointment={appointment}
          facility={facility}
          isCompAndPenAppointment={isCompAndPenAppointment}
        />
      )}
    </>
  );
}

DetailsVA.propTypes = {
  appointment: PropTypes.object.isRequired,
  facilityData: PropTypes.object.isRequired,
  useV2: PropTypes.bool,
};
