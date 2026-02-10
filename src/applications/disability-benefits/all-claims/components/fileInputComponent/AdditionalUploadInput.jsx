import React from 'react';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { ATTACHMENTS_TYPE, ADDITIONAL_ATTACHMENT_LABEL } from './constants';

export const additionalInput = ({
  attachmentTypes = ATTACHMENTS_TYPE,
  label = ADDITIONAL_ATTACHMENT_LABEL,
} = {}) => (
  <>
    <VaSelect required name="docType" label={label}>
      {attachmentTypes.map(attachmentType => (
        <option key={attachmentType.value} value={attachmentType.value}>
          {attachmentType.label}
        </option>
      ))}
    </VaSelect>
  </>
);
