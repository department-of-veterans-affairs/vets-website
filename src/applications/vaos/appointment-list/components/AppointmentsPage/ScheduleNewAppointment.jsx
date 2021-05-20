import React from 'react';
import { Link } from 'react-router-dom';

export default function ScheduleNewAppointment({
  showDirectScheduling,
  showCommunityCare,
  startNewAppointmentFlow,
}) {
  return (
    <div className="vads-u-padding-y--3 vads-u-margin-bottom--3 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-lighter">
      <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
        {showDirectScheduling
          ? 'Create a new appointment'
          : 'Request an appointment'}
      </h2>
      {showCommunityCare &&
        showDirectScheduling && (
          <p className="vads-u-margin-top--1">
            Schedule an appointment at a VA medical center, clinic, or community
            care facility.
          </p>
        )}
      {!showCommunityCare &&
        !showDirectScheduling && (
          <p className="vads-u-margin-top--1">
            You can submit a request for an appointment at a VA medical center
            or clinic.
          </p>
        )}
      {showCommunityCare &&
        !showDirectScheduling && (
          <p className="vads-u-margin-top--1">
            You can submit a request for an appointment at a VA medical center,
            clinic, or approved Community Care facility.
          </p>
        )}
      {!showCommunityCare &&
        showDirectScheduling && (
          <p className="vads-u-margin-top--1">
            Schedule an appointment at a VA medical center or clinic.
          </p>
        )}
      <Link
        id="new-appointment"
        className="usa-button vads-u-font-weight--bold vads-u-font-size--md"
        to="/new-appointment"
        onClick={startNewAppointmentFlow}
      >
        {showDirectScheduling
          ? 'Schedule an appointment'
          : 'Request an appointment'}
      </Link>
    </div>
  );
}
