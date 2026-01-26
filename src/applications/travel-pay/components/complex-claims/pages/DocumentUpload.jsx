import React from 'react';
import PropTypes from 'prop-types';

import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { ACCEPTED_FILE_TYPES } from '../../../constants';

const DocumentUpload = ({
  currentDocument,
  error,
  handleDocumentChange,
  onVaFileInputError,
}) => {
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
        onVaFileInputError={onVaFileInputError}
        required
        error={error}
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
  error: PropTypes.string,
  handleDocumentChange: PropTypes.func,
  onVaFileInputError: PropTypes.func,
};

export default DocumentUpload;
