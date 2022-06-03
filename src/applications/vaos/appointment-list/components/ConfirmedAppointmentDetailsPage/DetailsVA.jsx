import React from 'react';
import { Link } from 'react-router-dom';
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
import { getTypeOfCareById } from '../../../utils/appointment';

function formatHeader(appointment) {
  if (appointment.vaos.isCOVIDVaccine) {
    return 'COVID-19 vaccine';
  }
  if (appointment.vaos.isPhoneAppointment) {
    return 'VA appointment over the phone';
  }
  return 'VA appointment';
}

export default function DetailsVA({
  appointment,
  facilityData,
  useV2 = false,
}) {
  const locationId = getVAAppointmentLocationId(appointment);

  const facility = facilityData?.[locationId];
  const isCovid = appointment.vaos.isCOVIDVaccine;
  const header = formatHeader(appointment);
  const isPhone = appointment.vaos.isPhoneAppointment;
  const serviceType = useV2
    ? appointment.vaos.apiData.serviceType
    : appointment.vaos.apiData.vdsAppointments[0]?.clinic?.stopCode;

  // v0 does not return a stopCode for covid as serviceType, instead we check for isCovid
  // remove the check for isCovid when we migrate entirely to v2
  const ShowTypeOfCare = () => {
    const typeOfCare = isCovid
      ? 'COVID-19 vaccine'
      : getTypeOfCareById(serviceType)?.name;
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
        <Link to={`/va/${appointment.id}`}>Appointment detail</Link>
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
