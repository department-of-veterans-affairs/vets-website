import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  VaFileInputMultiple,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  readAndCheckFile,
  checkIsEncryptedPdf,
} from 'platform/forms-system/src/js/utilities/file';

const HINT_TEXT =
  'You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only).';
const LABEL_TEXT = 'Upload additional evidence';
const SUBMIT_TEXT = 'Submit documents for review';
const VALIDATION_ERROR = 'Please select a file first';

const checkFileEncryption = async file => {
  if (!file.name?.toLowerCase().endsWith('.pdf')) {
    return false;
  }

  try {
    const checks = { checkIsEncryptedPdf };
    const checkResults = await readAndCheckFile(file, checks);
    return checkResults.checkIsEncryptedPdf;
  } catch (error) {
    return false;
  }
};

const NewAddFilesForm = ({ onChange, onSubmit, required }) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [encrypted, setEncrypted] = useState([]);

  const checkForEncryptedFiles = async newFiles => {
    const encryptedStatus = await Promise.all(
      newFiles.map(async fileInfo => checkFileEncryption(fileInfo.file)),
    );
    setEncrypted(encryptedStatus);
  };

  const handleFileChange = event => {
    const { state } = event.detail;
    setFiles(state || []);

    // Clear errors when files are added
    if (state && state.length > 0) {
      setErrors([]);
      checkForEncryptedFiles(state);
    } else {
      setEncrypted([]);
    }

    if (onChange) {
      onChange(event);
    }
  };

  const handleSubmit = () => {
    if (required && files.length === 0) {
      setErrors([VALIDATION_ERROR]);
      return;
    }

    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <>
      <VaFileInputMultiple
        hint={HINT_TEXT}
        label={LABEL_TEXT}
        onVaMultipleChange={handleFileChange}
        errors={errors}
        encrypted={encrypted}
      />
      <VaButton text={SUBMIT_TEXT} onClick={handleSubmit} />
    </>
  );
};

NewAddFilesForm.propTypes = {
  required: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default NewAddFilesForm;
