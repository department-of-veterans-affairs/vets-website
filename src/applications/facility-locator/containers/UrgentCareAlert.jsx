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
          <a
            className="usa-button-primary vads-u-margin-y--0"
            href="https://www.va.gov/COMMUNITYCARE/programs/veterans/Urgent-Care.asp"
            target="_/blank"
            onClick={() => {
              // Record event
              recordEvent({ event: 'cta-primary-button-click' });
            }}
          >
            Learn about VA urgent care benefit
          </a>
        </dl>
      </div>
    </div>
  );
}
