// libs
import React from 'react';

function ErrorMessage(props) {
  const { active, children } = props;

  return (
    (active && (
      <div className="usa-alert usa-alert-error schemaform-failure-alert">
        <div className="usa-alert-body">{children}</div>
      </div>
    )) ||
    children
  );
}

export default ErrorMessage;
