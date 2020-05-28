import React from 'react';
import { FLOW_TYPES } from '../../utils/constants';
import ReasonForAppointmentSection from './ReasonForAppointmentSection';
import ContactDetailSection from './ContactDetailSection';
import AppointmentDate from './AppointmentDate';
import Description from './Description';
import TypeOfAppointmentSection from './TypeOfAppointmentSection';

export default function ReviewDirectScheduleInfo({
  data,
  facility,
  clinic,
  pageTitle,
  systemId,
}) {
  return (
    <div>
      <h1 className="vaos-review__header vads-u-font-size--h2">{pageTitle}</h1>
      <Description data={data} flowType={FLOW_TYPES.DIRECT} />
      <TypeOfAppointmentSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <AppointmentDate
        dates={data.calendarData.selectedDates}
        systemId={systemId}
      />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <h3 className="vaos-appts__block-label">
        {clinic.clinicFriendlyLocationName || clinic.clinicName}
      </h3>
      {facility.name}
      <br />
      {facility.address?.city}, {facility.address?.state}
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <ReasonForAppointmentSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <ContactDetailSection data={data} />
    </div>
  );
}
