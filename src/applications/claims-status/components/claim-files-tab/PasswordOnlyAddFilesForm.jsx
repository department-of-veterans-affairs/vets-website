import React, { useState } from 'react';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  checkIsEncryptedPdf,
  FILE_TYPE_MISMATCH_ERROR,
} from 'platform/forms-system/src/js/utilities/file';

const AddFilesForm = () => {
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
    return fileState.map(f => ({
      file: f.file,
      password: f.password ?? '',
    }));
  };

  return (
    <>
      <VaFileInputMultiple
        encrypted={isEncryptedList}
        error={errorMessage}
        onVaMultipleChange={handleFileChange}
      />
      <va-button
        text="Submit files"
        onClick={() => console.log(buildPayload())}
      />
    </>
  );
};

export default AddFilesForm;

// [0] has no password, [1] has a password, delete [1] and it loses its password
