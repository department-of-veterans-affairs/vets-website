// The following are the user stories that need to be retained as part of this implementation:
// ~As a user, I can add multiple files to the VaFileInputMultiple~
// - As a user that is adding an encrypted file, the component will detect that the file is encrypted and if so show a password input.
// - As a user, if I try to submit an encrypted file without a password, I will see the error "Please provide a password to decrypt this file"
// - As a user, that is adding a non-encrypted file, the component will detect that the file is not encrypted and not show the password input.
// - As a user, each file I add will have a VaSelect that asks "What type of document is this?" (options are populated by FILE_TYPES found in 'utils/validations' of the application)
// - As a user, if I try to submit a file without a file type, I will see the error "Please select a file type."
// - As a user, if I try to input a file in which file mime type and signature do not match I will see the error "The file extension doesn’t match the file format. Please choose a different file." and not be able to submit the file
// - As a user, if I try to input a file that is not one of the valid file types (which are found in FILE_TYPES 'utils/validations') I will see the error "Please choose a file from one of the accepted types."
// - As a user, if I try to input a pdf that is above 99MB or another file type above 50MB I will get the following: "The file you selected is larger than the ${maxSize}MB maximum file size and could not be added."
// - As a user, if I try to input a file that is 0MB I will get the following: "The file you selected is empty. Files uploaded must be larger than 0B."
// - As a user, if I add files that fit all these requirements and therefore have no error messages I can submit them. On submit the current uploading files modal shows a progressbar with submission progress and then if successful a success va-alert above the VaFileInputMultiple.
// - As a user, I can click Remove and be shown a confirm modal. On the modal I can delete or cancel. If I delete the file, the other files will retain their correct data.
// - As a user, I see the label "Upload additional evidence" with the hint" You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only)."

// IMMEDIATE:
// - Make the select required
// - Make the password required
// - BUG: If [0] has no password, [1] has a password, and I delete [0] and [0] loses its password

// Questions:
// Why are there no examples of how to use this? The storybook shows no way to capture the child value

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

const getFileTypeId = (fileInputs, i) =>
  fileInputs[i]?.querySelector('va-select')?.value;

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

      <va-button
        text="Submit files"
        onClick={() => console.log(buildPayload())}
      />
    </>
  );
};

export default AddFilesForm;
