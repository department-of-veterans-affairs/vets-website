import React, { useRef, useState } from 'react';
import {
  VaFileInputMultiple,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { DOC_TYPES } from '../../utils/helpers';
import { FILE_TYPES } from '../../utils/validations';

const getFileTypeId = (fileInputs, i) =>
  fileInputs[i]?.querySelector('va-select')?.value;

const AddFilesForm = () => {
  const fileInputMultipleRef = useRef(null);
  const [fileState, setFileState] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = e => {
    setFileState(e.detail.state);
  };

  const buildPayload = () => {
    const fileInputs = Array.from(
      fileInputMultipleRef.current.shadowRoot.querySelectorAll('va-file-input'),
    );

    return fileState.map((f, i) => ({
      file: f.file,
      password: f.password ?? '',
      fileTypeId: getFileTypeId(fileInputs, i) ?? '',
    }));
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
          {DOC_TYPES.map(doc => (
            <option key={doc.value} value={doc.value}>
              {doc.label}
            </option>
          ))}
        </VaSelect>
      </VaFileInputMultiple>

      <va-button
        text="Submit files"
        onClick={() => console.log(buildPayload())}
      />
    </>
  );
};

export default AddFilesForm;
