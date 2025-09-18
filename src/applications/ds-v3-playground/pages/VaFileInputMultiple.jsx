/* eslint-disable no-console */
import React, { useState, useMemo, useCallback } from 'react';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/web-components/react-bindings';
import { standardFileChecks } from 'platform/forms-system/src/js/utilities/file';
import { debounce } from 'lodash';

// Debounce wait time (same as forms library)
const DEBOUNCE_WAIT = 1000;

export default function VaFileInputMultiplePage() {
  const [files, setFiles] = useState([]); // This could be Redux in a real app
  const [percentsUploaded, setPercentsUploaded] = useState([]); // Progress array for component
  const [encrypted, setEncrypted] = useState([]); // Track which files are encrypted

  // Error Management Strategy (following forms library pattern)
  const [fileErrors, setFileErrors] = useState([]); // File-level errors (upload, validation)
  const [passwordErrors, setPasswordErrors] = useState([]); // Password validation errors

  // Mock file upload - simulates the forms library upload process
  const mockFileUpload = async (file, index) => {
    // Clear any previous errors
    setFileErrors(prev => {
      const newFileErrors = [...prev];
      newFileErrors[index] = null;
      return newFileErrors;
    });

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

  // Mock encrypted file upload with password
  const mockEncryptedFileUpload = async (file, password, index) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate password validation (simple check for demo)
    const isValidPassword = password && password.length > 3;

    if (!isValidPassword) {
      console.warn('Invalid password provided');
      throw new Error('Invalid password provided');
    }

    // Clear any previous errors on successful upload
    setFileErrors(prev => {
      const newFileErrors = [...prev];
      newFileErrors[index] = null;
      return newFileErrors;
    });

    // Simulate successful upload
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploaded',
      encrypted: true,
      passwordProvided: true,
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
        setFiles(prevFiles => {
          const newFiles = [...prevFiles];
          newFiles[index] = processedFile;
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
        const processedFile = await mockEncryptedFileUpload(
          fileDetails.file,
          password,
          index,
        );
        setFiles(prevFiles => {
          const newFiles = [...prevFiles];
          newFiles[index] = processedFile;
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
  // Note: Defined after handleEncryptedFileUpload to avoid hoisting issues
  const debouncePassword = useMemo(
    () =>
      debounce(({ file, password }, index) => {
        if (password && password.length > 0) {
          console.log(`🔐 Processing password for ${file.name} after debounce`);

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
    setFiles(prevFiles =>
      prevFiles.filter(
        file =>
          !(file.name === removedFile.name && file.size === removedFile.size),
      ),
    );

    // Clear any associated errors and progress
    const fileIndex = files.findIndex(
      file => file.name === removedFile.name && file.size === removedFile.size,
    );

    if (fileIndex !== -1) {
      // Remove progress for this file
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
    }
  };

  // Handle component-level errors (following forms library pattern)
  const handleComponentError = event => {
    const { detail } = event;
    const { error } = detail;
    // For now, just log component errors - could be extended to show in UI
    console.error('Component error:', error);
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
        const index = state.findIndex(
          f => f.file.name === file.name && f.file.size === file.size,
        );
        if (index !== -1) {
          const fileDetails = state[index];
          handleFileAdded(fileDetails, index);
        }
        break;
      }
      case 'PASSWORD_UPDATE': {
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
    <div>
      <VaFileInputMultiple
        accept=".pdf,.jpeg,.png"
        percentUploaded={percentsUploaded}
        encrypted={encrypted}
        errors={fileErrors}
        passwordErrors={passwordErrors}
        onVaMultipleChange={handleMultipleChange}
        onVaFileInputError={handleComponentError}
        hint="Upload PDF, JPEG, or PNG files. Encrypted PDFs will require a password."
        label="Select files to upload"
      >
        {/* <div className="additional-input-container">
          <VaSelect required label="Document status">
            <option value="">Select status</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </VaSelect>
        </div> */}
      </VaFileInputMultiple>

      <hr />

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
          errors: {fileErrors.filter(e => e !== null).length} | Encrypted files:{' '}
          {encrypted.filter(e => e === true).length} | Password errors:{' '}
          {passwordErrors.filter(e => e !== null).length}
        </p>
      </div>
    </div>
  );
}
