import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import vaFileInputFieldMapping from './vaFileInputFieldMapping';
import { uploadScannedForm } from './vaFileInputFieldHelpers';

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
  const [localFile, setLocalFile] = useState(null);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const { formNumber } = props?.uiOptions;
  const { fileUploadUrl } = mappedProps;

  useEffect(() => {
    const { localFilePath } = props.childrenProps.formData;
    if (localFilePath) {
      const fetchFile = async () => {
        await fetch(localFilePath)
          .then(r => r.blob())
          .then(blob =>
            setLocalFile(
              new File([blob], props.childrenProps.formData.name, {
                type: 'application/pdf',
              }),
            ),
          );
      };
      fetchFile();
    }
  }, []);

  const onFileUploaded = async uploadedFile => {
    if (uploadedFile.file) {
      const {
        confirmationCode,
        isEncrypted,
        name,
        size,
        warnings,
      } = uploadedFile;
      const localFilePath = URL.createObjectURL(uploadedFile.file);
      props.childrenProps.onChange({
        confirmationCode,
        isEncrypted,
        name,
        size,
        warnings,
        localFilePath,
      });
      const file = await fetch(localFilePath)
        .then(r => r.blob())
        .then(
          blob =>
            new File([blob], uploadedFile.name, { type: 'application/pdf' }),
        );
      setLocalFile(file);
      setUploadInProgress(false);
    }
  };

  const handleVaChange = e => {
    const fileFromEvent = e.detail.files[0];
    if (!fileFromEvent) {
      props.childrenProps.onChange({ localFilePath: '' });
      setLocalFile(null);
      setUploadInProgress(false);
      return;
    }

    if (
      localFile?.lastModified === fileFromEvent.lastModified &&
      localFile?.size === fileFromEvent.size
    ) {
      // This guard clause protects against infinite looping/updating if the localFile and fileFromEvent are identical
      return;
    }

    dispatch(
      uploadScannedForm(
        fileUploadUrl,
        formNumber,
        fileFromEvent,
        onFileUploaded,
        () => setUploadInProgress(true),
      ),
    );
  };

  return (
    <VaFileInput
      {...mappedProps}
      error={uploadInProgress ? '' : mappedProps.error}
      value={localFile}
      onVaChange={handleVaChange}
    />
  );
};

VaFileInputField.propTypes = {
  childrenProps: PropTypes.object.isRequired,
  uiOptions: PropTypes.object.isRequired,
  onVaChange: PropTypes.func,
};

export default VaFileInputField;
