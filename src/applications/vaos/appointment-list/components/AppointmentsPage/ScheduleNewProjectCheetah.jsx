import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

export default function ScheduleNewProjectCheetah({
  startNewAppointmentFlow,
  showHomePageRefresh,
}) {
  const classNames = classnames({
    'vads-u-padding-y--3': !showHomePageRefresh,
    'vads-u-border-top--1px': !showHomePageRefresh,
    'vads-u-border-bottom--1px': !showHomePageRefresh,
    'vads-u-border-color--gray-lighter': !showHomePageRefresh,
    'vaos-appts__card': showHomePageRefresh,
  });

  const headerClass = classnames('vads-u-margin-y--0', {
    'vads-u-font-size--h3': !showHomePageRefresh,
    'vads-u-font-size--base': showHomePageRefresh,
    'vads-u-font-family--sans': showHomePageRefresh,
  });

  return (
    <div className={classNames}>
      <h2 className={headerClass}>Schedule a COVID-19 vaccination</h2>
      <p className="vads-u-margin-top--1">
        You may be eligible to receive the COVID-19 vaccine at a VA Location.
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
