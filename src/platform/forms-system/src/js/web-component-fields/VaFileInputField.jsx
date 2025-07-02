import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import vaFileInputFieldMapping from './vaFileInputFieldMapping';
import { uploadScannedForm } from './vaFileInputFieldHelpers';

const useFileUpload = (fileUploadUrl, accept, formNumber, dispatch) => {
  const [isUploading, setIsUploading] = useState(false);
  const [percentUploaded, setPercentUploaded] = useState(null);

  const uploadFile = (file, onSuccess) => {
    setIsUploading(true);

    const onFileUploaded = uploadedFile => {
      setIsUploading(false);
      setPercentUploaded(null);
      if (onSuccess) onSuccess(uploadedFile);
    };

    const onFileUploading = percent => {
      setPercentUploaded(percent);
      setIsUploading(true);
    };

    dispatch(
      uploadScannedForm(
        fileUploadUrl,
        formNumber,
        file,
        onFileUploaded,
        onFileUploading,
        accept,
      ),
    );
  };

  return { isUploading, percentUploaded, uploadFile };
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
  const { fileUploadUrl, accept } = mappedProps;
  const dispatch = useDispatch();
  const [error, setError] = useState(mappedProps.error);
  const { isUploading, percentUploaded, uploadFile } = useFileUpload(
    fileUploadUrl,
    accept,
    formNumber,
    dispatch,
  );

  const additionalInputError =
    childrenProps.errorSchema.additionalData.__errors[0] || null;
  const passwordError =
    childrenProps.errorSchema.isEncrypted.__errors[0] || null;

  // useEffect(() => {
  //   if (additionalInputError) {
  //     childrenProps.onChange({
  //       ...childrenProps.formData,
  //       additionalData: {
  //         hasError: true
  //       }
  //     })
  //   }
  // }, [additionalInputError]);

  const assignFileUploadToStore = uploadedFile => {
    if (!uploadedFile) return;

    const {
      confirmationCode,
      isEncrypted,
      name,
      size,
      file,
      warnings,
      errorMessage,
    } = uploadedFile;

    childrenProps.onChange({
      confirmationCode,
      isEncrypted,
      name,
      size,
      type: file.type,
      warnings,
      errorMessage,
    });
  };

  const handleFileProcessing = uploadedFile => {
    if (!uploadedFile || !uploadedFile.file) return;

    setError(uploadedFile.errorMessage);
    assignFileUploadToStore(uploadedFile);
  };

  const handleVaChange = e => {
    const fileFromEvent = e.detail.files[0];
    if (!fileFromEvent) {
      setError(mappedProps.error);
      childrenProps.onChange({});
      return;
    }

    childrenProps.onChange({
      ...childrenProps.formData,
      name: 'uploading',
    });
    uploadFile(fileFromEvent, handleFileProcessing);
  };

  const handleVaPasswordChange = e => {
    const { password } = e.detail;
    childrenProps.onChange({
      ...childrenProps.formData,
      password,
    });
  };

  const handleAdditionalInput = e => {
    if (mappedProps.handleAdditionalInput) {
      const payload = mappedProps.handleAdditionalInput(e);
      childrenProps.onChange({
        ...childrenProps.formData,
        additionalData: payload,
      });
    }
  };

  return (
    <VaFileInput
      {...mappedProps}
      error={error || mappedProps.error}
      uploadedFile={mappedProps.uploadedFile}
      onVaChange={handleVaChange}
      onVaPasswordChange={handleVaPasswordChange}
      percentUploaded={percentUploaded || null}
      passwordError={passwordError}
    >
      {isUploading && (
        <div>
          <em>Uploading...</em>
        </div>
      )}
      <div className="additional-input-container">
        {mappedProps.additionalInput &&
          React.cloneElement(
            // clone element so we can attach listeners
            mappedProps.additionalInput(additionalInputError),
            {
              onVaChange: handleAdditionalInput,
              onVaSelect: handleAdditionalInput,
              onVaValueChange: handleAdditionalInput,
            },
          )}
      </div>
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
