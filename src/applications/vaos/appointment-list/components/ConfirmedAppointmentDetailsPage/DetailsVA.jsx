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

function formatHeader(appointment) {
  if (appointment.vaos.isCOVIDVaccine) {
    return 'COVID-19 vaccine';
  }
  if (appointment.vaos.isPhoneAppointment) {
    return 'VA appointment over the phone';
  }
  return 'VA appointment';
}

export default function DetailsVA({ appointment, facilityData }) {
  const locationId = getVAAppointmentLocationId(appointment);

  const facility = facilityData?.[locationId];
  const isCovid = appointment.vaos.isCOVIDVaccine;
  const header = formatHeader(appointment);
  const isPhone = appointment.vaos.isPhoneAppointment;

  const typeOfCareName = selectTypeOfCareName(appointment);

  // v0 does not return a stopCode for covid as serviceType, instead we check for isCovid
  // remove the check for isCovid when we migrate entirely to v2
  const ShowTypeOfCare = () => {
    const typeOfCare = isCovid ? 'COVID-19 vaccine' : typeOfCareName;
    return (
      !!typeOfCare && (
        <>
          <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-display--inline-block">
            Type of care:
          </h2>
          <div className="vads-u-display--inline"> {typeOfCare}</div>
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
      <TypeHeader>{header}</TypeHeader>
      <PhoneInstructions appointment={appointment} />
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
      {!isCovid && <CancelLink appointment={appointment} />}
      {isCovid && (
        <NoOnlineCancelAlert appointment={appointment} facility={facility} />
      )}
    </>
  );
}

DetailsVA.propTypes = {
  appointment: PropTypes.object.isRequired,
  facilityData: PropTypes.object.isRequired,
  useV2: PropTypes.bool,
};
