import React from 'react';
import { Link } from 'react-router-dom';

export default function ScheduleNewProjectCheetah({ startNewAppointmentFlow }) {
  return (
    <div className="vads-u-padding-y--3 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-lighter">
      <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
        Schedule a COVID-19 vaccination
      </h2>
      <p className="vads-u-margin-top--1">
        You are eligible to receive the COVID-19 vaccine at a VA Location.
      </p>
      <Link
        id="new-project-cheetah"
        className="usa-button vads-u-font-weight--bold vads-u-font-size--md"
        to="/new-project-cheetah-booking"
        onClick={startNewAppointmentFlow}
      >
        Schedule COVID-19 vaccination
      </Link>
    </div>
  );
}
