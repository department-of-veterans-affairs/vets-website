import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import vaFileInputFieldMapping from './vaFileInputFieldMapping';
import { getFileSize, uploadScannedForm } from './vaFileInputFieldHelpers';

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
  const mappedProps = vaFileInputFieldMapping(props);
  const dispatch = useDispatch();
  const { formNumber } = props?.uiOptions;
  const { fileUploadUrl } = mappedProps;
  const [error, setError] = useState(mappedProps.error);
  const [isUploading, setIsUploading] = useState(false);

  const onFileUploaded = async uploadedFile => {
    if (uploadedFile.file) {
      const {
        confirmationCode,
        isEncrypted,
        name,
        size,
        warnings,
        errorMessage,
      } = uploadedFile;
      setError(errorMessage);
      setIsUploading(false);
      props.childrenProps.onChange({
        confirmationCode,
        isEncrypted,
        name,
        size,
        warnings,
      });
    }
  };

  const onFileUploading = () => {
    setIsUploading(true);
    props.childrenProps.onChange({ name: 'uploading' });
  };

  const handleVaChange = e => {
    const fileFromEvent = e.detail.files[0];
    if (!fileFromEvent) {
      setError(mappedProps.error);
      props.childrenProps.onChange({});
      return;
    }

    const { maxFileSize } = props.uiOptions;
    if (fileFromEvent.size > maxFileSize) {
      const fileSizeString = getFileSize(maxFileSize);
      setError(`File size cannot be greater than ${fileSizeString}`);
      return;
    }

    dispatch(
      uploadScannedForm(
        fileUploadUrl,
        formNumber,
        fileFromEvent,
        onFileUploaded,
        onFileUploading,
      ),
    );
  };

  return (
    <VaFileInput
      {...mappedProps}
      error={error}
      uploadedFile={mappedProps.uploadedFile}
      onVaChange={handleVaChange}
    >
      {isUploading ? (
        <div>
          <em>Uploading...</em>
        </div>
      ) : null}
    </VaFileInput>
  );
};

VaFileInputField.propTypes = {
  childrenProps: PropTypes.object.isRequired,
  uiOptions: PropTypes.object.isRequired,
  onVaChange: PropTypes.func,
};

export default VaFileInputField;
