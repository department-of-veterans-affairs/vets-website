// libs
import React from 'react';

// TODO: for JSDocs
function ErrorMessage(props) {
  const { active, children, message, testId, title } = props;

  if (!active) return null;
  else {
    return (
      <div className="usa-alert usa-alert-error schemaform-failure-alert" data-testid={testId}>
        <div className="usa-alert-body">
          <p className="schemaform-warning-header">
            <strong>{title}</strong>
          </p>
          <p>{message}</p>
          {children}
        </div>
      </div>
    );
  }
}

export default ErrorMessage;
