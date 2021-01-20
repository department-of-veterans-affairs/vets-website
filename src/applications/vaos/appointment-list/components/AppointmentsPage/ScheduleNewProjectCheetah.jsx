import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

export default function ScheduleNewProjectCheetah({
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
