import React from 'react';

export function llmAlert({ formContext }) {
  const llmData =
    formContext?.fullData?.medicalUpload ||
    formContext?.fullData?.pharmacyUpload ||
    formContext?.fullData?.secondaryEob;
  const llmConfidence = llmData?.map(data => data.llmResponse?.confidence);
  const llmMissingFiles = llmData?.map(
    field => field?.llmResponse?.missingFields,
  );

  if (llmData && llmConfidence >= 0.8) {
    return (
      <va-alert status="success">
        It looks like your upload contains all required information.
      </va-alert>
    );
  }
  if (llmData && llmConfidence <= 0.7) {
    return (
      <va-alert status="error">
        <p>Your upload may be missing the following information:</p>
        <ul>
          {llmMissingFiles[0]?.map((field, index) => (
            <li key={index}>{field}</li>
          ))}
        </ul>
        <p>
          You can upload a new document to correct this, or continue anyway if
          you're sure your document is complete.
        </p>
        <p>
          We will not be able to process your claim without this information.
        </p>
      </va-alert>
    );
  }
  if (!llmData) {
    return (
      <va-alert status="warning">
        We could not complete verification for this file. You can retry
        verification, or you can continue without verifying.
      </va-alert>
    );
  }

  return <></>;
}

export const LLM_RESPONSE = {
  'view:uploadAlert': {
    'ui:description': llmAlert,
  },
};
