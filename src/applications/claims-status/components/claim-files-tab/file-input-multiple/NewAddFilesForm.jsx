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

// Error handling utilities
const clearNoFilesError = prevErrors => {
  if (prevErrors.length === 1 && prevErrors[0] === VALIDATION_ERROR) {
    return [];
  }
  return prevErrors;
};

const rebuildErrorsAfterFileDeletion = (currentFiles, newFiles, prevErrors) => {
  const newErrors = [];
  // Match errors to files by file reference, not by index
  newFiles.forEach((fileInfo, newIndex) => {
    const originalIndex = currentFiles.findIndex(f => f.file === fileInfo.file);
    if (originalIndex !== -1 && prevErrors[originalIndex]) {
      newErrors[newIndex] = prevErrors[originalIndex];
    }
  });
  return newErrors;
};

const clearPasswordErrorsWhenProvided = (files, prevErrors) => {
  const newErrors = [...prevErrors];
  files.forEach((fileInfo, index) => {
    if (
      fileInfo.password &&
      fileInfo.password.trim() !== '' &&
      prevErrors[index] === PASSWORD_ERROR
    ) {
      newErrors[index] = null;
    }
  });
  return newErrors;
};

const extractPasswordsFromShadowDOM = (fileInputRef, files, encrypted) => {
  const updatedFiles = [...files];
  const vaFileInputElements = fileInputRef.current?.shadowRoot?.querySelectorAll(
    'va-file-input',
  );

  if (vaFileInputElements) {
    vaFileInputElements.forEach((vaFileInput, index) => {
      if (encrypted[index]) {
        const vaTextInput = vaFileInput.shadowRoot?.querySelector(
          'va-text-input',
        );
        const passwordInput = vaTextInput?.shadowRoot?.querySelector('input');
        if (passwordInput && updatedFiles[index]) {
          updatedFiles[index] = {
            ...updatedFiles[index],
            password: passwordInput.value,
          };
        }
      }
    });
  }

  return updatedFiles;
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
    const previousFileCount = files.length;
    const newFiles = state || [];

    setFiles(newFiles);

    if (newFiles.length > 0) {
      // Update errors based on file changes
      setErrors(prevErrors => {
        // First, clear "no files" error if present
        let updatedErrors = clearNoFilesError(prevErrors);

        // If files were removed, rebuild error array to match current files
        if (newFiles.length < previousFileCount) {
          updatedErrors = rebuildErrorsAfterFileDeletion(
            files,
            newFiles,
            prevErrors,
          );
        } else {
          // Clear password errors when passwords are provided (User Story #9)
          updatedErrors = clearPasswordErrorsWhenProvided(
            newFiles,
            updatedErrors,
          );
        }

        return updatedErrors;
      });

      const encryptedStatus = await createEncryptedFilesList(newFiles);
      setEncrypted(encryptedStatus);
    } else {
      // Clear all errors when all files are removed
      setErrors([]);
      setEncrypted([]);
    }

    if (onChange) {
      onChange(event);
    }
  };

  const handleSubmit = () => {
    // Extract current password values from shadow DOM elements
    const updatedFiles = extractPasswordsFromShadowDOM(
      fileInputRef,
      files,
      encrypted,
    );

    const validation = validateFilesForSubmission(updatedFiles, encrypted);

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
