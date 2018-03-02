import React from 'react';
import { identityMatchesPrefill } from '../helpers';

export default function IdentifyFieldsWarning({ formData }) {
  if (formData.processAsIdProofed && !identityMatchesPrefill(formData)) {
    return (
      <div className="usa-alert usa-alert-warning">
        <div className="usa-alert-body">
          Changing your name or SSN may result in your application taking longer to process and will also require you to upload a copy of your discharge documentation
        </div>
      </div>
    );
  }

  return null;
}
