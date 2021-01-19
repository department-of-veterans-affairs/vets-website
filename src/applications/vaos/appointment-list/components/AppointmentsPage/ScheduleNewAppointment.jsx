import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

export default function ScheduleNewAppointment({
  showDirectScheduling,
  showCommunityCare,
  startNewAppointmentFlow,
  showHomePageRefresh,
}) {
  const classNames = classnames({
    'vads-u-margin-bottom--1p5': showHomePageRefresh,
    'vads-u-padding--2p5': showHomePageRefresh,
    'vads-u-background-color--gray-lightest': showHomePageRefresh,
    'vads-u-padding-y--3': !showHomePageRefresh,
    'vads-u-border-top--1px': !showHomePageRefresh,
    'vads-u-border-bottom--1px': !showHomePageRefresh,
    'vads-u-border-color--gray-lighter': !showHomePageRefresh,
  });

  return (
    <div
      className={classNames}
      style={showHomePageRefresh ? { borderRadius: '15px' } : {}}
    >
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
