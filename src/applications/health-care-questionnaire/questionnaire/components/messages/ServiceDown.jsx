import React from 'react';

export default function ServiceDown() {
  return (
    <div
      data-testid="service-down-message"
      className="usa-alert usa-alert-error questionnaire-api-unavailable"
    >
      <div className="usa-alert-body">
        <h4 className="claims-alert-header">
          We can’t submit your questionnaire right now
        </h4>
        <p className="usa-alert-text">
          We’re sorry. Something went wrong and we can't submit your
          questionnaire. You can continue to fill out your questionnaire and
          your information will be saved. If you’re having trouble, please try
          again later.
        </p>
      </div>
    </div>
  );
}
