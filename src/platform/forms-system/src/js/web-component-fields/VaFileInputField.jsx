import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { uploadScannedForm } from '~/applications/simple-forms/form-upload/helpers';
import vaFileInputFieldMapping from './vaFileInputFieldMapping';

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
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  const onFileUploaded = useCallback(
    uploadedFile => {
      if (uploadedFile.confirmationCode) {
        setError('');
        props.childrenProps.onChange(uploadedFile);
      }
    },
    [props.childrenProps],
  );

  const handleVaChange = useCallback(
    e => {
      const newFile = e.detail.files[0];

      if (file && newFile.name === file.name && newFile.size === file.size) {
        setFile(null);
        return;
      }

      setFile(newFile);
      dispatch(uploadScannedForm('21-0779', newFile, onFileUploaded));
    },
    [file, dispatch, onFileUploaded],
  );

  return (
    <VaFileInput
      {...mappedProps}
      error={error}
      onVaChange={props.onVaChange || handleVaChange}
    />
  );
};

export default VaFileInputField;
