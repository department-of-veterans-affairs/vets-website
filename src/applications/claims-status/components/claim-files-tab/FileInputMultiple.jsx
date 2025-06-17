import React, { useState } from 'react';
import {
  VaFileInputMultiple,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { DOC_TYPES } from '../../utils/helpers';
import { FILE_TYPES } from '../../utils/validations';

const FileInputMultiple = () => {
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
      // error={getErrorMessage()}
      label="Upload additional evidence"
      hint="You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only)."
      accept={FILE_TYPES.map(type => `.${type}`).join(',')}
      // vaMultipleChange={e => this.add(e.detail.files)}
      onVaMultipleChange={setEncrpytedForEachFile}
      name="fileUpload"
      additionalErrorClass="claims-upload-input-error-message"
      aria-describedby="file-requirements"
      encrypted={encryptedList}
    >
      <VaSelect
        required
        // error={
        //   validateIfDirty(docType, isNotBlank)
        //     ? undefined
        //     : 'Please provide a response'
        // }
        name="docType"
        label="What type of document is this?"
        // value={docType}
        // onVaSelect={e => this.handleDocTypeChange(e.detail.value, index)}
      >
        {DOC_TYPES.map(doc => (
          <option key={doc.value} value={doc.value}>
            {doc.label}
          </option>
        ))}
      </VaSelect>
    </VaFileInputMultiple>
  );
};

export default FileInputMultiple;
