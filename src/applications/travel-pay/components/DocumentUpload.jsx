import React, { useState } from 'react';
// import PropTypes from 'prop-types';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import {
  VaProgressBar,
  VaFileInputMultiple,
  VaAlert,
  // VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const DocumentUpload = () => {
  const [progress, setProgress] = useState(0);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const acceptedFileTypes = [
    'pdf',
    'jpeg',
    'jpg',
    'png',
    'gif',
    'bmp',
    'tif',
    'tiff',
    'doc',
    'docx',
  ];

  function deleteDocument(documentId, fileName) {
    const deleteUrl = `${
      environment.API_URL
    }/travel_pay/v0/claims/12345/documents/${documentId}`;

    const performDelete = async () => {
      try {
        setUploadInProgress(true);
        setProgress(0);
        setUploadError(''); // Clear any previous errors

        // Simulate progress for delete operation
        setProgress(50);

        await apiRequest(deleteUrl, {
          method: 'DELETE',
        });

        setProgress(100);

        // Remove the file from the uploaded files list
        setUploadedFiles(prev =>
          prev.filter(file => file.documentId !== documentId),
        );

        // eslint-disable-next-line no-console
        console.log('File deleted:', fileName);

        setUploadInProgress(false);
        setProgress(0);
      } catch (error) {
        let errorMessage = 'Delete failed. Please try again.';

        if (error.errors && error.errors[0]?.detail) {
          errorMessage = error.errors[0].detail;
        } else if (error.message) {
          errorMessage = error.message;
        }

        setUploadError(errorMessage);
        setUploadInProgress(false);
        setProgress(0);
      }
    };

    performDelete();
  }

  function handleChange(e) {
    setUploadError(''); // Clear any previous errors
    // eslint-disable-next-line no-console
    console.log('e --- ', e);
    // eslint-disable-next-line no-console
    console.log('e.detail --- ', e.detail);

    const { action, file, state } = e.detail || {};
    // eslint-disable-next-line no-console
    console.log('action --- ', action);
    // eslint-disable-next-line no-console
    console.log('file --- ', file);
    // eslint-disable-next-line no-console
    console.log('state --- ', state);

    // Handle file removal
    if (action === 'FILE_REMOVED' && file) {
      // Find the uploaded file that matches this file
      const uploadedFile = uploadedFiles.find(
        uploadedFileItem =>
          uploadedFileItem.name === file.name &&
          uploadedFileItem.size === file.size,
      );

      if (uploadedFile) {
        deleteDocument(uploadedFile.documentId, uploadedFile.name);
      }
      return;
    }

    // Handle file addition or update
    if ((action !== 'FILE_ADDED' && action !== 'FILE_UPDATED') || !file) {
      // eslint-disable-next-line no-console
      console.error('No file found or action is not FILE_ADDED/FILE_UPDATED');
      return;
    }

    setUploadInProgress(true);

    // For FILE_UPDATED action, we need to find the file that was replaced
    // The 'state' array contains the current files in the input component
    let existingFile = null;

    if (action === 'FILE_UPDATED') {
      // When a file is updated, we need to find which uploaded file should be replaced
      // We'll look for an uploaded file that's no longer in the current state
      const currentFileNames = state.map(stateFile => stateFile.name);
      existingFile = uploadedFiles.find(
        uploadedFileItem => !currentFileNames.includes(uploadedFileItem.name),
      );

      // eslint-disable-next-line no-console
      console.log('FILE_UPDATED - existing file to replace:', existingFile);
    } else {
      // For FILE_ADDED, check if a file with the same name already exists
      existingFile = uploadedFiles.find(
        uploadedFileItem => uploadedFileItem.name === file.name,
      );
    }

    // Custom upload functionality that doesn't depend on forms-system Redux
    const fileUploadUrl = `${
      environment.API_URL
    }/travel_pay/v0/claims/12345/documents/form-data`; // Using mock claim ID

    // Validate file type
    const isValidFileType = acceptedFileTypes.some(fileType =>
      file.name.toLowerCase().endsWith(`.${fileType.toLowerCase()}`),
    );

    if (!isValidFileType) {
      const allowedTypes = acceptedFileTypes.reduce(
        (accumulator, fileType, index, array) => {
          if (index === 0) return `.${fileType}`;
          const separator = index < array.length - 1 ? ',' : ', or';
          return `${accumulator}${separator} .${fileType}`;
        },
        '',
      );

      const fileTypeErrorMessage = `We couldn't upload your file because we can't accept this type of file. Please make sure the file is a ${allowedTypes} file and try again.`;

      setUploadError(fileTypeErrorMessage);
      setUploadInProgress(false);
      return;
    }

    // Validate file size
    const maxSize = 5000000; // 5MB
    if (file.size > maxSize) {
      const fileSizeText = `${Math.round(maxSize / 1024 / 1024)}MB`;
      const fileTooBigErrorMessage = `We couldn't upload your file because it's too large. File size must be less than ${fileSizeText}.`;

      setUploadError(fileTooBigErrorMessage);
      setUploadInProgress(false);
      return;
    }

    // Create FormData payload
    const formData = new FormData();
    formData.append('file', file);

    // Upload using apiRequest
    const performUpload = async () => {
      try {
        setProgress(0);

        // If replacing an existing file, delete it first
        if (existingFile) {
          // eslint-disable-next-line no-console
          console.log('Replacing existing file:', existingFile.name);
          setProgress(25);

          const deleteUrl = `${
            environment.API_URL
          }/travel_pay/v0/claims/12345/documents/${existingFile.documentId}`;

          await apiRequest(deleteUrl, {
            method: 'DELETE',
          });

          // Remove the existing file from the uploaded files list
          setUploadedFiles(prev =>
            prev.filter(
              uploadedFileItem =>
                uploadedFileItem.documentId !== existingFile.documentId,
            ),
          );

          setProgress(50);
        } else {
          setProgress(25);
        }

        const response = await apiRequest(fileUploadUrl, {
          method: 'POST',
          body: formData,
        });

        setProgress(75);

        // Parse successful response
        const uploadedFile = {
          name: file.name,
          size: file.size,
          documentId: response.data?.documentId || 'unknown',
          confirmationCode: response.data?.documentId || 'unknown',
          guid: response.data?.documentId || 'unknown',
          uploading: false,
          uploadedAt: response.data?.uploadedAt || new Date().toISOString(),
        };

        // Add to uploaded files list
        setUploadedFiles(prev => [...prev, uploadedFile]);

        // eslint-disable-next-line no-console
        console.log('File uploaded:', uploadedFile);
        setUploadError(''); // Clear error on success
        setProgress(100);

        // Brief delay to show completion before clearing
        setTimeout(() => {
          setUploadInProgress(false);
          setProgress(0);
        }, 500);
      } catch (error) {
        let errorMessage = 'Upload failed. Please try again.';

        if (error.errors && error.errors[0]?.detail) {
          errorMessage = error.errors[0].detail;
        } else if (error.message) {
          errorMessage = error.message;
        }

        setUploadError(errorMessage);
        setUploadInProgress(false);
        setProgress(0);
      }
    };

    // Start the upload
    performUpload();
  }

  return (
    <>
      {uploadError && (
        <VaAlert status="error" class="vads-u-margin-top--2">
          <h2 slot="headline">File upload error</h2>
          <p>{uploadError}</p>
        </VaAlert>
      )}

      {/* Display uploaded files */}
      {/* uploadedFiles.length > 0 && (
        <div className="vads-u-margin-bottom--3">
          <h3>Uploaded documents</h3>
          {uploadedFiles.map(file => (
            <div
              key={file.documentId}
              className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--1 vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center"
            >
              <div>
                <strong>{file.name}</strong>
                <div className="vads-u-color--gray-medium">
                  {Math.round(file.size / 1024)} KB • Uploaded on{' '}
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </div>
              </div>
              <VaButton
                secondary
                onClick={() => deleteDocument(file.documentId, file.name)}
                text="Delete"
                aria-label={`Delete ${file.name}`}
              />
            </div>
          ))}
        </div>
      ) */}

      <VaFileInputMultiple
        accept={acceptedFileTypes.map(type => `.${type}`).join(',')}
        multiple="multiple"
        // error={getErrorMessage(firstInputID)}
        hint={`Accepted file types: ${acceptedFileTypes
          .map(type => type.toUpperCase())
          .join(', ')}`}
        // label={label}
        maxFileSize={5000000}
        minFileSize={0}
        name="travel-pay-claim-document-upload"
        onVaMultipleChange={handleChange}
      />
      {uploadInProgress ? (
        <VaProgressBar percent={progress} label="Processing..." />
      ) : (
        <></>
      )}
    </>
  );
};

export default DocumentUpload;
