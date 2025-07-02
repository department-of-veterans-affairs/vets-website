import React, { useState, useRef } from 'react';
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
const PASSWORD_ERROR = 'Please provide a password to decrypt this file';

// Pure utility functions moved outside component
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

const createEncryptedFilesList = async files => {
  return Promise.all(
    files.map(async fileInfo => checkFileEncryption(fileInfo.file)),
  );
};

const validateFilesForSubmission = (files, encrypted) => {
  // Check if no files provided (always required)
  if (files.length === 0) {
    return { isValid: false, errors: [VALIDATION_ERROR] };
  }

  // Check for encrypted files without passwords
  const errors = [];
  let hasPasswordErrors = false;

  files.forEach((fileInfo, index) => {
    // Check if file is encrypted and missing password
    if (
      encrypted[index] &&
      (!fileInfo.password || fileInfo.password.trim() === '')
    ) {
      errors[index] = PASSWORD_ERROR;
      hasPasswordErrors = true;
    } else {
      errors[index] = null;
    }
  });

  return {
    isValid: !hasPasswordErrors,
    errors: hasPasswordErrors ? errors : [],
  };
};

const NewAddFilesForm = ({ onChange, onSubmit }) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [encrypted, setEncrypted] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = async event => {
    const { state } = event.detail;
    setFiles(state || []);

    // Clear errors when files are added
    if (state && state.length > 0) {
      setErrors([]);
      const encryptedStatus = await createEncryptedFilesList(state);
      setEncrypted(encryptedStatus);
    } else {
      setEncrypted([]);
    }

    if (onChange) {
      onChange(event);
    }
  };

  const handleSubmit = () => {
    const validation = validateFilesForSubmission(files, encrypted);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <>
      <VaFileInputMultiple
        ref={fileInputRef}
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
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default NewAddFilesForm;
