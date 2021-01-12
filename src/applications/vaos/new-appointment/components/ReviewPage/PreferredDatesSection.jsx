import React from 'react';
import { Link } from 'react-router-dom';
import newAppointmentFlow from '../../newAppointmentFlow';
import PreferredDates from './PreferredDates';

export default function PreferredDatesSection(props) {
  return (
    <>
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row vads-u-justify-content--space-between">
          <div className="vads-u-flex--1 vads-u-padding-right--1">
            <h3 className="vaos-appts__block-label">Preferred date and time</h3>
            <ul className="usa-unstyled-list">
              <PreferredDates dates={props.data.selectedDates} />
            </ul>
          </div>
          <div>
            <Link
              to={newAppointmentFlow.requestDateTime.url}
              aria-label="Edit preferred date"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
