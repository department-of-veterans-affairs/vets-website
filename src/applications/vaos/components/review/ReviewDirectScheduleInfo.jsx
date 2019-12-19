import React from 'react';
import { getTypeOfCare } from '../../utils/selectors';
import ReasonForAppointmentSection from './ReasonForAppointmentSection';
import ContactDetailSection from './ContactDetailSection';
import AppointmentDate from './AppointmentDate';

export default function ReviewDirectScheduleInfo({
  data,
  facility,
  clinic,
  pageTitle,
}) {
  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      <AppointmentDate
        dates={data.calendarData.selectedDates}
        systemId={data.vaSystem}
      />
      <hr />
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">
        {getTypeOfCare(data)?.name}
      </h2>
      <hr />
      <h3 className="vaos-appts__block-label">
        {clinic.clinicFriendlyLocationName || clinic.clinicName}
      </h3>
      {facility.authoritativeName}
      <br />
      {facility.city}, {facility.stateAbbrev}
      <hr />
      <ReasonForAppointmentSection data={data} />
      <hr />
      <ContactDetailSection data={data} />
    </div>
  );
}
