import React from 'react';
import PropTypes from 'prop-types';

import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { ACCEPTED_FILE_TYPES } from '../../../constants';

const DocumentUpload = ({ currentDocument, handleDocumentUpload, loading }) => {
  return (
    <>
      {loading ? (
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the expense receipt for you."
          data-testid="travel-pay-document-loading-indicator"
        />
      ) : (
        <VaFileInput
          accept={ACCEPTED_FILE_TYPES.map(type => `${type}`).join(',')}
          hint={`You can upload a ${ACCEPTED_FILE_TYPES.join(', ').replace(
            /, ([^,]*)$/,
            ', or $1',
          )} file. Your file should be no larger than 5MB.`}
          label="Select a file to upload"
          maxFileSize={5200000} // Based on platform cals have to use 5200000 to get 5MB
          minFileSize={0}
          name="travel-pay-claim-document-upload"
          onVaChange={handleDocumentUpload}
          required
          value={currentDocument}
        />
      )}

      <va-additional-info trigger="How to upload paper copies">
        <p>
          If you only have a paper copy, scan or take a photo and upload the
          image.
        </p>
      </va-additional-info>
    </>
  );
};

DocumentUpload.propTypes = {
  currentDocument: PropTypes.object,
  handleDocumentUpload: PropTypes.func,
  loading: PropTypes.bool,
};

export default DocumentUpload;
