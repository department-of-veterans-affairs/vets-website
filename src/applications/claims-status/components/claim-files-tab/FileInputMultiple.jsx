import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaFileInputMultiple,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  checkIsEncryptedPdf,
  FILE_TYPE_MISMATCH_ERROR,
} from 'platform/forms-system/src/js/utilities/file';
import { DOC_TYPES } from '../../utils/helpers';
import { FILE_TYPES } from '../../utils/validations';

const encryptionChecks = {
  checkTypeAndExtensionMatches,
  checkIsEncryptedPdf,
};

export default function FileInputMultiple() {
  const [encryptedList, setEncryptedList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [docType, setDocType] = useState('');

  const createIsEncryptedList = async fileEntries => {
    const isEncryptedList = await Promise.all(
      fileEntries?.map(async file => {
        const checkResults = await readAndCheckFile(
          file.file,
          encryptionChecks,
        );

        if (!checkResults.checkTypeAndExtensionMatches) {
          setErrorMessage(FILE_TYPE_MISMATCH_ERROR);
          return false;
        }

        if (file.file.type === 'application/pdf') {
          return checkResults.checkIsEncryptedPdf;
        }

        return false;
      }),
    );

    setEncryptedList(isEncryptedList);
  };

  const handleDocTypeChange = value => {
    setDocType(value);
  };

  return (
    <VaFileInputMultiple
      id="file-upload"
      error={errorMessage}
      label="Upload additional evidence"
      hint="You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only)."
      accept={FILE_TYPES.map(type => `.${type}`).join(',')}
      onVaMultipleChange={e => createIsEncryptedList(e.detail.state)}
      name="fileUpload"
      additionalErrorClass="claims-upload-input-error-message"
      aria-describedby="file-requirements"
      encrypted={encryptedList}
    >
      <VaSelect
        required
        // error={
        //   validateIfDirty(docType, isNotBlank)
        //     ? undefined
        //     : 'Please provide a response'
        // }
        name="docType"
        label="What type of document is this?"
        value={docType}
        onVaSelect={e => handleDocTypeChange(e.detail.value)}
      >
        {DOC_TYPES.map(doc => (
          <option key={doc.value} value={doc.value}>
            {doc.label}
          </option>
        ))}
      </VaSelect>
    </VaFileInputMultiple>
  );
}

FileInputMultiple.propTypes = {
  add: PropTypes.func,
  docType: PropTypes.string,
  getErrorMessage: PropTypes.func,
  handleDocTypeChange: PropTypes.func,
};
