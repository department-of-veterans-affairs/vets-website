import React from 'react';

import { transformForSubmit } from '../common/schemaform/helpers';

export const transportationWarning = (
  <div className="usa-alert usa-alert-warning no-background-image">
    <span><strong>Note:</strong> At the end of the application, you will be asked to upload documentation for the expenses you incurred for transporting the Veteran’s remains.</span>
  </div>
);

export const burialDateWarning = (
  <div className="usa-alert usa-alert-warning no-background-image">
    <span>If filing for a non-service-connected allowance, the Veteran's burial date must be no more than 2 years from the current date. Find out if you still qualify. <a href="/burials-and-memorials/eligibility" target="_blank">Learn about eligibility.</a></span>
  </div>
);

export function fileHelp({ formContext }) {
  if (formContext.reviewMode) {
    return <p/>;
  }

  return (
    <p>
      Files we accept: pdf, jpg, png<br/>
      Maximum file size: 20MB
    </p>
  );
}

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    burialClaim: {
      form: formData
    }
  });
}
