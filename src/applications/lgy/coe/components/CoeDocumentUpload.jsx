import React, { useState } from 'react';
import FileInput from '@department-of-veterans-affairs/component-library/FileInput';
import { VaSelect, VaTextInput } from 'web-components/react-bindings';

import { DOCUMENT_TYPES } from '../constants';

export const CoeDocumentUpload = () => {
  const [formData, setFormData] = useState({
    documentType: null,
    documentDescription: null,
  });

  const onSelectChange = e => {
    setFormData({
      ...formData,
      documentType: e?.detail?.value,
    });
  };

  return (
    <>
      <h2>We need documents from you</h2>
      <p>
        We’ve sent a notification letter or email about documentation for your
        COE application. Please send us all the documents listed so we can make
        a decision about your application.
      </p>
      <VaSelect
        label="Select a document to upload"
        name="documents"
        role="combobox"
        onVaSelect={onSelectChange}
      >
        {DOCUMENT_TYPES.map((docType, index) => (
          <option key={index} value={docType}>
            {docType}
          </option>
        ))}
      </VaSelect>
      {formData.documentType === 'Other' && (
        <VaTextInput
          label="Document description"
          value={formData.documentDescription}
          required={formData.documentType === 'Other'}
        />
      )}
      <FileInput buttonText="Upload this document" onChange={() => {}} />
    </>
  );
};
