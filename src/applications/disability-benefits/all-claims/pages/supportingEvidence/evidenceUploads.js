import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { uploadFile } from 'platform/forms-system/src/js/actions';
import environment from 'platform/utilities/environment';
import { MAX_FILE_SIZE_BYTES, MAX_PDF_FILE_SIZE_BYTES } from '../../constants';

// Custom file input component that bypasses uploadScannedForm
const CustomFileInputField = props => {
  const { onChange, formData = [] } = props;
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  // Ensure formData is always an array
  const files = formData || [];

  const handleFileUpload = async (fileToUpload, replaceIndex = null) => {
    setIsUploading(true);
    setError(null);

    const customUiOptions = {
      fileUploadUrl: `${environment.API_URL}/v0/upload_supporting_evidence`,
      fileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'txt'],
      maxSize: MAX_FILE_SIZE_BYTES,
      maxPdfSize: MAX_PDF_FILE_SIZE_BYTES,
      minSize: 1,
      createPayload: (file, _formId, password) => {
        const payload = new FormData();
        payload.append('supporting_evidence_attachment[file_data]', file);
        if (password) {
          payload.append('supporting_evidence_attachment[password]', password);
        }
        return payload;
      },
      parseResponse: (response, file) => {
        return {
          name: file.name,
          confirmationCode: response.data.attributes.guid,
          size: file.size,
        };
      },
    };

    const onProgress = () => {};
    const onFileChange = uploadedFile => {
      setIsUploading(false);
      if (uploadedFile.errorMessage) {
        setError(uploadedFile.errorMessage);
      } else {
        let updatedFiles;
        if (replaceIndex !== null) {
          // Replace the file at the specified index
          updatedFiles = [...files];
          updatedFiles[replaceIndex] = uploadedFile;
        } else {
          // Add the new file to the existing array
          updatedFiles = [...files, uploadedFile];
        }
        onChange(updatedFiles);
      }
    };
    const onError = () => {
      setIsUploading(false);
    };

    const uploadRequest = uploadFile(
      fileToUpload,
      customUiOptions,
      onProgress,
      onFileChange,
      onError,
    );

    uploadRequest(dispatch, () => ({ form: { formId: '21-526EZ-ALLCLAIMS' } }));
  };

  return (
    <div>
      {/* Use VaFileInputMultiple for proper multiple file upload interface */}
      <VaFileInputMultiple
        accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.txt"
        buttonText="Upload evidence"
        error={error}
        uploadedFiles={files}
        onVaChange={e => {
          // Handle file selection for both initial uploads and additional files
          const file = e.detail.files?.[0];
          if (file && !file.confirmationCode) {
            // Handle any new file selection
            handleFileUpload(file);
          }
        }}
        onVaMultipleChange={e => {
          const { action, state } = e.detail;

          if (action === 'FILE_REMOVED' && state && Array.isArray(state)) {
            // Convert VaFileInputMultiple state back to our file format
            const updatedFiles = state
              .map(fileInfo => ({
                name: fileInfo.name || fileInfo.file?.name,
                size: fileInfo.size || fileInfo.file?.size,
                confirmationCode: fileInfo.confirmationCode,
                isEncrypted: fileInfo.isEncrypted || false,
              }))
              .filter(file => file.name && file.confirmationCode);

            onChange(updatedFiles);
          } else if (
            action === 'FILE_UPDATED' &&
            state &&
            Array.isArray(state) &&
            files.length > 0 &&
            state.length > 0
          ) {
            // Handle file replacement
            // Since VaFileInputMultiple doesn't give us the complete state during updates,
            // we'll replace the first existing file in our formData
            const newFile = state[0];

            // Upload the new file to replace the existing one
            if (newFile.file) handleFileUpload(newFile.file, 0);
          }
        }}
      >
        {isUploading && (
          <div>
            <em>Uploading...</em>
          </div>
        )}
      </VaFileInputMultiple>
    </div>
  );
};

CustomFileInputField.propTypes = {
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.array,
};

export default {
  uiSchema: {
    'ui:title': 'Add Document',
    uploadedDocuments: {
      'ui:field': CustomFileInputField,
      'ui:description': 'Upload the evidence you want to add to your claim',
    },
  },
  schema: {
    type: 'object',
    properties: {
      uploadedDocuments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            confirmationCode: { type: 'string' },
            isEncrypted: { type: 'boolean' },
            name: { type: 'string' },
            size: { type: 'integer' },
            fileType: { type: 'string' },
            warnings: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  },
};
