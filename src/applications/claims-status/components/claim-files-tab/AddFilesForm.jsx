import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  VaFileInputMultiple,
  VaButton,
  VaSelect,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Toggler } from 'platform/utilities/feature-toggles';
import {
  checkIsEncryptedPdf,
  readAndCheckFile,
} from 'platform/forms-system/src/js/utilities/file';

import { DOC_TYPES } from '../../utils/helpers';
import { FILE_TYPES, isPdf, validateFiles } from '../../utils/validations';
import mailMessage from '../MailMessage';
import UploadStatus from '../UploadStatus';

import {
  LABEL_TEXT,
  HINT_TEXT,
  VALIDATION_ERROR,
  PASSWORD_ERROR,
  DOC_TYPE_ERROR,
  SUBMIT_TEXT,
} from '../../constants';

// File encryption utilities
const checkFileEncryption = async file => {
  if (!isPdf(file)) {
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

// Shadow DOM extraction utilities
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

const extractDocumentTypesFromShadowDOM = fileInputRef => {
  const fileInputs = Array.from(
    fileInputRef.current?.shadowRoot?.querySelectorAll('va-file-input') || [],
  );

  return fileInputs.map(fileInput => {
    const vaSelect = fileInput.querySelector('va-select');
    return vaSelect?.value || '';
  });
};

// Error handling utilities
const clearNoFilesError = prevErrors => {
  if (prevErrors.length === 1 && prevErrors[0] === VALIDATION_ERROR) {
    return [];
  }
  return prevErrors;
};

const clearSpecificErrors = (prevErrors, errorType, shouldClear) => {
  const newErrors = [...prevErrors];
  let hasChanges = false;

  prevErrors.forEach((error, index) => {
    if (error === errorType && shouldClear(index)) {
      newErrors[index] = null;
      hasChanges = true;
    }
  });

  return hasChanges ? newErrors : prevErrors;
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

const updateErrorsOnFileChange = (prevErrors, files, newFiles, action) => {
  // First, clear "no files" error if present
  let updatedErrors = clearNoFilesError(prevErrors);

  // Handle errors based on the specific action
  if (action === 'FILE_REMOVED') {
    // Rebuild error array to match remaining files
    updatedErrors = rebuildErrorsAfterFileDeletion(files, newFiles, prevErrors);
  } else if (action === 'PASSWORD_UPDATE') {
    // Clear password errors when passwords are provided
    updatedErrors = clearSpecificErrors(
      updatedErrors,
      PASSWORD_ERROR,
      index =>
        newFiles[index]?.password && newFiles[index].password.trim() !== '',
    );
  }

  return updatedErrors;
};

const applyValidationErrors = (
  baseErrors,
  validationResults,
  files,
  wasFileReplaced = false,
) => {
  const updatedErrors = [...baseErrors];

  if (wasFileReplaced) {
    // Clear ALL errors when a file was replaced (FILE_UPDATED action) - fresh validation for replaced files
    files.forEach((_, index) => {
      updatedErrors[index] = null;
    });
  }

  // Apply new validation errors
  validationResults.forEach(result => {
    updatedErrors[result.index] = result.error;
  });

  return updatedErrors;
};

// Validation and submission utilities
const validateFilesForSubmission = (
  files,
  encrypted,
  docTypes,
  existingErrors,
) => {
  // Check if no files provided (always required)
  if (files.length === 0) {
    return { isValid: false, errors: [VALIDATION_ERROR] };
  }

  // Re-enable checking existing errors (file validation errors)
  const errors = [...(existingErrors || [])];
  let hasErrors = false;

  files.forEach((fileInfo, index) => {
    // Check existing validation errors
    if (errors[index]) {
      hasErrors = true;
    }
    // Check if file is encrypted and missing password
    else if (
      encrypted[index] &&
      (!fileInfo.password || fileInfo.password.trim() === '')
    ) {
      errors[index] = PASSWORD_ERROR;
      hasErrors = true;
    }
    // Check if document type is missing or empty
    else if (!docTypes[index] || docTypes[index].trim() === '') {
      errors[index] = DOC_TYPE_ERROR;
      hasErrors = true;
    }
  });

  return {
    isValid: !hasErrors,
    errors: hasErrors ? errors : [],
  };
};

const createSubmissionPayload = (files, docTypes, encrypted) => {
  return files.map((fileInfo, index) => ({
    file: fileInfo.file,
    // Include file metadata for better debugging (File objects don't serialize)
    fileMetadata: fileInfo.file
      ? {
          name: fileInfo.file.name,
          size: fileInfo.file.size,
          type: fileInfo.file.type,
          lastModified: fileInfo.file.lastModified,
        }
      : null,
    password: encrypted[index] ? fileInfo.password : '',
    docType: docTypes[index] || '',
  }));
};

const AddFilesForm = ({ fileTab, onSubmit, uploading, progress, onCancel }) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [encrypted, setEncrypted] = useState([]);
  const [canShowUploadModal, setCanShowUploadModal] = useState(false);
  const fileInputRef = useRef(null);

  // Track document type changes and clear errors immediately
  useEffect(
    () => {
      // Poll for document type changes to clear errors immediately
      const interval = setInterval(() => {
        const currentDocTypes = extractDocumentTypesFromShadowDOM(fileInputRef);

        setErrors(prevErrors =>
          clearSpecificErrors(
            prevErrors,
            DOC_TYPE_ERROR,
            index => currentDocTypes[index]?.trim() !== '',
          ),
        );
      }, 150);

      return () => clearInterval(interval);
    },
    [files],
  );

  const handleFileChange = async event => {
    const { action, state } = event.detail;
    const newFiles = state || [];

    // Validate all files
    const validationResults = await validateFiles(newFiles);

    setFiles(newFiles);

    if (newFiles.length > 0) {
      // Update errors based on file changes and validation
      setErrors(prevErrors => {
        const baseErrors = updateErrorsOnFileChange(
          prevErrors,
          files,
          newFiles,
          action,
        );

        // Check if a file was replaced (not added or removed)
        const wasFileReplaced = action === 'FILE_UPDATED';
        return applyValidationErrors(
          baseErrors,
          validationResults,
          newFiles,
          wasFileReplaced,
        );
      });

      const encryptedStatus = await createEncryptedFilesList(newFiles);
      setEncrypted(encryptedStatus);
    } else {
      // Clear all errors when all files are removed
      setErrors([]);
      setEncrypted([]);
    }
  };

  const handleSubmit = () => {
    // Extract current password values from shadow DOM elements
    const updatedFiles = extractPasswordsFromShadowDOM(
      fileInputRef,
      files,
      encrypted,
    );

    // Extract document types from shadow DOM
    const currentDocTypes = extractDocumentTypesFromShadowDOM(fileInputRef);

    // Pass existing errors to validation so ALL errors are checked together
    const validation = validateFilesForSubmission(
      updatedFiles,
      encrypted,
      currentDocTypes,
      errors,
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Create complete payload for submission
    const payload = createSubmissionPayload(
      updatedFiles,
      currentDocTypes,
      encrypted,
    );

    // Create files array in the exact format the submit actions expect
    const formattedFiles = payload.map(item => ({
      file: item.file,
      docType: { value: item.docType },
      password: { value: item.password },
    }));

    // Show upload modal on successful validation
    setCanShowUploadModal(true);
    onSubmit(formattedFiles);
  };

  const showUploadModal = uploading && canShowUploadModal;

  return (
    <>
      <div className="add-files-form">
        <Toggler toggleName={Toggler.TOGGLE_NAMES.cstFriendlyEvidenceRequests}>
          <Toggler.Enabled>
            <div>
              {!fileTab && (
                <>
                  <h2>Upload documents</h2>
                  <p>If you have a document to upload, you can do that here.</p>
                </>
              )}
            </div>
          </Toggler.Enabled>
        </Toggler>
        <VaFileInputMultiple
          accept={FILE_TYPES.map(type => `.${type}`).join(',')}
          ref={fileInputRef}
          hint={HINT_TEXT}
          label={LABEL_TEXT}
          onVaMultipleChange={handleFileChange}
          errors={errors}
          encrypted={encrypted}
        >
          <VaSelect
            required
            name="docType"
            label="What type of document is this?"
          >
            {DOC_TYPES.map(doc => (
              <option key={doc.value} value={doc.value}>
                {doc.label}
              </option>
            ))}
          </VaSelect>
        </VaFileInputMultiple>
        <VaButton
          class="vads-u-margin-top--3"
          text={SUBMIT_TEXT}
          onClick={handleSubmit}
        />
        <va-additional-info
          class="vads-u-margin-y--3"
          trigger="Need to mail your documents?"
        >
          {mailMessage}
        </va-additional-info>
        <VaModal
          id="upload-status"
          onCloseEvent={() => setCanShowUploadModal(false)}
          visible={showUploadModal}
        >
          <UploadStatus
            progress={progress}
            files={files.length}
            onCancel={onCancel}
          />
        </VaModal>
      </div>
    </>
  );
};

AddFilesForm.propTypes = {
  progress: PropTypes.number.isRequired,
  uploading: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fileTab: PropTypes.bool,
};

export default AddFilesForm;
