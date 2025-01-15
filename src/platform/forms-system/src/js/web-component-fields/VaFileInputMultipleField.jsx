import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import vaFileInputFieldMapping from './vaFileInputFieldMapping';
import { uploadScannedForm } from './vaFileInputFieldHelpers';

const file = [];

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
const VaFileInputMultipleField = props => {
  const mappedProps = vaFileInputFieldMapping(props);
  const dispatch = useDispatch();
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const { formNumber } = props?.uiOptions;
  const { fileUploadUrl } = mappedProps;

  const onFileUploaded = async uploadedFile => {
    if (uploadedFile.file) {
      const {
        confirmationCode,
        isEncrypted,
        name,
        size,
        warnings,
      } = uploadedFile;
      file.push(uploadedFile.file);
      debugger;
      setUploadInProgress(false);
      props.childrenProps.onChange({
        confirmationCode,
        isEncrypted,
        name,
        size,
        warnings,
      });
    }
  };

  const handleVaChange = e => {
    const fileFromEvent = e.detail.files[0];
    if (!fileFromEvent) {
      // file = null;
      setUploadInProgress(false);
      props.childrenProps.onChange(file);
      return;
    }

    if (
      file?.slice(-1).lastModified === fileFromEvent.lastModified &&
      file?.slice(-1).size === fileFromEvent.size
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
    <VaFileInputMultiple
      {...mappedProps}
      error={uploadInProgress ? '' : mappedProps.error}
      value={file}
      onVaChange={handleVaChange}
    />
  );
};

VaFileInputMultipleField.propTypes = {
  childrenProps: PropTypes.object.isRequired,
  uiOptions: PropTypes.object.isRequired,
  onVaChange: PropTypes.func,
};

export default VaFileInputMultipleField;
