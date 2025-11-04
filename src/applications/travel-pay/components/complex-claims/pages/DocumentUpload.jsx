import React from 'react';
import PropTypes from 'prop-types';

import {
  VaFileInput,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { ACCEPTED_FILE_TYPES } from '../../../constants';

const DocumentUpload = ({ handleDocumentUpload, uploadError }) => {
  return (
    <>
      {uploadError && (
        <VaAlert status="error" class="vads-u-margin-top--2">
          <h2 slot="headline">File upload error</h2>
          <p>{uploadError}</p>
        </VaAlert>
      )}

      <VaFileInput
        accept={ACCEPTED_FILE_TYPES.map(type => `.${type}`).join(',')}
        hint={`Accepted file types: ${ACCEPTED_FILE_TYPES.join(', ')}`}
        label="Upload a document for your expense"
        maxFileSize={5000000}
        minFileSize={0}
        name="travel-pay-claim-document-upload"
        onVaChange={handleDocumentUpload}
      />
      <va-additional-info trigger="How to upload files">
        <ul>
          <li>Use a {ACCEPTED_FILE_TYPES.join(', ')} file format</li>
          <li>The size of your file must be no more than 5 MB</li>
          <li>
            If you only have a paper copy, scan or take a photo and upload the
            image
          </li>
        </ul>
      </va-additional-info>
    </>
  );
};

DocumentUpload.propTypes = {
  handleDocumentUpload: PropTypes.object,
  uploadError: PropTypes.string,
};

export default DocumentUpload;
