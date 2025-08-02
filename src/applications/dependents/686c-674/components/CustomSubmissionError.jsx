import React from 'react';
import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';

export default function CustomSubmissionError({ form }) {
  const { formErrors } = form;
  return (
    <ErrorMessage active title="Missing information">
      <p>{`${formErrors?.arrayLoopIncomplete}`}</p>
    </ErrorMessage>
  );
}
