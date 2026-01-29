import React from 'react';
import PropTypes from 'prop-types';

import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { ACCEPTED_FILE_TYPES } from '../../../constants';

const DocumentUpload = ({
  currentDocument,
  handleDocumentChange,
  uploadError,
}) => {
  // Only pass a string if there is an error, otherwise undefined
  const errorMessage = uploadError || undefined;

  return (
    <>
      <VaFileInput
        accept={ACCEPTED_FILE_TYPES.join(',')}
        hint={`You can upload a ${ACCEPTED_FILE_TYPES.join(', ').replace(
          /, ([^,]*)$/,
          ', or $1',
        )} file. Your file should be no larger than 5MB.`}
        label="Select a file to upload"
        maxFileSize={5200000}
        minFileSize={0}
        name="travel-pay-claim-document-upload"
        onVaChange={handleDocumentChange}
        required
        error={errorMessage}
        value={currentDocument}
      />

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
  handleDocumentChange: PropTypes.func,
  uploadError: PropTypes.string,
};

export default DocumentUpload;
