import React from 'react';
// import { Link } from 'react-router';
import moment from '../../utils/moment-tz';
import { getTypeOfCare } from '../../utils/selectors';
import ReasonForAppointmentSection from './ReasonForAppointmentSection';
import ContactDetailSection from './ContactDetailSection';

const AppointmentDate = props => {
  const dates = props.dates?.map((selected, i) => (
    <h2 key={i} className="vads-u-font-size--md">
      {moment
        .tz(selected.datetime, 'YYYY-MM-DDThh:mm:ssZ', moment.tz.guess())
        .format('MMMM DD, YYYY [at] h:mm a z')}
      <br />
    </h2>
  ));

  return dates;
};

export default function ReviewDirectScheduleInfo({ data, facility, clinic }) {
  return (
    <div>
      <h1 className="vads-u-font-size--h2">
        Review your appointment
        <br />
        details
      </h1>
      <AppointmentDate dates={data.calendarData.selectedDates} />
      <hr />
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">
        {getTypeOfCare(data)?.name}
      </h2>
      <hr />
      <h3 className="vaos-appts__block-label">
        {clinic?.clinicFriendlyLocationName || clinic?.clinicName}
      </h3>
      {facility?.institution.authoritativeName}
      <br />
      {facility?.institution.city}, {facility?.institution.stateAbbrev}
      <hr />
      <ReasonForAppointmentSection data={data} />
      <hr />
      <ContactDetailSection data={data} />
    </div>
  );
}
