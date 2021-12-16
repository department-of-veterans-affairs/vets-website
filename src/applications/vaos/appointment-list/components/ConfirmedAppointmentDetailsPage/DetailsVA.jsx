import React from 'react';
import { Link } from 'react-router-dom';
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

function formatHeader(appointment) {
  if (appointment.vaos.isCOVIDVaccine) {
    return 'COVID-19 vaccine';
  } else if (appointment.vaos.isPhoneAppointment) {
    return 'VA appointment over the phone';
  } else {
    return 'VA appointment';
  }
}

export default function DetailsVA({ appointment, facilityData }) {
  const locationId = getVAAppointmentLocationId(appointment);

  const facility = facilityData?.[locationId];
  const isCovid = appointment.vaos.isCOVIDVaccine;
  const header = formatHeader(appointment);
  const isPhone = appointment.vaos.isPhoneAppointment;

  return (
    <>
      <Breadcrumbs>
        <Link to={`/va/${appointment.id}`}>Appointment detail</Link>
      </Breadcrumbs>

      <h1>
        <AppointmentDateTime appointment={appointment} />
      </h1>

      <StatusAlert appointment={appointment} facility={facility} />

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
