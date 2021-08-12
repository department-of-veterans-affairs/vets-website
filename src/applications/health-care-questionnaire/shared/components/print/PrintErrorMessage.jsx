import React from 'react';

export default function PrintErrorMessage({ CallToAction }) {
  return (
    <div
      data-testid="service-down-message"
      className="usa-alert usa-alert-error print-error-message"
    >
      <div className="usa-alert-body">
        <h3 className="claims-alert-header">
          We’ve run into a problem viewing and printing your questionnaire
        </h3>
        <p className="usa-alert-text" data-testid="call-to-action-container">
          We're sorry. Something went wrong on our end. <CallToAction />
        </p>
      </div>
    </div>
  );
}
