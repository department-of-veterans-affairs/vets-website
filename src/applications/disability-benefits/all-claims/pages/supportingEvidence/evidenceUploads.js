import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  readAndCheckFile,
  checkIsEncryptedPdf,
} from 'platform/forms-system/src/js/utilities/file';

// Constants for this implementation
const LABEL_TEXT = 'Upload supporting evidence';
const HINT_TEXT =
  'You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 99 MB (PDF only).';
const VALIDATION_ERROR = 'Please select a file first';
const PASSWORD_ERROR = 'Please provide a password to decrypt this file';

// File encryption utilities
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
  if (!Array.isArray(prevErrors)) {
    return [];
  }
  if (prevErrors.length === 1 && prevErrors[0] === VALIDATION_ERROR) {
    return [];
  }
  return prevErrors;
};

const clearSpecificErrors = (prevErrors, errorType, shouldClear) => {
  // Ensure prevErrors is an array
  if (!Array.isArray(prevErrors)) {
    return [];
  }

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

  // Ensure all parameters are arrays
  if (
    !Array.isArray(currentFiles) ||
    !Array.isArray(newFiles) ||
    !Array.isArray(prevErrors)
  ) {
    return newErrors;
  }

  // Match errors to files by file reference, not by index
  newFiles.forEach((fileInfo, newIndex) => {
    const originalIndex = currentFiles.findIndex(f => f.file === fileInfo.file);
    if (originalIndex !== -1 && prevErrors[originalIndex]) {
      newErrors[newIndex] = prevErrors[originalIndex];
    }
  });
  return newErrors;
};

const updateErrorsOnFileChange = (
  prevErrors,
  files,
  newFiles,
  previousFileCount,
) => {
  // First, clear "no files" error if present
  let updatedErrors = clearNoFilesError(prevErrors);

  // If files were removed, rebuild error array to match current files
  if (newFiles.length < previousFileCount) {
    updatedErrors = rebuildErrorsAfterFileDeletion(files, newFiles, prevErrors);
  } else {
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

// Custom field component using VaFileInputMultiple
const EvidenceUploadsField = props => {
  const { onChange, formData = [] } = props;
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [encrypted, setEncrypted] = useState([]);
  const fileInputRef = useRef(null);

  // Initialize files state from formData when component mounts or formData changes
  useEffect(
    () => {
      if (Array.isArray(formData) && formData.length > 0) {
        // Convert formData back to the format VaFileInputMultiple expects
        const existingFiles = formData.map(fileInfo => ({
          file: new File([''], fileInfo.name || '', {
            type: fileInfo.type || 'application/octet-stream',
            lastModified: fileInfo.lastModified || Date.now(),
          }),
          name: fileInfo.name || '',
          size: fileInfo.size || 0,
          type: fileInfo.type || '',
          lastModified: fileInfo.lastModified || Date.now(),
          confirmationCode: fileInfo.confirmationCode || '',
        }));
        setFiles(existingFiles);
      }
    },
    [formData],
  );

  const handleFileChange = async event => {
    // Ensure event and event.detail exist
    if (!event || !event.detail) {
      return;
    }

    const { state } = event.detail;
    const previousFileCount = files.length;
    const newFiles = Array.isArray(state) ? state : [];

    // Update local state
    setFiles(newFiles);

    if (newFiles.length > 0) {
      // Update errors based on file changes
      setErrors(prevErrors => {
        return updateErrorsOnFileChange(
          prevErrors,
          files,
          newFiles,
          previousFileCount,
        );
      });

      const encryptedStatus = await createEncryptedFilesList(newFiles);
      setEncrypted(encryptedStatus);
    } else {
      // Clear all errors when all files are removed
      setErrors([]);
      setEncrypted([]);
    }

    // Convert File objects to plain objects for form data
    const formDataFiles = newFiles.map(fileInfo => {
      if (fileInfo && fileInfo.file) {
        return {
          name: fileInfo.file.name || '',
          size: fileInfo.file.size || 0,
          type: fileInfo.file.type || '',
          lastModified: fileInfo.file.lastModified || Date.now(),
          // Generate a temporary confirmation code for new files
          confirmationCode:
            fileInfo.confirmationCode || `temp-${Date.now()}-${Math.random()}`,
        };
      }
      return fileInfo;
    });

    // Update form data
    onChange(formDataFiles || []);
  };

  return (
    <div className="add-files-form">
      <VaFileInputMultiple
        key={files.length > 0 ? 'has-files' : 'no-files'}
        accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.txt"
        ref={fileInputRef}
        hint={HINT_TEXT}
        label={LABEL_TEXT}
        onVaMultipleChange={handleFileChange}
        errors={errors}
        encrypted={encrypted}
        uploadedFiles={files.map((fileInfo, index) => ({
          key: fileInfo.confirmationCode || `file-${index}`,
          name: fileInfo.name,
          size: fileInfo.size,
          type: fileInfo.type,
          confirmationCode: fileInfo.confirmationCode || `temp-${Date.now()}`,
          lastModified: fileInfo.lastModified,
        }))}
        value={
          files.length > 0 ? files.map(fileInfo => fileInfo.file) : undefined
        }
      />
    </div>
  );
};

EvidenceUploadsField.propTypes = {
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.array,
};

export default {
  uiSchema: {
    'ui:title': 'Add Document',
    uploadedDocuments: {
      'ui:field': EvidenceUploadsField,
      'ui:description': 'Upload the evidence you want to add to your claim',
      'ui:options': {
        itemName: 'document',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      uploadedDocuments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            size: { type: 'number' },
            type: { type: 'string' },
            lastModified: { type: 'number' },
            password: { type: 'string' },
          },
        },
      },
    },
  },
};
