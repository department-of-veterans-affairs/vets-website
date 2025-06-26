import React, { useRef, useState } from 'react';
import {
  VaFileInputMultiple,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { DOC_TYPES } from '../../utils/helpers';
import { FILE_TYPES } from '../../utils/validations';

const getFileTypeId = (fileInputs, i) =>
  fileInputs[i]?.querySelector('va-select')?.value ?? '';

const buildPayload = (fileState, fileInputMultipleRef) => {
  const fileInputs = Array.from(
    fileInputMultipleRef.current.shadowRoot.querySelectorAll('va-file-input'),
  );

  return fileState.map((f, i) => ({
    file: f.file,
    password: f.password ?? '',
    fileTypeId: getFileTypeId(fileInputs, i),
  }));
};

const AddFilesForm = () => {
  const fileInputMultipleRef = useRef(null);
  const [fileState, setFileState] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = e => {
    setFileState(e.detail.state);
    setErrorMessage('');
  };

  const handleSubmit = () => {
    console.log(buildPayload(fileState, fileInputMultipleRef));
  };

  return (
    <>
      <VaFileInputMultiple
        accept={FILE_TYPES.map(type => `.${type}`).join(',')}
        error={errorMessage}
        ref={fileInputMultipleRef}
        onVaMultipleChange={handleFileChange}
      >
        <VaSelect label="What type of document is this?" required>
          {DOC_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </VaSelect>
      </VaFileInputMultiple>

      <va-button text="Submit files" onClick={handleSubmit} />
    </>
  );
};

export default AddFilesForm;
