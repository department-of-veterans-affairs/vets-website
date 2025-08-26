import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// Constants for this implementation
const LABEL_TEXT = 'Upload supporting evidence';
const HINT_TEXT =
  'You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 99 MB (PDF only).';
const VALIDATION_ERROR = 'Please select a file first';

// Utility function to format file sizes
const formatFileSize = bytes => {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
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
  }

  return updatedErrors;
};

// Custom field component using VaFileInputMultiple
const EvidenceUploadsField = props => {
  const { onChange, formData = [] } = props;
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Initialize files state from formData when component mounts
  useEffect(
    () => {
      if (Array.isArray(formData) && formData.length > 0) {
        // Convert formData back to File objects for display
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
      } else {
        setFiles([]);
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

    // Update local state with the actual File objects
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
    } else {
      // Clear all errors when all files are removed
      setErrors([]);
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
        key={`files-${files.length}`}
        accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.txt"
        ref={fileInputRef}
        hint={
          files.length === 0
            ? HINT_TEXT
            : 'Drag an additional file here or choose from folder'
        }
        label={LABEL_TEXT}
        onVaMultipleChange={handleFileChange}
        errors={errors}
        uploadedFiles={
          files.length > 0
            ? files.map((fileInfo, index) => {
                // Get the most accurate size value
                const accurateSize = fileInfo.isRestored
                  ? fileInfo.size // Use stored metadata for restored files
                  : fileInfo.file?.size || fileInfo.size || 0; // Use File object size for fresh files

                return {
                  key: fileInfo.confirmationCode || `file-${index}`,
                  name: fileInfo.isRestored
                    ? fileInfo.name
                    : fileInfo.name || fileInfo.file?.name || '',
                  size: formatFileSize(accurateSize),
                  type: fileInfo.isRestored
                    ? fileInfo.type
                    : fileInfo.type || fileInfo.file?.type || '',
                  confirmationCode:
                    fileInfo.confirmationCode || `temp-${Date.now()}`,
                  lastModified: fileInfo.isRestored
                    ? fileInfo.lastModified
                    : fileInfo.lastModified ||
                      fileInfo.file?.lastModified ||
                      Date.now(),
                };
              })
            : undefined
        }
        value={
          files.length > 0
            ? files
                .filter(fileInfo => fileInfo.file)
                .map(fileInfo => fileInfo.file)
            : undefined
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
