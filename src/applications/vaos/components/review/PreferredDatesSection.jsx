import React from 'react';
import { Link } from 'react-router';
import newAppointmentFlow from '../../newAppointmentFlow';
import PreferredDates from './PreferredDates';

export default function PreferredDatesSection(props) {
  return (
    <>
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row">
          <div className="vads-l-col--6">
            <h3 className="vaos-appts__block-label">Preferred date and time</h3>
          </div>
          <div className="vads-l-col--6 vads-u-text-align--right">
            <Link
              to={newAppointmentFlow.requestDateTime.url}
              aria-label="Edit preferred date"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
      <PreferredDates dates={props.data.calendarData.selectedDates} />
    </>
  );
}
