import React from 'react';
import PropTypes from 'prop-types';

import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { ACCEPTED_FILE_TYPES } from '../../../constants';

const DocumentUpload = ({ handleDocumentUpload }) => {
  return (
    <>
      <VaFileInput
        accept={ACCEPTED_FILE_TYPES.map(type => `${type}`).join(',')}
        hint={`Accepted file types: ${ACCEPTED_FILE_TYPES.map(
          ext => `${ext}`,
        ).join(', ')} (up to 5 MB)`}
        label="Upload a document for your expense"
        maxFileSize={5200000} // Based on platform cals have to use 5200000 to get 5MB
        minFileSize={0}
        name="travel-pay-claim-document-upload"
        onVaChange={handleDocumentUpload}
        required
      />
      <va-additional-info trigger="How to upload files">
        <ul>
          <li>
            Use a {ACCEPTED_FILE_TYPES.map(type => `${type}`).join(', ')} file
            format
          </li>
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
  handleDocumentUpload: PropTypes.func,
};

export default DocumentUpload;
