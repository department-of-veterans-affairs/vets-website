import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import localStorage from 'platform/utilities/storage/localStorage';

// Utility function to upload a file and get confirmation code
const uploadFile = async (file, password = null) => {
  try {
    const payload = new FormData();
    payload.append('supporting_evidence_attachment[file_data]', file);
    if (password) {
      payload.append('supporting_evidence_attachment[password]', password);
    }

    // Get CSRF token from localStorage (standard in this codebase)
    const csrfTokenStored = localStorage.getItem('csrfToken');

    const response = await fetch(
      `${environment.API_URL}/v0/upload_supporting_evidence`,
      {
        method: 'POST',
        body: payload,
        credentials: 'include', // Include cookies for authentication
        headers: {
          'X-Key-Inflection': 'camel',
          'X-CSRF-Token': csrfTokenStored,
          'Source-App-Name': window.appName || 'vets-website',
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`,
      );
    }

    const result = await response.json();
    return {
      name: file.name,
      confirmationCode: result.data.attributes.guid,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    };
  } catch (error) {
    // If upload fails, return null to indicate failure
    return null;
  }
};

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
  const componentKey = useRef(0);

  // Simple function to restore files from formData
  const restoreFiles = useCallback(() => {
    if (Array.isArray(formData) && formData.length > 0) {
      const restoredFiles = formData.map(fileInfo => {
        let restoredFile;

        if (fileInfo.content) {
          // Restore file with actual content for proper thumbnails
          try {
            const binaryString = atob(fileInfo.content);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            restoredFile = new File([bytes], fileInfo.name || '', {
              type: fileInfo.type || 'application/octet-stream',
              lastModified: fileInfo.lastModified || Date.now(),
            });
          } catch (error) {
            // Fallback to empty file if content restoration fails
            restoredFile = new File([''], fileInfo.name || '', {
              type: fileInfo.type || 'application/octet-stream',
              lastModified: fileInfo.lastModified || Date.now(),
            });
          }
        } else {
          // Fallback: create a File object with the correct size but no content
          const buffer = new ArrayBuffer(fileInfo.size || 0);
          restoredFile = new File([buffer], fileInfo.name || '', {
            type: fileInfo.type || 'application/octet-stream',
            lastModified: fileInfo.lastModified || Date.now(),
          });
        }

        return {
          file: restoredFile,
          name: fileInfo.name || '',
          size: fileInfo.size || 0,
          type: fileInfo.type || '',
          lastModified: fileInfo.lastModified || Date.now(),
          confirmationCode: fileInfo.confirmationCode || '',
        };
      });

      setFiles(restoredFiles);
    }
  }, []); // Remove formData dependency to prevent infinite loops

  // Initialize files on mount and when formData changes
  useEffect(
    () => {
      restoreFiles();
      // Increment key to force re-render when formData changes (navigation)
      componentKey.current += 1;
    },
    [formData],
  ); // Only depend on formData, not restoreFiles

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

    // Upload files and get confirmation codes
    try {
      const uploadPromises = newFiles
        .filter(fileInfo => fileInfo && fileInfo.file)
        .map(async fileInfo => {
          try {
            // Upload the file to get a real confirmation code
            const uploadResult = await uploadFile(
              fileInfo.file,
              fileInfo.password,
            );

            if (uploadResult) {
              // Store the actual file content as base64 for thumbnail restoration
              let base64Content = null;
              try {
                const arrayBuffer = await fileInfo.file.arrayBuffer();
                base64Content = btoa(
                  String.fromCharCode(...new Uint8Array(arrayBuffer)),
                );
              } catch (error) {
                // If content conversion fails, continue without content
              }

              return {
                ...uploadResult,
                content: base64Content, // Store actual file content for thumbnails
                confirmationCode: uploadResult.confirmationCode, // Use real confirmation code from API
              };
            }
            // Upload failed, return basic file info
            return {
              name: fileInfo.file.name || '',
              size: fileInfo.file.size || 0,
              type: fileInfo.file.type || '',
              lastModified: fileInfo.file.lastModified || Date.now(),
              confirmationCode: `temp-${Date.now()}-${Math.random()}`,
            };
          } catch (uploadError) {
            // If upload fails, return the file info without confirmation code
            return {
              name: fileInfo.file.name || '',
              size: fileInfo.file.size || 0,
              type: fileInfo.file.type || '',
              lastModified: fileInfo.file.lastModified || Date.now(),
              confirmationCode: `temp-${Date.now()}-${Math.random()}`,
            };
          }
        });

      const formDataFiles = await Promise.all(uploadPromises);

      // Update form data
      onChange(formDataFiles || []);
    } catch (error) {
      // Fallback: create basic file info without upload
      const formDataFiles = newFiles.map(fileInfo => {
        if (fileInfo && fileInfo.file) {
          return {
            name: fileInfo.file.name || '',
            size: fileInfo.file.size || 0,
            type: fileInfo.file.type || '',
            lastModified: fileInfo.file.lastModified || Date.now(),
            confirmationCode: `temp-${Date.now()}-${Math.random()}`,
          };
        }
        return fileInfo;
      });
      onChange(formDataFiles || []);
    }
  };

  return (
    <div className="add-files-form">
      <VaFileInputMultiple
        key={`files-${componentKey.current}`}
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
            content: { type: 'string' }, // Store base64 file content for thumbnails
            password: { type: 'string' },
          },
        },
      },
    },
  },
};
