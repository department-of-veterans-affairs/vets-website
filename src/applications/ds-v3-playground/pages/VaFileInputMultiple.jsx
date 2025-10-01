/* eslint-disable no-console */
import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  VaFileInputMultiple,
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/web-components/react-bindings';
import { standardFileChecks } from 'platform/forms-system/src/js/utilities/file';
import { debounce } from 'lodash';

// Debounce wait time for text inputs
const DEBOUNCE_WAIT = 1000;

export default function VaFileInputMultiplePage() {
  const componentRef = useRef(null);

  const [files, setFiles] = useState([]); // The uploaded files
  const [percentsUploaded, setPercentsUploaded] = useState([]); // Track upload progress of each file
  const [encrypted, setEncrypted] = useState([]); // Track which files are encrypted and need a password

  // Error Management
  const [fileErrors, setFileErrors] = useState([]); // File-level errors (upload, validation)
  const [passwordErrors, setPasswordErrors] = useState([]); // Password validation errors
  // Additional input validation errors. Not used in the component at this time
  // but if va-select is added in the future, it can be used to validate the selection
  // eslint-disable-next-line no-unused-vars
  const [additionalInputErrors, setAdditionalInputErrors] = useState([]);

  // Mock file upload with error scenarios
  const mockFileUpload = async (file, index, password = null) => {
    // Clear any previous errors for this file
    setFileErrors(prev => {
      const newFileErrors = [...prev];
      newFileErrors[index] = null;
      return newFileErrors;
    });

    // Simulate various error scenarios based on filename
    const shouldSimulateError = () => {
      const fileName = file.name.toLowerCase();

      // Network/connection errors
      if (fileName.includes('error')) {
        return {
          type: 'network',
          message: 'Network error occurred during upload. Please try again.',
        };
      }

      // Server errors
      if (fileName.includes('server')) {
        return {
          type: 'server',
          message: 'Server error: Unable to process file at this time.',
        };
      }

      // Rate limiting
      if (fileName.includes('limit')) {
        return {
          type: 'rate_limit',
          message: 'Rate limit exceeded. Please wait before uploading again.',
        };
      }

      // File size validation (simulated - can be handled by component if needed)
      if (file.size > 1024 * 1024) {
        // 1MB limit for demo
        return {
          type: 'file_size',
          message: 'File size exceeds 1MB limit.',
        };
      }

      // Simulate invalid password for encrypted files
      if (password && password.length < 8) {
        return {
          type: 'password',
          message: 'Password must be at least 8 characters long.',
        };
      }

      return null;
    };

    const errorScenario = shouldSimulateError();

    if (errorScenario) {
      // Brief delay to simulate network attempt
      await new Promise(resolve => setTimeout(resolve, 500));

      // Set file errors
      setFileErrors(prev => {
        const newFileErrors = [...prev];
        newFileErrors[index] = errorScenario.message;
        return newFileErrors;
      });

      // For password errors
      if (errorScenario.type === 'password') {
        setPasswordErrors(prev => {
          const newPasswordErrors = [...prev];
          newPasswordErrors[index] = errorScenario.message;
          return newPasswordErrors;
        });
      }

      console.error(
        `Mock upload error (${errorScenario.type}):`,
        errorScenario.message,
      );

      // Return null to indicate error - caller will handle file object creation
      return null;
    }

    // Simulate upload progress using component's percentUploaded prop
    setPercentsUploaded(prev => {
      const newPercents = [...prev];
      newPercents[index] = 0;
      return newPercents;
    });

    // Simulate progress updates using recursive setTimeout
    const updateProgress = () => {
      return new Promise(resolve => {
        let currentProgress = 0;

        const incrementProgress = () => {
          setPercentsUploaded(prev => {
            const newPercents = [...prev];
            newPercents[index] = currentProgress;
            return newPercents;
          });

          currentProgress += 20;

          if (currentProgress <= 100) {
            setTimeout(incrementProgress, 100);
          } else {
            resolve(); // Resolve promise when progress is complete
          }
        };

        incrementProgress();
      });
    };
    await updateProgress();

    // Clear progress after completion so component shows uploaded file
    setPercentsUploaded(prev => {
      const newPercents = [...prev];
      newPercents[index] = null; // Clear progress to show uploaded state
      return newPercents;
    });

    // Simulate successful upload
    // eslint-disable-next-line consistent-return
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploaded',
      encrypted: false,
      confirmationCode: `CONF-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}`,
      uploadDate: new Date().toISOString(),
      _originalFile: file,
    };
  };

  // Handle file processing
  const handleFileAdded = async (fileDetails, index) => {
    const { file } = fileDetails;

    // Basic file validation
    if (!file || !file.name) {
      return;
    }

    try {
      // Check if file is encrypted using platform utility
      const fileChecks = await standardFileChecks(file);
      const isEncrypted = fileChecks.checkIsEncryptedPdf;

      // Update encrypted state
      setEncrypted(prev => {
        const newEncrypted = [...prev];
        newEncrypted[index] = isEncrypted;
        return newEncrypted;
      });

      // Clear any previous password errors for this file position
      setPasswordErrors(prev => {
        const newPasswordErrors = [...prev];
        newPasswordErrors[index] = null;
        return newPasswordErrors;
      });

      // Clear va-select error when file is replaced
      setTimeout(() => {
        const fileInputs = componentRef.current?.shadowRoot?.querySelectorAll(
          'va-file-input',
        );
        if (fileInputs && fileInputs[index]) {
          const slotContent = fileInputs[index].querySelector(
            '.additional-input-container va-select',
          );
          if (slotContent) {
            slotContent.removeAttribute('error');
          }
        }
      }, 0);

      if (isEncrypted) {
        // For encrypted files, don't upload immediately - wait for password
        // Set file status to pending password
        setFiles(prevFiles => {
          const newFiles = [...prevFiles];
          const existingAdditionalData = newFiles[index]?.additionalData || {};
          newFiles[index] = {
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'pending_password',
            encrypted: true,
            _originalFile: file,
            additionalData: existingAdditionalData,
          };
          return newFiles;
        });
      } else {
        // Non-encrypted files - upload immediately
        const processedFile = await mockFileUpload(file, index);

        // Always set a file object to maintain array consistency
        setFiles(prevFiles => {
          const newFiles = [...prevFiles];
          const existingAdditionalData = newFiles[index]?.additionalData || {};
          newFiles[index] = processedFile
            ? {
                ...processedFile,
                additionalData: existingAdditionalData,
              }
            : {
                name: file.name,
                size: file.size,
                type: file.type,
                status: 'error',
                encrypted: false,
                _originalFile: file,
                additionalData: existingAdditionalData,
              };
          return newFiles;
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Handle encrypted file upload with password
  const handleEncryptedFileUpload = useCallback(
    async (fileDetails, password, index) => {
      try {
        const processedFile = await mockFileUpload(
          fileDetails.file,
          index,
          password,
        );

        // Always set a file object to maintain array consistency
        setFiles(prevFiles => {
          const newFiles = [...prevFiles];
          const existingAdditionalData = newFiles[index]?.additionalData || {};
          newFiles[index] = processedFile
            ? {
                ...processedFile,
                additionalData: existingAdditionalData,
              }
            : {
                name: fileDetails.file.name,
                size: fileDetails.file.size,
                type: fileDetails.file.type,
                status: 'error',
                encrypted: true,
                _originalFile: fileDetails.file,
                additionalData: existingAdditionalData,
              };
          return newFiles;
        });
      } catch (error) {
        setPasswordErrors(prev => {
          const newPasswordErrors = [...prev];
          newPasswordErrors[index] = error.message;
          return newPasswordErrors;
        });
      }
    },
    [],
  );

  // Debounced password processing because the text input event is triggered on every keypress
  const debouncePassword = useMemo(
    () =>
      debounce(({ file, password }, index) => {
        if (password && password.length > 0) {
          // Clear password error
          setPasswordErrors(prev => {
            const newPasswordErrors = [...prev];
            newPasswordErrors[index] = null;
            return newPasswordErrors;
          });

          // Clear file-level error
          setFileErrors(prev => {
            const newFileErrors = [...prev];
            newFileErrors[index] = null;
            return newFileErrors;
          });

          // Process encrypted file with password
          handleEncryptedFileUpload({ file }, password, index);

          // Hide password field after successful entry
          setEncrypted(prev => {
            const newEncrypted = [...prev];
            newEncrypted[index] = null;
            return newEncrypted;
          });
        } else {
          console.warn('Empty password provided');
        }
      }, DEBOUNCE_WAIT),
    [handleEncryptedFileUpload],
  );

  // Debounced text input processing to prevent focus loss on every keystroke
  const debounceTextInput = useMemo(
    () =>
      debounce((value, index, fieldName) => {
        setFiles(prevFiles => {
          const newFiles = [...prevFiles];
          if (newFiles[index]) {
            newFiles[index] = {
              ...newFiles[index],
              additionalData: {
                ...newFiles[index].additionalData,
                [fieldName]: value,
              },
            };
          }
          return newFiles;
        });
      }, DEBOUNCE_WAIT),
    [],
  );

  // Handle file removal
  const handleFileRemoved = removedFile => {
    // Add null/undefined checks
    if (!removedFile || !removedFile.name) {
      console.warn('handleFileRemoved: Invalid file object', removedFile);
      return;
    }

    // Use functional updates to avoid stale closure issues
    setFiles(prevFiles => {
      // Find the specific index to remove (first match)
      const indexToRemove = prevFiles.findIndex(
        file =>
          file &&
          file.name &&
          file.name === removedFile.name &&
          file.size === removedFile.size,
      );

      if (indexToRemove === -1) {
        console.warn('File to remove not found in array');
        return prevFiles;
      }

      // Remove only the specific file at that index
      const newFiles = [...prevFiles];
      newFiles.splice(indexToRemove, 1);

      // Use the same index for all state arrays to maintain consistency
      const fileIndex = indexToRemove;

      // Remove corresponding entries from all state arrays
      setPercentsUploaded(prev => {
        const newPercents = [...prev];
        newPercents.splice(fileIndex, 1);
        return newPercents;
      });

      // Clear encrypted state
      setEncrypted(prev => {
        const newEncrypted = [...prev];
        newEncrypted.splice(fileIndex, 1);
        return newEncrypted;
      });

      // Clear password errors
      setPasswordErrors(prev => {
        const newPasswordErrors = [...prev];
        newPasswordErrors.splice(fileIndex, 1);
        return newPasswordErrors;
      });

      // Clear file-level errors
      setFileErrors(prev => {
        const newFileErrors = [...prev];
        newFileErrors.splice(fileIndex, 1);
        return newFileErrors;
      });

      // Clear additional input errors
      setAdditionalInputErrors(prev => {
        const newAdditionalInputErrors = [...prev];
        newAdditionalInputErrors.splice(fileIndex, 1);
        return newAdditionalInputErrors;
      });

      return newFiles;
    });
  };

  // Handle component-level errors like file size limits.
  const handleComponentError = event => {
    const { detail } = event;
    const { error } = detail;
    // For now, just log component errors - could be extended to integrate
    // with other error handling.
    console.error('Component error:', error);
  };

  // Get all va-file-input elements from shadow DOM
  const getFileInputElements = () => {
    if (!componentRef.current?.shadowRoot) return [];
    return Array.from(
      componentRef.current.shadowRoot.querySelectorAll('va-file-input'),
    );
  };

  // Get the va-file-input instances
  function getFileInputInstanceIndex(e) {
    const [vaFileInput] = e
      .composedPath()
      .filter(el => el.tagName === 'VA-FILE-INPUT');

    const els = getFileInputElements();
    return els.findIndex(el => el.id === vaFileInput.id);
  }

  // Update additional input error in shadow DOM
  const updateAdditionalInputError = (fileIndex, errorMessage) => {
    const fileInputs = getFileInputElements();
    if (fileInputs.length === 0) return;

    if (fileInputs[fileIndex]) {
      // Find the VaSelect within this file input's slot content
      const slotContent = fileInputs[fileIndex].querySelector(
        '.additional-input-container va-select',
      );

      if (slotContent) {
        // Set the error attribute on the VaSelect component
        if (errorMessage) {
          slotContent.setAttribute('error', errorMessage);
        } else {
          slotContent.removeAttribute('error');
        }
      }
    }
  };

  const handleSlotInput = event => {
    const { detail } = event;
    const { value } = detail;

    // Get the file index
    const fileIndex = getFileInputInstanceIndex(event);

    // Get the field name from the event target - try multiple approaches
    let fieldName = event.target.name;

    // If name is not available on target, try getting it from the composed path
    if (!fieldName) {
      const vaTextInput = event
        .composedPath()
        .find(el => el.tagName === 'VA-TEXT-INPUT');
      fieldName = vaTextInput?.name;
    }

    if (fileIndex >= 0 && files[fileIndex] && fieldName) {
      // Use debounced update to prevent focus loss
      debounceTextInput(value, fileIndex, fieldName);
    } else {
      console.warn(
        `Could not find file at index ${fileIndex} or field name ${fieldName}`,
      );
    }
  };

  // Handle additional input (document status selection)
  const handleSlotSelect = event => {
    const { detail } = event;
    const { value } = detail;

    // Get the file index
    const fileIndex = getFileInputInstanceIndex(event);

    if (fileIndex >= 0 && files[fileIndex]) {
      // Check if user selected the default "Select status" option (empty value)
      if (value === '') {
        // Show validation error for empty selection
        const errorMessage = 'Please select a document status';

        setAdditionalInputErrors(prev => {
          const newErrors = [...prev];
          newErrors[fileIndex] = errorMessage;
          return newErrors;
        });

        // Update the VaSelect error prop in shadow DOM
        updateAdditionalInputError(fileIndex, errorMessage);

        // Don't update the file data for invalid selection
        return;
      }

      // Valid selection - update file data
      setFiles(prevFiles => {
        const newFiles = [...prevFiles];
        newFiles[fileIndex] = {
          ...newFiles[fileIndex],
          additionalData: {
            ...newFiles[fileIndex].additionalData,
            documentStatus: value,
          },
        };
        return newFiles;
      });

      // Clear any additional input error when user provides valid input
      setAdditionalInputErrors(prev => {
        const newErrors = [...prev];
        newErrors[fileIndex] = null;
        return newErrors;
      });

      // Clear the error in the shadow DOM
      updateAdditionalInputError(fileIndex, null);
    } else {
      console.warn(`Could not find file at index ${fileIndex}`);
    }
  };

  // Handle multiple file change events
  const handleMultipleChange = event => {
    const { detail } = event;
    const { action, state, file } = detail;

    switch (action) {
      case 'FILE_ADDED': {
        const index = state.length - 1;
        const fileDetails = state[index];
        handleFileAdded(fileDetails, index);
        break;
      }
      case 'FILE_UPDATED': {
        // Find the file that was updated by looking for changed: true
        let updatedIndex = state.findIndex(
          fileDetails => fileDetails.changed === true,
        );

        // Fallback method if we can't determine the position
        if (updatedIndex === -1) {
          updatedIndex = state.findIndex(
            f => f.file.name === file.name && f.file.size === file.size,
          );
        }

        if (updatedIndex !== -1) {
          const fileDetails = state[updatedIndex];
          handleFileAdded(fileDetails, updatedIndex);
        }
        break;
      }
      case 'PASSWORD_UPDATE': {
        // Find the file that was updated by looking for changed: true
        let updatedIndex = state.findIndex(
          fileDetails => fileDetails.changed === true,
        );

        // Fallback method if we can't determine the position
        if (updatedIndex === -1) {
          updatedIndex = state.findIndex(
            f => f.file.name === file.name && f.file.size === file.size,
          );
        }

        if (updatedIndex !== -1) {
          const fileDetails = state[updatedIndex];
          debouncePassword(fileDetails, updatedIndex);
        }
        break;
      }
      case 'FILE_REMOVED': {
        handleFileRemoved(file);
        break;
      }
      default:
        console.warn(`Unhandled action: ${action}`);
        break;
    }
  };

  return (
    <div className="vads-grid-container">
      <div className="vads-grid-row">
        <div className="vads-grid-col-12 desktop:vads-grid-col-6">
          <VaFileInputMultiple
            ref={componentRef}
            accept=".pdf,.jpeg,.png"
            percentUploaded={percentsUploaded}
            encrypted={encrypted}
            errors={fileErrors}
            passwordErrors={passwordErrors}
            resetVisualState={fileErrors.map(error => (error ? true : null))}
            onVaMultipleChange={handleMultipleChange}
            onVaFileInputError={handleComponentError}
            onVaSelect={handleSlotSelect}
            onVaInput={handleSlotInput}
            hint="Upload PDF, JPEG, or PNG files. Encrypted PDFs will require a password."
            label="Select files to upload"
          >
            <div className="additional-input-container">
              <VaSelect required label="Document status">
                <option value="">Select status</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </VaSelect>
              <VaTextInput label="Document name" name="documentName" />
              <VaTextInput
                label="Document description"
                name="documentDescription"
              />
            </div>
          </VaFileInputMultiple>
        </div>
        <div className="vads-grid-col-12 desktop:vads-grid-col-6 vads-u-padding-left--3">
          {/* Expose files state for testing */}
          <span
            data-testid="files-state"
            aria-hidden="true"
            style={{ display: 'none' }}
          >
            {JSON.stringify(files)}
          </span>

          <div>
            <h3>Files State Preview</h3>
            <pre
              className="vads-u-background-color--gray-lightest vads-u-padding--1p5 vads-u-border-radius--md vads-u-font-family--mono"
              style={{
                overflow: 'auto',
                maxHeight: '1000px',
                fontSize: '12px',
              }}
            >
              {files.length > 0 && JSON.stringify(files, null, 2)}
            </pre>
          </div>
        </div>
      </div>
      <div className="vads-grid-row vads-u-margin-top--2">
        <va-additional-info trigger="Mock error scenarios">
          <div className="vads-u-margin-top--2 vads-u-padding--1p5 vads-u-background-color--primary-alt-lightest vads-u-border-radius--md vads-u-font-size--sm">
            <h3>Error Testing & Visual State Reset:</h3>
            <ul className="vads-u-margin-y--1 vads-u-padding-left--2p5">
              <li>
                <strong>Network Error:</strong> Upload file with 'error' in
                filename
                <br />
                <em>→ Watch progress bar reset when error occurs</em>
              </li>
              <li>
                <strong>Server Error:</strong> Upload file with 'server' in
                filename
                <br />
                <em>→ Visual state clears on error for clean retry</em>
              </li>
              <li>
                <strong>Rate Limit:</strong> Upload file with 'limit' in
                filename
                <br />
                <em>→ Component resets to initial appearance</em>
              </li>
              <li>
                <strong>File Size:</strong> Upload file larger than 1MB
                <br />
                <em>→ resetVisualState triggers immediately</em>
              </li>
              <li>
                <strong>Password Error:</strong> Use password shorter than 8
                characters
                <br />
                <em>→ Password field visual state resets</em>
              </li>
              <li>
                <strong>Additional Input Error:</strong> Upload any file, then
                try to select 'Select status' option
                <br />
                <em>
                  → Document status field shows validation error (no visual
                  state reset)
                </em>
              </li>
            </ul>
            <p className="vads-u-margin-top--1 vads-u-margin-bottom--0 vads-u-font-size--xs vads-u-font-style--italic">
              <strong>resetVisualState</strong> automatically triggers when
              errors occur, providing visual feedback for error recovery.
            </p>
            <p className="vads-u-margin-top--1 vads-u-margin-bottom--0 vads-u-font-size--xs vads-u-color--primary">
              <strong>Additional Input:</strong> Each uploaded file requires a
              document status selection. Selecting 'Select status' shows a
              validation error. Valid selections are stored in{' '}
              <code>file.additionalData.documentStatus</code>.
            </p>
          </div>
        </va-additional-info>
      </div>
    </div>
  );
}
