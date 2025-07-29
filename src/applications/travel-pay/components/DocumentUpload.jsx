import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// import PropTypes from 'prop-types';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import {
  VaProgressBar,
  VaFileInputMultiple,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { uploadScannedForm as uploadFile } from 'platform/forms-system/src/js/web-component-fields/vaFileInputFieldHelpers';

const DocumentUpload = () => {
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const [uploadInProgress, setUploadInProgress] = useState(false);

  function updateProgress(percent) {
    setUploadInProgress(true);
    setProgress(percent);
  }

  function handleChange(e) {
    setUploadInProgress(true);
    console.log('e --- ', e);

    // Mock API call that waits for 2 seconds
    const mockUpload = async () => {
      // Simulate progress updates
      updateProgress(25);
      await new Promise(resolve => setTimeout(resolve, 200));
      updateProgress(50);
      await new Promise(resolve => setTimeout(resolve, 200));
      updateProgress(75);
      await new Promise(resolve => setTimeout(resolve, 200));
      updateProgress(100);
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadInProgress(false);
    };

    mockUpload();
  }

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

  return (
    <>
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
        <VaProgressBar percent={progress} label="Uploading file" />
      ) : (
        <></>
      )}
    </>
  );
};

export default DocumentUpload;
