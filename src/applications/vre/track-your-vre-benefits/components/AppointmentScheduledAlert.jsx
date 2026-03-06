import React from 'react';
import PropTypes from 'prop-types';

export function formatApptDateTime(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);

  // Convert to Eastern Time (America/New_York)
  const options = {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  // Format: MM/DD/YYYY at hh:mm AM/PM ET
  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;
  const year = parts.find(p => p.type === 'year').value;
  const hour = parts.find(p => p.type === 'hour').value;
  const minute = parts.find(p => p.type === 'minute').value;
  const dayPeriod = parts.find(p => p.type === 'dayPeriod').value;

  return `${month}/${day}/${year} at ${hour}:${minute} ${dayPeriod} ET`;
}

const renderPlace = place => {
  if (!place) return null;

  const lines = String(place)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (lines.length <= 1) return <p className="va-address-block">{place}</p>;

  return (
    <p className="va-address-block vads-u-margin-left--0">
      {lines.map((line, idx) => (
        <React.Fragment key={idx}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </p>
  );
};

const AppointmentScheduledAlert = ({
  appointmentDateTime,
  appointmentPlace,
}) => {
  const formattedDateTime = formatApptDateTime(appointmentDateTime);

  if (!formattedDateTime) return null;

  return (
    <div className="vads-u-margin-y--3">
      <va-alert-expandable
        status="info"
        trigger="You have an appointment scheduled"
      >
        {appointmentPlace ? (
          <>
            <p>
              You have an appointment scheduled with your counselor for{' '}
              {formattedDateTime} at the following location:
            </p>
            {renderPlace(appointmentPlace)}
          </>
        ) : (
          <>
            <p>
              You have an appointment scheduled for {formattedDateTime} via
              Microsoft Teams.
            </p>
            <p>
              The Microsoft Teams meeting link will be included in the
              appointment confirmation email sent to you.
            </p>
          </>
        )}
      </va-alert-expandable>
    </div>
  );
};

AppointmentScheduledAlert.propTypes = {
  appointmentDateTime: PropTypes.string,
  appointmentPlace: PropTypes.string,
};

export default AppointmentScheduledAlert;
