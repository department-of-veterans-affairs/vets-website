import React from 'react';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  PMR_ATTACHMENTS_TYPES,
  ADDITIONAL_ATTACHMENT_LABEL,
} from './constants';

export const additionalInput = ({
  attachmentTypes = PMR_ATTACHMENTS_TYPES,
  label = ADDITIONAL_ATTACHMENT_LABEL,
} = {}) => (error, data) => {
  const { attachmentId } = data || {};
  return (
    <VaSelect
      required
      error={error}
      value={attachmentId}
      name="docType"
      label={label}
    >
      {attachmentTypes.map(attachmentType => (
        <option key={attachmentType.value} value={attachmentType.value}>
          {attachmentType.label}
        </option>
      ))}
    </VaSelect>
  );
};
