import React from 'react';

const Covid19Alert = () => {
  return (
    <div
      className={`usa-alert usa-alert-info background-color-only  vads-u-padding--1  vads-u-font-weight--bold`}
    >
      <i
        aria-hidden="true"
        role="img"
        className={`fa fa-exclamation-circle vads-u-margin-top--1 icon-base`}
      />
      <span className="sr-only">Alert: </span>
      <div className="usa-alert-body">COVID-19 vaccines at VA</div>
    </div>
  );
};

export default Covid19Alert;
