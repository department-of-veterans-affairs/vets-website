import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  VaFileInputMultiple,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  clearSpecificErrors,
  extractDocumentTypesFromShadowDOM,
  DOC_TYPE_ERROR,
  createEncryptedFilesList,
  updateErrorsOnFileChange,
  applyValidationErrors,
  validateFiles,
} from '../../utils/supportingEvidence/fileUploadValidations';
import {
  FILE_TYPES,
  HINT_TEXT,
  LABEL_TEXT,
  ATTACHMENTS_TYPE,
  ADDITIONAL_ATTACHMENT_LABEL,
} from './constants';

export const additionalFormInputsContent = ({
  attachmentTypes = ATTACHMENTS_TYPE,
  label = ADDITIONAL_ATTACHMENT_LABEL,
} = {}) => (
  <>
    <VaSelect required name="docType" label={label}>
      {attachmentTypes.map(attachmentType => (
        <option key={attachmentType.value} value={attachmentType.value}>
          {attachmentType.label}
        </option>
      ))}
    </VaSelect>
  </>
);

const UploadFiles = ({ fileTypes = FILE_TYPES }) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [encrypted, setEncrypted] = useState([]);
  const fileInputRef = useRef(null);
  const handleFileChange = async event => {
    const { action, state } = event.detail;
    const newFiles = state || [];

    // Validate all files
    const validationResults = await validateFiles(newFiles);

    setFiles(newFiles);

    if (newFiles.length > 0) {
      // Update errors based on file changes and validation
      setErrors(prevErrors => {
        const baseErrors = updateErrorsOnFileChange(
          prevErrors,
          files,
          newFiles,
          action,
        );

        // Check if a file was replaced (not added or removed)
        const wasFileReplaced = action === 'FILE_UPDATED';
        return applyValidationErrors(
          baseErrors,
          validationResults,
          newFiles,
          wasFileReplaced,
        );
      });

      const encryptedStatus = await createEncryptedFilesList(newFiles);
      setEncrypted(encryptedStatus);
    } else {
      // Clear all errors when all files are removed
      setErrors([]);
      setEncrypted([]);
    }
  };

  useEffect(
    () => {
      // Poll for document type changes to clear errors immediately
      const interval = setInterval(() => {
        const currentDocTypes = extractDocumentTypesFromShadowDOM(fileInputRef);

        setErrors(prevErrors =>
          clearSpecificErrors(
            prevErrors,
            DOC_TYPE_ERROR,
            index => currentDocTypes[index]?.trim() !== '',
          ),
        );
      }, 150);

      return () => clearInterval(interval);
    },
    [files],
  );

  return (
    <VaFileInputMultiple
      accept={fileTypes.map(type => `.${type}`).join(',')}
      ref={fileInputRef}
      required
      hint={HINT_TEXT}
      label={LABEL_TEXT}
      // labelClass={toggleValue ? 'vads-u-visibility--screen-reader' : ''}
      onVaMultipleChange={handleFileChange}
      errors={errors}
      encrypted={encrypted}
    >
      {additionalFormInputsContent({})}
    </VaFileInputMultiple>
  );
};

UploadFiles.propTypes = {
  fileTypes: PropTypes.arrayOf(PropTypes.string),
};
export default UploadFiles;
