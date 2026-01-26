import React, { useState, useRef, useEffect, useCallback } from 'react';
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

const additionalFormInputsContent = ({
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

/**
 * UploadFiles component for handling multiple file uploads with document type selection.
 * Used as a custom ui:field in RJSF form configuration.
 *
 * @param {Object} props - Component props
 * @param {string[]} props.fileTypes - Allowed file extensions (default: FILE_TYPES)
 * @param {Object} props.formData - Current form data from RJSF (unused but passed by form system)
 * @param {Function} props.onChange - Callback to update form data (unused but passed by form system)
 * @param {Object} props.schema - JSON schema for the field (unused but passed by form system)
 * @param {Object} props.uiSchema - UI schema for the field (unused but passed by form system)
 */
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

  // Check document types and clear errors when they're populated
  const checkAndClearDocTypeErrors = useCallback(() => {
    const currentDocTypes = extractDocumentTypesFromShadowDOM(fileInputRef);

    setErrors(prevErrors =>
      clearSpecificErrors(
        prevErrors,
        DOC_TYPE_ERROR,
        index => currentDocTypes[index]?.trim() !== '',
      ),
    );
  }, []);

  useEffect(
    () => {
      const shadowRoot = fileInputRef.current?.shadowRoot;
      if (!shadowRoot || files.length === 0) return undefined;

      // Use MutationObserver to watch for changes in Shadow DOM
      // This is more efficient than polling and responds to actual DOM changes
      const observer = new MutationObserver(() => {
        checkAndClearDocTypeErrors();
      });

      observer.observe(shadowRoot, {
        subtree: true,
        attributes: true,
        attributeFilter: ['value'],
        childList: true,
      });

      // Also listen for vaSelect events that bubble up
      const handleSelectChange = () => {
        checkAndClearDocTypeErrors();
      };

      fileInputRef.current?.addEventListener('vaSelect', handleSelectChange);

      return () => {
        observer.disconnect();
        fileInputRef.current?.removeEventListener(
          'vaSelect',
          handleSelectChange,
        );
      };
    },
    [files, checkAndClearDocTypeErrors],
  );

  return (
    <VaFileInputMultiple
      accept={fileTypes.map(type => `.${type}`).join(',')}
      ref={fileInputRef}
      required
      hint={HINT_TEXT}
      label={LABEL_TEXT}
      onVaMultipleChange={handleFileChange}
      errors={errors}
      encrypted={encrypted}
    >
      {additionalFormInputsContent({})}
    </VaFileInputMultiple>
  );
};

UploadFiles.propTypes = {
  // Component-specific props
  fileTypes: PropTypes.arrayOf(PropTypes.string),
  // RJSF form system props (passed automatically by ui:field)
  formData: PropTypes.array,
  onChange: PropTypes.func,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  idSchema: PropTypes.object,
  errorSchema: PropTypes.object,
  registry: PropTypes.object,
};

export default UploadFiles;
