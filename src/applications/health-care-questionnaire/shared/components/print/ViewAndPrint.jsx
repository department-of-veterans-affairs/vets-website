import React from 'react';
import moment from 'moment';

export default function ViewAndPrint({
  displayArrow = true,
  onClick = () => {},
  facilityName,
  appointmentTime,
}) {
  return (
    <button
      className="usa-button va-button view-and-print-button"
      onClick={onClick}
      data-testid="print-button"
      aria-label={`Download your response to the questionnaire you submitted for your appointment at ${facilityName} that was on ${moment(
        appointmentTime,
      ).format('MMMM, D, YYYY')}`}
    >
      View and print questions
      {displayArrow && <i className={`fa fa-chevron-right`} />}
    </button>
  );
}
