import React from 'react';

export default function ServiceDown() {
  return (
    <div
      data-testid="service-down-message"
      className="usa-alert usa-alert-error questionnaire-unavailable"
    >
      <div className="usa-alert-body">
        <h4 className="claims-alert-header">
          Your questionnaires are currently unavailable.
        </h4>
        <p className="usa-alert-text">
          You can't view information about your questionnaire because something
          went wrong on our end. Please try again later.
        </p>
      </div>
    </div>
  );
}
