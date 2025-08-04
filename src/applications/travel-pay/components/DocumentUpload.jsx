import React, { useState } from 'react';
// import PropTypes from 'prop-types';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import {
  VaProgressBar,
  VaFileInput,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const DocumentUpload = () => {
  const [progress, setProgress] = useState(0);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null); // Track the single uploaded file

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

  function handleChange(e) {
    setUploadError(''); // Clear any previous errors
    // eslint-disable-next-line no-console
    console.log('e --- ', e);
    // eslint-disable-next-line no-console
    console.log('e.detail --- ', e.detail);
    // eslint-disable-next-line no-console
    console.log('e.target --- ', e.target);
    // eslint-disable-next-line no-console
    console.log('e.target.files --- ', e.target.files);

    // Try both e.detail.files and e.target.files
    const files = e.detail?.files || e.target?.files;
    // eslint-disable-next-line no-console
    console.log('files --- ', files);

    // Check if files were removed (empty FileList but we have an uploaded file)
    if ((!files || files.length === 0) && uploadedFile) {
      // eslint-disable-next-line no-console
      console.log('File removed from input, triggering delete API call');

      // Perform delete operation
      const performDelete = async () => {
        try {
          setUploadInProgress(true);
          setProgress(0);
          setUploadError(''); // Clear any previous errors

          setProgress(50);

          const deleteUrl = `${
            environment.API_URL
          }/travel_pay/v0/claims/12345/documents/${uploadedFile.documentId}`;

          await apiRequest(deleteUrl, {
            method: 'DELETE',
          });

          setProgress(100);

          // Clear the uploaded file state
          setUploadedFile(null);

          // eslint-disable-next-line no-console
          console.log('File deleted:', uploadedFile.name);

          setTimeout(() => {
            setUploadInProgress(false);
            setProgress(0);
          }, 500);
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
      return;
    }

    // Check if we have files for upload
    if (!files || files.length === 0) {
      // eslint-disable-next-line no-console
      console.error('No files found');
      return;
    }

    const file = files[0]; // Get the first (and only) file
    // eslint-disable-next-line no-console
    console.log('file --- ', file);

    setUploadInProgress(true);

    // Custom upload functionality that doesn't depend on forms-system Redux
    const fileUploadUrl = `${
      environment.API_URL
    }/travel_pay/v0/claims/12345/documents/form-data`; // Using mock claim ID

    // Check if we're replacing an existing file
    const isReplacement = uploadedFile !== null;

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
        if (isReplacement) {
          // eslint-disable-next-line no-console
          console.log('Replacing existing file:', uploadedFile.name);
          setProgress(25);

          const deleteUrl = `${
            environment.API_URL
          }/travel_pay/v0/claims/12345/documents/${uploadedFile.documentId}`;

          await apiRequest(deleteUrl, {
            method: 'DELETE',
          });

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
        const newUploadedFile = {
          name: file.name,
          size: file.size,
          documentId: response.data?.documentId || 'unknown',
          confirmationCode: response.data?.documentId || 'unknown',
          guid: response.data?.documentId || 'unknown',
          uploading: false,
          uploadedAt: response.data?.uploadedAt || new Date().toISOString(),
        };

        // Update the uploaded file state
        setUploadedFile(newUploadedFile);

        // eslint-disable-next-line no-console
        console.log('File uploaded:', newUploadedFile);
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

      <VaFileInput
        accept={acceptedFileTypes.map(type => `.${type}`).join(',')}
        hint={`Accepted file types: ${acceptedFileTypes
          .map(type => type.toUpperCase())
          .join(', ')}`}
        label="Upload a document for your expense"
        maxFileSize={5000000}
        minFileSize={0}
        name="travel-pay-claim-document-upload"
        onVaChange={handleChange}
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
