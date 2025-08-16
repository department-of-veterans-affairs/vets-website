import React, { useState } from 'react';
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
  const files = Array.isArray(formData) ? formData : [];

  // Check if formData is valid and clear it if not
  const hasValidFiles =
    files.length > 0 &&
    files.every(
      file =>
        file &&
        file.name &&
        file.name !== 'NaN undefined' &&
        file.confirmationCode,
    );

  // Clear invalid data on component mount
  React.useEffect(() => {
    if (!Array.isArray(formData) || (formData.length > 0 && !hasValidFiles)) {
      onChange([]);
    }
  }, []);

  // Ensure we have the required props
  if (!onChange || typeof onChange !== 'function') {
    return <div>Error: File upload component not properly configured</div>;
  }

  const handleFileUpload = async fileToUpload => {
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
        // Add the new file to the existing array
        const updatedFiles = [...files, uploadedFile];
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

  const handleVaChange = e => {
    const file = e.detail.files[0];
    if (!file) {
      setError(null);
      return;
    }

    // File size validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(
        `File size cannot be greater than ${Math.round(
          MAX_FILE_SIZE_BYTES / 1000000,
        )} MB`,
      );
      return;
    }

    if (file.size < 1) {
      setError('File size must be at least 1 byte');
      return;
    }

    // File type validation
    const allowedTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'txt'];
    const fileExtension = file.name
      .split('.')
      .pop()
      ?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      setError(
        'File type not supported. Please upload a PDF, image, or text file.',
      );
      return;
    }

    handleFileUpload(file);
  };

  return (
    <div>
      {/* Use VaFileInputMultiple for proper multiple file upload interface */}
      <VaFileInputMultiple
        accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.txt"
        buttonText="Upload evidence"
        error={error}
        uploadedFiles={files}
        onVaChange={handleVaChange}
        onRemoveFile={index => {
          const updatedFiles = files.filter((_, i) => i !== index);
          onChange(updatedFiles);
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
