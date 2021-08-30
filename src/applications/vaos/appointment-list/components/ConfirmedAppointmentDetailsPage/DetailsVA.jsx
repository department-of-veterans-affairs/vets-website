import React from 'react';
import { Link } from 'react-router-dom';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import { getVAAppointmentLocationId } from '../../../services/appointment';
import { APPOINTMENT_STATUS } from '../../../utils/constants';
import AppointmentDateTime from '../AppointmentDateTime';
import PageLayout from '../AppointmentsPage/PageLayout';
import Breadcrumbs from '../../../components/Breadcrumbs';
import InfoAlert from '../../../components/InfoAlert';
import CalendarLink from './CalendarLink';
import CancelLink from './CancelLink';
import StatusAlert from './StatusAlert';
import TypeHeader from './TypeHeader';
import PrintLink from './PrintLink';
import VAInstructions from './VAInstructions';
import { selectFeatureCancel } from '../../../redux/selectors';
import { useSelector } from 'react-redux';

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
  const showCancelButton = useSelector(selectFeatureCancel);
  const locationId = getVAAppointmentLocationId(appointment);

  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isPastAppointment = appointment.vaos.isPastAppointment;
  const facility = facilityData?.[locationId];
  const isCovid = appointment.vaos.isCOVIDVaccine;

  const header = formatHeader(appointment);

  const canCancel =
    !canceled && showCancelButton && !isPastAppointment && !isCovid;

  return (
    <PageLayout>
      <Breadcrumbs>
        <Link to={`/va/${appointment.id}`}>Appointment detail</Link>
      </Breadcrumbs>

      <h1>
        <AppointmentDateTime appointment={appointment} />
      </h1>

      <StatusAlert appointment={appointment} facility={facility} />

      <TypeHeader>{header}</TypeHeader>

      <VAFacilityLocation
        facility={facility}
        facilityName={facility?.name}
        facilityId={locationId}
        isHomepageRefresh
        clinicFriendlyName={appointment.location?.clinicName}
        showCovidPhone={isCovid}
      />

      <VAInstructions appointment={appointment} />

      {!canceled && !isPastAppointment && (
        <CalendarLink appointment={appointment} facility={facility} />
      )}
      {!canceled && <PrintLink />}
      {canCancel && <CancelLink appointment={appointment} />}
      {!canceled && isCovid && (
        <InfoAlert
          status="info"
          headline="Need to make changes?"
          backgroundOnly
        >
          Contact this provider if you need to reschedule or cancel your
          appointment.
        </InfoAlert>
      )}
    </PageLayout>
  );
}
