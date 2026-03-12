/* eslint-disable no-console */
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { VaFileInput } from '@department-of-veterans-affairs/web-components/react-bindings';
import { standardFileChecks } from 'platform/forms-system/src/js/utilities/file';
import { debounce } from 'lodash';

// Debounce wait time for password input
const DEBOUNCE_WAIT = 1000;

export default function VaFileInputPage() {
  const componentRef = useRef(null);

  const [file, setFile] = useState(null); // The uploaded file
  const [percentUploaded, setPercentUploaded] = useState(null); // Track upload progress
  const [encrypted, setEncrypted] = useState(false); // Track if file is encrypted and needs a password

  // Error Management
  const [fileError, setFileError] = useState(null); // File-level errors (upload, validation)
  const [passwordError, setPasswordError] = useState(null); // Password validation errors

  // Mock file upload with error scenarios
  const mockFileUpload = async (uploadFile, password = null) => {
    // Clear any previous errors
    setFileError(null);

    // Simulate various error scenarios based on filename
    const shouldSimulateError = () => {
      const fileName = uploadFile.name.toLowerCase();

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
      if (uploadFile.size > 1024 * 1024) {
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

      // Set file error
      setFileError(errorScenario.message);

      // For password errors
      if (errorScenario.type === 'password') {
        setPasswordError(errorScenario.message);
      }

      console.error(
        `Mock upload error (${errorScenario.type}):`,
        errorScenario.message,
      );

      return null;
    }

    // Simulate upload progress
    setPercentUploaded(0);

    // Simulate progress updates using recursive setTimeout
    const updateProgress = () => {
      return new Promise(resolve => {
        let currentProgress = 0;

        const incrementProgress = () => {
          setPercentUploaded(currentProgress);

          currentProgress += 20;

          if (currentProgress <= 100) {
            setTimeout(incrementProgress, 100);
          } else {
            resolve();
          }
        };

        incrementProgress();
      });
    };
    await updateProgress();

    // Clear progress after completion so component shows uploaded file
    setPercentUploaded(null);

    // Simulate successful upload
    // eslint-disable-next-line consistent-return
    return {
      name: uploadFile.name,
      size: uploadFile.size,
      type: uploadFile.type,
      status: 'uploaded',
      encrypted: false,
      confirmationCode: `CONF-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}`,
      uploadDate: new Date().toISOString(),
      _originalFile: uploadFile,
    };
  };

  // Handle file change event
  const handleChange = async event => {
    const { files } = event.detail;

    // File removed
    if (!files || files.length === 0) {
      setFile(null);
      setPercentUploaded(null);
      setEncrypted(false);
      setFileError(null);
      setPasswordError(null);
      return;
    }

    const selectedFile = files[0];

    // Basic file validation
    if (!selectedFile || !selectedFile.name) {
      return;
    }

    try {
      // Check if file is encrypted using platform utility
      const fileChecks = await standardFileChecks(selectedFile);
      const isEncrypted = fileChecks.checkIsEncryptedPdf;

      setEncrypted(isEncrypted);
      setPasswordError(null);

      if (isEncrypted) {
        // For encrypted files, don't upload immediately - wait for password
        setFile({
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          status: 'pending_password',
          encrypted: true,
          _originalFile: selectedFile,
        });
      } else {
        // Non-encrypted files - upload immediately
        const processedFile = await mockFileUpload(selectedFile);

        setFile(
          processedFile || {
            name: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type,
            status: 'error',
            encrypted: false,
            _originalFile: selectedFile,
          },
        );
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Handle encrypted file upload with password
  const handleEncryptedFileUpload = useCallback(
    async (originalFile, password) => {
      try {
        const processedFile = await mockFileUpload(originalFile, password);

        setFile(
          processedFile || {
            name: originalFile.name,
            size: originalFile.size,
            type: originalFile.type,
            status: 'error',
            encrypted: true,
            _originalFile: originalFile,
          },
        );
      } catch (error) {
        setPasswordError(error.message);
      }
    },
    [],
  );

  // Debounced password processing
  const debouncePassword = useMemo(
    () =>
      debounce((password, originalFile) => {
        if (password && password.length > 0) {
          setPasswordError(null);
          setFileError(null);

          handleEncryptedFileUpload(originalFile, password);

          setEncrypted(false);
        } else {
          console.warn('Empty password provided');
        }
      }, DEBOUNCE_WAIT),
    [handleEncryptedFileUpload],
  );

  // Handle password submit
  const handlePasswordSubmit = event => {
    const { password } = event.detail;
    if (file && file._originalFile) {
      debouncePassword(password, file._originalFile);
    }
  };

  // Handle component-level errors like file size limits
  const handleComponentError = event => {
    const { detail } = event;
    const { error } = detail;
    console.error('Component error:', error);
  };

  return (
    <div className="vads-grid-container">
      <div className="vads-grid-row">
        <div className="vads-grid-col-12 desktop:vads-grid-col-6">
          <VaFileInput
            ref={componentRef}
            accept=".pdf,.jpeg,.png"
            percentUploaded={percentUploaded}
            encrypted={encrypted}
            error={fileError}
            passwordError={passwordError}
            onVaChange={handleChange}
            onVaFileInputError={handleComponentError}
            onVaPasswordSubmit={handlePasswordSubmit}
            hint="Upload a PDF, JPEG, or PNG file. Encrypted PDFs will require a password."
            label="Select a file to upload"
          />
        </div>
        <div className="vads-grid-col-12 desktop:vads-grid-col-6 vads-u-padding-left--3">
          {/* Expose file state for testing */}
          <span
            data-testid="file-state"
            aria-hidden="true"
            style={{ display: 'none' }}
          >
            {JSON.stringify(file)}
          </span>

          <div>
            <h3>File State Preview</h3>
            <pre
              className="vads-u-background-color--gray-lightest vads-u-padding--1p5 vads-u-border-radius--md vads-u-font-family--mono"
              style={{
                overflow: 'auto',
                maxHeight: '1000px',
                fontSize: '12px',
              }}
            >
              {file && JSON.stringify(file, null, 2)}
            </pre>
          </div>
        </div>
      </div>
      <div className="vads-grid-row vads-u-margin-top--2">
        <va-additional-info trigger="Mock error scenarios">
          <div className="vads-u-margin-top--2 vads-u-padding--1p5 vads-u-background-color--primary-alt-lightest vads-u-border-radius--md vads-u-font-size--sm">
            <h3>Error Testing:</h3>
            <ul className="vads-u-margin-y--1 vads-u-padding-left--2p5">
              <li>
                <strong>Network Error:</strong> Upload file with 'error' in
                filename
              </li>
              <li>
                <strong>Server Error:</strong> Upload file with 'server' in
                filename
              </li>
              <li>
                <strong>Rate Limit:</strong> Upload file with 'limit' in
                filename
              </li>
              <li>
                <strong>File Size:</strong> Upload file larger than 1MB
              </li>
              <li>
                <strong>Password Error:</strong> Use password shorter than 8
                characters
              </li>
            </ul>
          </div>
        </va-additional-info>
      </div>
    </div>
  );
}
