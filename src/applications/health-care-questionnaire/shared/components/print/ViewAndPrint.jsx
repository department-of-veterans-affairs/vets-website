import React from 'react';
import moment from 'moment';

export default function ViewAndPrint({
  displayArrow = true,
  useSecondary,
  onClick = () => {},
  facilityName,
  appointmentTime,
}) {
  const className = `usa-button${
    useSecondary ? '-secondary' : ''
  } va-button view-and-print-button`;
  return (
    <button
      className={className}
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
