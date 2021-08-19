import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

const Covid19Alert = () => {
  return (
    <div
      className={`usa-alert usa-alert-info background-color-only  vads-u-padding--1 vads-u-margin-top--2  vads-u-font-weight--bold`}
    >
      <i
        aria-hidden="true"
        role="img"
        className={`fa fa-info-circle vads-u-margin-top--1 icon-base`}
      />
      <span className="sr-only">Alert: </span>
      <div className="usa-alert-body">
        <a
          href={'https://www.va.gov/health-care/covid-19-vaccine'}
          target={'_/blank'}
          onClick={() => {
            // Record event
            recordEvent({ event: 'cta-primary-button-click' });
          }}
        >
          COVID-19 vaccines at VA{' '}
        </a>
      </div>
    </div>
  );
};

export default Covid19Alert;
