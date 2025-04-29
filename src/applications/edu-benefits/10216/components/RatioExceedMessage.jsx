import React from 'react';

function RatioExceedMessage() {
  return (
    <div className="schemaform-field-template">
      <va-alert status="error" visible>
        <p className="vads-u-margin-top--0">
          The calculated percentage of VA beneficiaries exceeds 35%. Please
          check your numbers, and if you believe this calculation is an error,
          contact your ELR.
        </p>
      </va-alert>
    </div>
  );
}

export default RatioExceedMessage;
