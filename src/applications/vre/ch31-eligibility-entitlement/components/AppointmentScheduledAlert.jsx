import React from 'react';
import PropTypes from 'prop-types';

const formatApptDateTime = isoString => {
  if (!isoString) return null;

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString; // fallback to raw

  return date.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const renderPlace = place => {
  if (!place) return null;

  // If it's a single line address string, split on commas for nicer line breaks
  const lines = String(place)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (lines.length <= 1) return <p className="va-address-block">{place}</p>;

  return (
    <p className="va-address-block">
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

  return (
    <div className="vads-u-margin-y--3">
      <va-alert-expandable
        status="info"
        trigger="You have an appointment scheduled"
      >
        {formattedDateTime ? (
          <p>
            We would like to remind you that you have an appointment scheduled
            with your counselor for <strong>{formattedDateTime}</strong>.
          </p>
        ) : (
          <p>
            We would like to remind you that you have an appointment scheduled
            with your counselor.
          </p>
        )}

        {appointmentPlace ? <>{renderPlace(appointmentPlace)}</> : null}
      </va-alert-expandable>
    </div>
  );
};

AppointmentScheduledAlert.propTypes = {
  appointmentDateTime: PropTypes.string,
  appointmentPlace: PropTypes.string,
};

export default AppointmentScheduledAlert;
