import React from 'react';
// import { Link } from 'react-router';
import moment from '../utils/moment-tz';
import { getTypeOfCare } from '../utils/selectors';
// // import newAppointmentFlow from '../newAppointmentFlow';
// import { PURPOSE_TEXT } from '../utils/constants';
import {
  ContactDetailSection,
  ReasonForAppointmentSection,
} from './review/ReviewRequestInfo';

// Refactor
// function formatBestTime(bestTime) {
//   const times = [];
//   if (bestTime?.morning) {
//     times.push('Morning');
//   }

//   if (bestTime?.afternoon) {
//     times.push('Afternoon');
//   }

//   if (bestTime?.evening) {
//     times.push('Evening');
//   }

//   if (times.length === 1) {
//     return times[0];
//   } else if (times.length === 2) {
//     return `${times[0]} or ${times[1]}`;
//   }

//   return 'Anytime during the day';
// }

// Refactor
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

// Refactor
// const ReasonForAppointmentSection = props => (
//   <>
//     <div className="vads-l-grid-container vads-u-padding--0">
//       <div className="vads-l-row">
//         <div className="vads-l-col--6">
//           <h3 className="vaos-appts__block-label">
//             {PURPOSE_TEXT[props.data.reasonForAppointment]} visit
//           </h3>
//         </div>
//         <div className="vads-l-col--6 vads-u-text-align--right">
// <Link to={newAppointmentFlow.reasonForAppointment.url}>Edit</Link>
//         </div>
//       </div>
//     </div>
//     <span>{props.data.reasonAdditionalInfo}</span>
//   </>
// );

// Refactor
// const ContactDetailSection = props => (
//   <>
//     <div className="vads-l-grid-container vads-u-padding--0">
//       <div className="vads-l-row">
//         <div className="vads-l-col--6">
//           <h3 className="vaos-appts__block-label">Your contact details</h3>
//         </div>
//         <div className="vads-l-col--6 vads-u-text-align--right">
//           <Link to={newAppointmentFlow.contactInfo.url}>Edit</Link>
//         </div>
//       </div>
//     </div>
//     <span className="vads-u-padding-right--1">
//       {props.data.email}
//       <br />
//       {props.data.phoneNumber}
//       <br />
//       <i>Call {formatBestTime(props.data.bestTimeToCall).toLowerCase()}</i>
//     </span>
//   </>
// );

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
