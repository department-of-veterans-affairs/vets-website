import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  VaFileInputMultiple,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { validateFiles } from './fileValidation';
import {
  createEncryptedFilesList,
  extractPasswordsFromShadowDOM,
  clearSpecificErrors,
  updateErrorsOnFileChange,
  applyValidationErrors,
  LABEL_TEXT,
  HINT_TEXT,
  VALIDATION_ERROR,
  PASSWORD_ERROR,
  SUBMIT_TEXT,
} from './NewAddFilesForm';

import { FILE_TYPES } from '../../../utils/validations';

const validateFilesForSubmissionPasswordOnly = (files, encrypted) => {
  if (files.length === 0) {
    return { isValid: false, errors: [VALIDATION_ERROR] };
  }

  const errors = [];
  let hasErrors = false;

  files.forEach((fileInfo, index) => {
    if (
      encrypted[index] &&
      (!fileInfo.password || fileInfo.password.trim() === '')
    ) {
      errors[index] = PASSWORD_ERROR;
      hasErrors = true;
    } else {
      errors[index] = null;
    }
  });

  return {
    isValid: !hasErrors,
    errors: hasErrors ? errors : [],
  };
};

const createSubmissionPayloadPasswordOnly = files => {
  return files.map(fileInfo => ({
    file: fileInfo.file,
    fileMetadata: fileInfo.file
      ? {
          name: fileInfo.file.name,
          size: fileInfo.file.size,
          type: fileInfo.file.type,
          lastModified: fileInfo.file.lastModified,
        }
      : null,
    password: fileInfo.password || '',
  }));
};

const OnlyPasswordAddFilesForm = ({ onChange, onSubmit }) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [encrypted, setEncrypted] = useState([]);
  const [lastPayload, setLastPayload] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(
    () => {
      const interval = setInterval(() => {
        const updatedFiles = extractPasswordsFromShadowDOM(
          fileInputRef,
          files,
          encrypted,
        );

        setErrors(prevErrors =>
          clearSpecificErrors(
            prevErrors,
            PASSWORD_ERROR,
            index =>
              updatedFiles[index]?.password &&
              updatedFiles[index].password.trim() !== '',
          ),
        );
      }, 150);

      return () => clearInterval(interval);
    },
    [files, encrypted],
  );

  const handleFileChange = async event => {
    const { state } = event.detail;
    const previousFileCount = files.length;
    const newFiles = state || [];

    const validationResults = await validateFiles(newFiles);

    setFiles(newFiles);

    if (newFiles.length > 0) {
      setErrors(prevErrors => {
        const baseErrors = updateErrorsOnFileChange(
          prevErrors,
          files,
          newFiles,
          previousFileCount,
        );

        return applyValidationErrors(baseErrors, validationResults);
      });

      const encryptedStatus = await createEncryptedFilesList(newFiles);
      setEncrypted(encryptedStatus);
    } else {
      setErrors([]);
      setEncrypted([]);
    }

    if (onChange) {
      onChange(event);
    }
  };

  const handleSubmit = () => {
    const updatedFiles = extractPasswordsFromShadowDOM(
      fileInputRef,
      files,
      encrypted,
    );

    const validation = validateFilesForSubmissionPasswordOnly(
      updatedFiles,
      encrypted,
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const payload = createSubmissionPayloadPasswordOnly(updatedFiles);

    setLastPayload(payload);

    if (onSubmit) {
      onSubmit(payload);
    }
  };

  return (
    <>
      <VaFileInputMultiple
        accept={FILE_TYPES.map(type => `.${type}`).join(',')}
        ref={fileInputRef}
        hint={HINT_TEXT}
        label={LABEL_TEXT}
        onVaMultipleChange={handleFileChange}
        errors={errors}
        encrypted={encrypted}
      />
      <VaButton text={SUBMIT_TEXT} onClick={handleSubmit} />
      {/* Debug info - remove in production */}
      {lastPayload && (
        <div style={{ marginTop: '2rem', fontSize: '0.875rem' }}>
          <h4>Last Submit Payload:</h4>
          <pre>{JSON.stringify(lastPayload, null, 2)}</pre>
        </div>
      )}
    </>
  );
};

OnlyPasswordAddFilesForm.propTypes = {
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default OnlyPasswordAddFilesForm;
