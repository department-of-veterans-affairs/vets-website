import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import vaFileInputFieldMapping from './vaFileInputFieldMapping';
import { getFileSize, uploadScannedForm } from './vaFileInputFieldHelpers';

const useFileReader = () => {
  const readAsDataURL = file => {
    return new Promise(resolve => {
      if (
        !file ||
        !(file.type === 'application/pdf' || file.type.startsWith('image/'))
      ) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  const readAsText = file => {
    return new Promise(resolve => {
      if (!file) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsText(file);
    });
  };

  return { readAsDataURL, readAsText };
};

const useFileValidator = options => {
  const validateFileSize = file => {
    const { maxFileSize } = options;
    if (file && maxFileSize && file.size > maxFileSize) {
      const fileSizeString = getFileSize(maxFileSize);
      return `File size cannot be greater than ${fileSizeString}`;
    }
    return null;
  };

  return { validateFileSize };
};

const useFileUpload = (fileUploadUrl, formNumber, dispatch) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = (file, onSuccess) => {
    setIsUploading(true);

    const onFileUploaded = uploadedFile => {
      setIsUploading(false);
      if (onSuccess) onSuccess(uploadedFile);
    };

    const onFileUploading = () => {
      setIsUploading(true);
    };

    dispatch(
      uploadScannedForm(
        fileUploadUrl,
        formNumber,
        file,
        onFileUploaded,
        onFileUploading,
      ),
    );
  };

  return { isUploading, uploadFile };
};

/**
 * Usage uiSchema:
 * ```
 * fileInput: {
 *   'ui:title': 'A file input',
 *   'ui:description': 'Text description',
 *   'ui:webComponentField': VaFileInput,
 *   'ui:hint': 'hint',
 *   'ui:errorMessages': {
 *     required: 'This is a custom error message.',
 *   },
 *   'ui:options': {
 *     accept: '.pdf,.jpeg,.png',
 *     buttonText: 'Push this button',
 *     enableAnalytics: true,
 *     labelHeaderLevel: "1",
 *     messageAriaDescribedby: 'text description to be read by screen reader',
 *   },
 * }
 * ```
 *
 * Usage schema:
 * ```
 * uploadedFile: {
 *   type: 'object',
 *   properties: {},
 * },
 * ```
 * @param {WebComponentFieldProps} props */
const VaFileInputField = props => {
  const { uiOptions = {}, childrenProps } = props;
  const { formNumber } = uiOptions;
  const mappedProps = vaFileInputFieldMapping(props);
  const { fileUploadUrl } = mappedProps;
  const dispatch = useDispatch();

  const [error, setError] = useState(mappedProps.error);

  const fileReader = useFileReader();
  const fileValidator = useFileValidator(uiOptions);
  const { isUploading, uploadFile } = useFileUpload(
    fileUploadUrl,
    formNumber,
    dispatch,
  );

  const handleFileProcessing = async uploadedFile => {
    if (!uploadedFile || !uploadedFile.file) return;

    setError(uploadedFile.errorMessage);

    const fileContents = await fileReader.readAsDataURL(uploadedFile.file);

    const {
      confirmationCode,
      isEncrypted,
      name,
      size,
      fileType,
      warnings,
      errorMessage,
    } = uploadedFile;

    childrenProps.onChange({
      confirmationCode,
      isEncrypted,
      name,
      size,
      type: fileType,
      contents: fileContents,
      warnings,
      errorMessage,
    });
  };

  const handleVaChange = async e => {
    const fileFromEvent = e.detail.files[0];

    if (!fileFromEvent) {
      setError(mappedProps.error);
      childrenProps.onChange({});
      return;
    }

    const sizeError = fileValidator.validateFileSize(fileFromEvent);
    if (sizeError) {
      setError(sizeError);
      return;
    }

    childrenProps.onChange({ name: 'uploading' });
    uploadFile(fileFromEvent, handleFileProcessing);
  };

  return (
    <VaFileInput
      {...mappedProps}
      error={error}
      uploadedFile={mappedProps.uploadedFile}
      onVaChange={handleVaChange}
    >
      {isUploading && (
        <div>
          <em>Uploading...</em>
        </div>
      )}
    </VaFileInput>
  );
};

VaFileInputField.propTypes = {
  childrenProps: PropTypes.object.isRequired,
  uiOptions: PropTypes.shape({
    maxFileSize: PropTypes.number,
    formNumber: PropTypes.string,
  }),
  onVaChange: PropTypes.func,
};

VaFileInputField.defaultProps = {
  uiOptions: {},
};

export default VaFileInputField;
