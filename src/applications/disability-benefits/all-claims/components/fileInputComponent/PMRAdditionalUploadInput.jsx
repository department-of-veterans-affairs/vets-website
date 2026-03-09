import React from 'react';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  PMR_ADDITIONAL_INPUT_LABELS,
  ADDITIONAL_ATTACHMENT_TITLE,
} from './constants';

export const additionalInput = (
  error,
  data = {},
  {
    labels = PMR_ADDITIONAL_INPUT_LABELS,
    title = ADDITIONAL_ATTACHMENT_TITLE,
  } = {},
) => {
  const { attachmentId = '' } = data;
  return (
    <VaSelect
      required
      error={error}
      name="pmrAdditionalInoput"
      label={title}
      value={attachmentId}
    >
      {Object.entries(labels.attachmentId).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </VaSelect>
  );
};
