// libs
import React from 'react';

function FailureAlert(props) {
  const { children, isLoggedIn, title } = props;

  return (
    <div className="usa-alert usa-alert-error schemaform-failure-alert">
      <div className="usa-alert-body">
        <p className="schemaform-warning-header">
          <strong>{title}</strong>
        </p>
        {!isLoggedIn && (
          <p>
            If you don’t have an account, you’ll have to start over. Try
            submitting your form again tomorrow.
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

export default FailureAlert;
