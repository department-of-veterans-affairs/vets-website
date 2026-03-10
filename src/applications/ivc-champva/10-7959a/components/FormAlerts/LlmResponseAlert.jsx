import React from 'react';
import PropTypes from 'prop-types';

const TOGGLE_KEY = 'view:champvaClaimsLlmValidation';

const isArraySchemaProp = prop => prop?.type === 'array';

const getArrayFieldKey = schema =>
  Object.keys(schema?.properties ?? {}).find(key =>
    isArraySchemaProp(schema.properties?.[key]),
  );

const getMostRecentFile = arr =>
  Array.isArray(arr) && arr.length ? arr.at(-1) : null;

const getAlertVariant = llmResponse => {
  if (!llmResponse) return 'warning';

  const missingCount = llmResponse.missingFields?.length ?? 0;
  return missingCount === 0 ? 'success' : 'error';
};

const getAlertContent = ({ variant, mostRecentFile, llmResponse }) => {
  const missingFields = llmResponse?.missingFields ?? [];
  const contentMap = {
    warning: (
      <>
        We could not complete verification for this file. You can retry
        verification, or you can continue without verifying.
      </>
    ),
    success: <>It looks like your upload contains all required information.</>,
    error: (
      <>
        <p>
          Your upload ({mostRecentFile?.name}) may be missing the following
          information:
        </p>
        <ul>
          {missingFields.map((field, idx) => (
            <li key={idx}>{field}</li>
          ))}
        </ul>
        <p>
          You can upload a new document to correct this, or continue anyway if
          you’re sure your document is complete.
        </p>
        <p>
          We will not be able to process your claim without this information.
        </p>
      </>
    ),
  };
  return contentMap[variant] ?? null;
};

const LlmResponseAlert = ({ formContext }) => {
  if (!formContext?.data?.[TOGGLE_KEY]) return null;

  const uploadKey = getArrayFieldKey(formContext?.schema);
  if (!uploadKey) return null;

  const files = formContext?.fullData?.[uploadKey];
  const mostRecentFile = getMostRecentFile(files);
  if (!mostRecentFile) return null;

  const { llmResponse } = mostRecentFile;
  const variant = getAlertVariant(llmResponse);
  const content = getAlertContent({ variant, mostRecentFile, llmResponse });

  return content ? <va-alert status={variant}>{content}</va-alert> : null;
};

LlmResponseAlert.propTypes = {
  formContext: PropTypes.shape({
    data: PropTypes.object,
    fullData: PropTypes.object,
    schema: PropTypes.object,
  }),
};

export default LlmResponseAlert;
