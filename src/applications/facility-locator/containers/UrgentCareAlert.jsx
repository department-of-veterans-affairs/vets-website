import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

export default function UrgentCareAlert() {
  return (
    <div className="usa-alert usa-alert-warning">
      <div className="usa-alert-body">
        <dl className="usa-alert-text">
          <dt
            className="usa-alert-heading vads-u-font-weight--bold vads-u-font-family--serif vads-u-line-height--3"
            tabIndex="-1"
          >
            Important information about your Community Care appointment
          </dt>
          <dd className="vads-u-line-height--4 vads-u-margin-top--4 vads-u-margin-bottom--1">
            Click below to learn how to prepare for your urgent care appointment
            with a Community Care provider.
          </dd>
          <button
            className="usa-button-primary vads-u-margin-y--0"
            onClick={() => {
              // Record event
              recordEvent({ event: 'cta-primary-button-click' });
              window.open(
                'https://www.va.gov/COMMUNITYCARE/programs/veterans/Urgent_Care.asp',
                '_blank',
              );
            }}
          >
            Learn about VA urgent care benefit
          </button>
        </dl>
      </div>
    </div>
  );
}
