/* eslint-disable no-console */
import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  VaFileInputMultiple,
  VaSelect,
} from '@department-of-veterans-affairs/web-components/react-bindings';
import { standardFileChecks } from 'platform/forms-system/src/js/utilities/file';
import { debounce } from 'lodash';

// Debounce wait time (same as forms library)
const DEBOUNCE_WAIT = 1000;

export default function VaFileInputMultiplePage() {
  const componentRef = useRef(null);

  const [files, setFiles] = useState([]); // This could be Redux in a real app
  const [percentsUploaded, setPercentsUploaded] = useState([]); // Progress array for component
  const [encrypted, setEncrypted] = useState([]); // Track which files are encrypted

  // Error Management Strategy (following forms library pattern)
  const [fileErrors, setFileErrors] = useState([]); // File-level errors (upload, validation)
  const [passwordErrors, setPasswordErrors] = useState([]); // Password validation errors

  // Enhanced mock upload with error scenarios (like forms library)
  const mockFileUpload = async (file, index, password = null) => {
    // Clear any previous errors
    setFileErrors(prev => {
      const newFileErrors = [...prev];
      newFileErrors[index] = null;
      return newFileErrors;
    });

    // Mock error scenarios based on file characteristics
    const shouldSimulateError = () => {
      // Simulate network error for files with "error" in name
      if (file.name.toLowerCase().includes('error')) {
        return {
          type: 'network',
          message: 'Network request failed. Please try again.',
        };
      }

      // Simulate server error for files with "server" in name
      if (file.name.toLowerCase().includes('server')) {
        return {
          type: 'server',
          message: 'Server error occurred. Please try again later.',
        };
      }

      // Simulate file too large error for files > 1MB
      if (file.size > 1000000) {
        return { type: 'size', message: 'File size must be less than 25MB.' };
      }

      // Simulate rate limit error for files with "limit" in name
      if (file.name.toLowerCase().includes('limit')) {
        return {
          type: 'rate_limit',
          message:
            "You've reached the upload limit. Please try again in 5 minutes.",
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

    // If error scenario, simulate it
    if (errorScenario) {
      // Brief delay to simulate network attempt
      await new Promise(resolve => setTimeout(resolve, 500));

      // Set file error
      setFileErrors(prev => {
        const newFileErrors = [...prev];
        newFileErrors[index] = errorScenario.message;
        return newFileErrors;
      });

      // For password errors, also set password error
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

  // Handle file processing (similar to forms library handleFileAdded)
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

      // Clear any password errors for this file
      setPasswordErrors(prev => {
        const newPasswordErrors = [...prev];
        newPasswordErrors[index] = null;
        return newPasswordErrors;
      });

      if (isEncrypted) {
        // For encrypted files, don't upload immediately - wait for password
        // Set file status to pending password
        setFiles(prevFiles => {
          const newFiles = [...prevFiles];
          newFiles[index] = {
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'pending_password',
            encrypted: true,
            _originalFile: file,
          };
          return newFiles;
        });
      } else {
        // Non-encrypted files - upload immediately
        const processedFile = await mockFileUpload(file, index);

        // Always set a file object to maintain array consistency
        setFiles(prevFiles => {
          const newFiles = [...prevFiles];
          newFiles[index] = processedFile || {
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'error',
            encrypted: false,
            _originalFile: file,
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
          newFiles[index] = processedFile || {
            name: fileDetails.file.name,
            size: fileDetails.file.size,
            type: fileDetails.file.type,
            status: 'error',
            encrypted: true,
            _originalFile: fileDetails.file,
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

  // Debounced password processing (like forms library)
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

          // Hide password field after successful entry (like forms library)
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

      return newFiles;
    });
  };

  // Handle component-level errors (following forms library pattern)
  const handleComponentError = event => {
    const { detail } = event;
    const { error } = detail;
    // For now, just log component errors - could be extended to show in UI
    console.error('Component error:', error);
  };

  // Get the va-file-input instances (matching forms library pattern)
  function getFileInputInstanceIndex(e) {
    const [vaFileInput] = e
      .composedPath()
      .filter(el => el.tagName === 'VA-FILE-INPUT');

    let els = [];
    if (componentRef.current?.shadowRoot) {
      els = Array.from(
        componentRef.current.shadowRoot.querySelectorAll('va-file-input'),
      );
    }
    return els.findIndex(el => el.id === vaFileInput.id);
  }

  // Handle additional input (document status selection)
  const handleAdditionalInput = event => {
    const { detail } = event;
    const { value } = detail;

    if (value === '') return;

    // Use the forms library approach to get the correct file index
    const fileIndex = getFileInputInstanceIndex(event);

    if (fileIndex >= 0 && files[fileIndex]) {
      setFiles(prevFiles => {
        const newFiles = [...prevFiles];
        newFiles[fileIndex] = {
          ...newFiles[fileIndex],
          additionalData: {
            documentStatus: value,
          },
        };
        return newFiles;
      });
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
        // For FILE_UPDATED, we need to find which position was actually updated
        // The issue: findIndex by name/size finds the FIRST match, not the updated position
        // Better approach: Find the index by comparing the current state with our files array
        let updatedIndex = -1;

        // Compare state with our current files to find which position changed
        for (let i = 0; i < state.length; i++) {
          const stateFile = state[i]?.file;
          const ourFile = files[i];

          // If the file at this position is different from what we have, this is the updated index
          if (
            stateFile &&
            ourFile &&
            (stateFile.name !== ourFile.name ||
              stateFile.size !== ourFile.size ||
              stateFile.lastModified !== ourFile._originalFile?.lastModified)
          ) {
            updatedIndex = i;
            break;
          }
        }

        // Fallback to the original method if we can't determine the position
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
        // For password updates, we can still use the original method since it's less ambiguous
        const index = state.findIndex(
          f => f.file.name === file.name && f.file.size === file.size,
        );
        if (index !== -1) {
          const fileDetails = state[index];
          debouncePassword(fileDetails, index);
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
            onVaSelect={handleAdditionalInput}
            hint="Upload PDF, JPEG, or PNG files. Encrypted PDFs will require a password."
            label="Select files to upload"
          >
            <div className="additional-input-container">
              <VaSelect required label="Document status">
                <option value="">Select status</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </VaSelect>
            </div>
          </VaFileInputMultiple>

          <hr />

          {/* Error Testing Instructions */}
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#f0f8ff',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            <strong>🧪 Error Testing & Visual State Reset:</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>
                <strong>Network Error:</strong> Upload file with "error" in
                filename
                <br />
                <em>→ Watch progress bar reset when error occurs</em>
              </li>
              <li>
                <strong>Server Error:</strong> Upload file with "server" in
                filename
                <br />
                <em>→ Visual state clears on error for clean retry</em>
              </li>
              <li>
                <strong>Rate Limit:</strong> Upload file with "limit" in
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
            </ul>
            <p
              style={{
                margin: '8px 0 0 0',
                fontSize: '12px',
                fontStyle: 'italic',
              }}
            >
              <strong>resetVisualState</strong> automatically triggers when
              errors occur, providing clean visual feedback for error recovery.
            </p>
            <p
              style={{
                margin: '8px 0 0 0',
                fontSize: '12px',
                color: '#0066cc',
              }}
            >
              <strong>📋 Additional Input:</strong> Each uploaded file requires
              a document status selection. The status is stored in{' '}
              <code>file.additionalData.documentStatus</code>.
            </p>
          </div>
        </div>

        <div className="vads-grid-col-12 desktop:vads-grid-col-6">
          {/* Expose files state for testing */}
          <span
            data-testid="files-state"
            aria-hidden="true"
            style={{ display: 'none' }}
          >
            {JSON.stringify(files)}
          </span>

          <div>
            <h2>Files Information</h2>
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                overflow: 'auto',
                maxHeight: '300px',
              }}
            >
              {files.length > 0 && JSON.stringify(files, null, 2)}
            </pre>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
              Processed files: {files.length} | Progress tracking:{' '}
              {percentsUploaded.filter(p => p !== null).length} active | File
              errors: {fileErrors.filter(e => e !== null).length} | Encrypted
              files: {encrypted.filter(e => e === true).length} | Password
              errors: {passwordErrors.filter(e => e !== null).length}
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#888' }}>
              <strong>resetVisualState:</strong> [
              {fileErrors.map(error => (error ? 'true' : 'null')).join(', ')}]
              <em>(resets visual state when errors occur)</em>
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#888' }}>
              <strong>Array lengths:</strong> files: {files.length}, errors:{' '}
              {fileErrors.length}, progress: {percentsUploaded.length},
              encrypted: {encrypted.length}
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#888' }}>
              <strong>Files with additional data:</strong>{' '}
              {files.filter(f => f?.additionalData).length} / {files.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
