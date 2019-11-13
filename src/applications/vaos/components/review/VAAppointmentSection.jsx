import React from 'react';
// import { Link } from 'react-router';
// import newAppointmentFlow from '../../newAppointmentFlow';
import PreferredDatesSection from './PreferredDatesSection';
import ContactDetailSection from './ContactDetailSection';
import ReasonForAppointmentSection from './ReasonForAppointmentSection';

export default function VAAppointmentSection(props) {
  return (
    <>
      <ReasonForAppointmentSection data={props.data} />
      <hr />
      {/* <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row">
          <div className="vads-l-col--6">
            <h3 className="vaos-appts__block-label">Preferred date and time</h3>
          </div>
          <div className="vads-l-col--6 vads-u-text-align--right">
            <Link to={newAppointmentFlow.requestDateTime.url}>Edit</Link>
          </div>
        </div>
      </div> */}
      {/* <PreferredDates dates={props.data.calendarData.selectedDates} /> */}
      <PreferredDatesSection data={props.data} />
      <hr />
      <ContactDetailSection data={props.data} />
    </>
  );
}
