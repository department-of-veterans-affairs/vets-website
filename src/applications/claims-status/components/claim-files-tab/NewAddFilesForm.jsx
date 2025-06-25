import React, { useRef, useState } from 'react';
import {
  VaFileInputMultiple,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  checkIsEncryptedPdf,
  FILE_TYPE_MISMATCH_ERROR,
} from 'platform/forms-system/src/js/utilities/file';

import { DOC_TYPES } from '../../utils/helpers';
import { FILE_TYPES } from '../../utils/validations';

const AddFilesForm = () => {
  const fileInputMultipleRef = useRef(null);
  const [fileState, setFileState] = useState([]);
  const [isEncryptedList, setIsEncryptedList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const createIsEncryptedList = async files => {
    const list = await Promise.all(
      files?.map(async file => {
        const checkResults = await readAndCheckFile(file.file, {
          checkTypeAndExtensionMatches,
          checkIsEncryptedPdf,
        });

        if (!checkResults.checkTypeAndExtensionMatches) {
          setErrorMessage(FILE_TYPE_MISMATCH_ERROR);
          return false;
        }

        if (file.file.type === 'application/pdf') {
          return checkResults.checkIsEncryptedPdf;
        }

        return false;
      }),
    );

    setIsEncryptedList(list);
  };

  const handleFileChange = e => {
    setFileState(e.detail.state);
    createIsEncryptedList(e.detail.state);
  };

  const buildPayload = () => {
    const fileInputs = Array.from(
      fileInputMultipleRef.current.shadowRoot.querySelectorAll('va-file-input'),
    );

    return fileState.map((f, i) => {
      const fileTypeId = fileInputs[i]?.querySelector('va-select')?.value ?? '';
      return {
        file: f.file,
        password: f.password ?? '',
        fileTypeId,
      };
    });
  };

  return (
    <>
      <VaFileInputMultiple
        accept={FILE_TYPES.map(type => `.${type}`).join(',')}
        encrypted={isEncryptedList}
        error={errorMessage}
        hint="You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only)."
        label="Upload additional evidence"
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

      <va-button text="Submit files" onClick={() => buildPayload()} />
    </>
  );
};

export default AddFilesForm;
