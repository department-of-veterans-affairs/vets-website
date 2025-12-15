import React from 'react';

export function llmAlert({ formContext }) {
  // Early return if feature toggle is disabled
  if (!formContext?.data?.['view:champvaClaimsLlmValidation']) return <></>;

  // Get this page's upload key (e.g., medicalUpload)
  const currentFileFieldKey = Object.keys(
    formContext?.schema?.properties,
  ).filter(el => formContext.schema.properties?.[el]?.type === 'array');
  if (currentFileFieldKey.length === 0) return <></>;

  // should be array of uploaded files for this page
  const fileData = formContext?.fullData?.[currentFileFieldKey];
  if (fileData === undefined) return <></>;

  const mostRecentFile = fileData[fileData?.length - 1];
  const { llmResponse } = mostRecentFile;

  if (!llmResponse) {
    return (
      <va-alert status="warning">
        We could not complete verification for this file. You can retry
        verification, or you can continue without verifying.
      </va-alert>
    );
  }
  if (llmResponse.missingFields.length === 0) {
    return (
      <va-alert status="success">
        It looks like your upload contains all required information.
      </va-alert>
    );
  }
  if (llmResponse.missingFields.length > 0) {
    return (
      <va-alert status="error">
        <p>
          Your upload ({mostRecentFile.name}) may be missing the following
          information:
        </p>
        <ul>
          {llmResponse.missingFields?.map((field, index) => (
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

  return <></>;
}

export const LLM_RESPONSE = {
  'view:uploadAlert': {
    'ui:description': llmAlert,
  },
};
