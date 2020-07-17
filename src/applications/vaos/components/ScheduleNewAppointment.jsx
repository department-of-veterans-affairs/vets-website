import React from 'react';
import { Link } from 'react-router';
import { getCernerPortalLink } from '../utils/appointment';

export default function ScheduleNewAppointment({
  isCernerOnlyPatient,
  showDirectScheduling,
  showCommunityCare,
  startNewAppointmentFlow,
}) {
  return (
    <div className="vads-u-padding-y--3 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-lighter">
      {isCernerOnlyPatient && (
        <>
          <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
            Need to schedule an appointment?
          </h2>
          <p className="vads-u-margin-top--1">
            You can schedule a VA appointment through My VA Health.
          </p>
          <a
            id="new-appointment"
            className="usa-button vads-u-font-weight--bold vads-u-font-size--md"
            href={getCernerPortalLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to My VA Health
          </a>
        </>
      )}
      {!isCernerOnlyPatient && (
        <>
          <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
            Create a new appointment
          </h2>
          {showCommunityCare &&
            showDirectScheduling && (
              <p className="vads-u-margin-top--1">
                Schedule an appointment at a VA medical center, clinic, or
                Community Care facility.
              </p>
            )}
          {!showCommunityCare &&
            !showDirectScheduling && (
              <p className="vads-u-margin-top--1">
                Send a request to schedule an appointment at a VA medical center
                or clinic.
              </p>
            )}
          {showCommunityCare &&
            !showDirectScheduling && (
              <p className="vads-u-margin-top--1">
                Send a request to schedule an appointment at a VA medical
                center, clinic, or Community Care facility.
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
            Schedule an appointment
          </Link>
        </>
      )}
    </div>
  );
}
