import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaFileInputMultiple,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { DOC_TYPES } from '../../utils/helpers';
import {
  FILE_TYPES,
  isNotBlank,
  validateIfDirty,
} from '../../utils/validations';

export default function FileInputMultiple({
  add,
  docType,
  handleDocTypeChange,
  getErrorMessage,
}) {
  const [encryptedList, setEncryptedList] = useState([]);

  const setEncrpytedForEachFile = event => {
    const fileEntries = event.detail.state;
    const pdfFiles = fileEntries?.map(file => {
      return file.file.type === 'application/pdf';
    });
    setEncryptedList(pdfFiles);
  };
  return (
    <VaFileInputMultiple
      id="file-upload"
      error={getErrorMessage()}
      label="Upload additional evidence"
      hint="You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only)."
      accept={FILE_TYPES.map(type => `.${type}`).join(',')}
      vaMultipleChange={e => add(e.detail.files)}
      onVaMultipleChange={setEncrpytedForEachFile}
      name="fileUpload"
      additionalErrorClass="claims-upload-input-error-message"
      aria-describedby="file-requirements"
      encrypted={encryptedList}
    >
      <VaSelect
        required
        error={
          validateIfDirty(docType, isNotBlank)
            ? undefined
            : 'Please provide a response'
        }
        name="docType"
        label="What type of document is this?"
        value={docType}
        onVaSelect={e => handleDocTypeChange(e.detail.value)}
      >
        {DOC_TYPES.map(doc => (
          <option key={doc.value} value={doc.value}>
            {doc.label}
          </option>
        ))}
      </VaSelect>
    </VaFileInputMultiple>
  );
}

FileInputMultiple.propTypes = {
  add: PropTypes.func,
  docType: PropTypes.string,
  getErrorMessage: PropTypes.func,
  handleDocTypeChange: PropTypes.func,
};
