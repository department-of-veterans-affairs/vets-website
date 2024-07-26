import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getOcrResults } from '~/applications/simple-forms/form-upload/helpers';
import vaFileInputFieldMapping from './vaFileInputFieldMapping';
import { areFilesEqual, uploadScannedForm } from './vaFileInputFieldHelpers';

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
  const [file, setFile] = useState(null);
  const formData = useSelector(state => state.form.data);
  const { formNumber } = formData;
  const { fileUploadUrl } = mappedProps;

  const onFileUploaded = useCallback(
    async uploadedFile => {
      const { confirmationCode } = uploadedFile;
      if (confirmationCode) {
        const ocrResults = await getOcrResults(uploadedFile.file);
        const { name, size } = uploadedFile.file;
        props.childrenProps.onChange({
          name,
          size,
          confirmationCode,
          ocrResults,
        });
      }
    },
    [props.childrenProps],
  );

  const handleVaChangeBug = event => {
    let newFile = event.detail.files[0];

    // if the user is deleting the file, the files will be the same
    if (areFilesEqual(file, newFile)) {
      newFile = null;
      dispatch(
        setData({
          ...formData,
          uploadedFile: {
            confirmationCode: null,
            isEncrypted: null,
            name: null,
            size: null,
          },
        }),
      );
    }

    setFile(newFile);

    return newFile;
  };

  const handleVaChange = useCallback(
    e => {
      const newFile = handleVaChangeBug(e);

      if (!newFile) {
        return;
      }

      if (!props.onVaChange) {
        dispatch(
          uploadScannedForm(fileUploadUrl, formNumber, newFile, onFileUploaded),
        );
        return;
      }

      props.onVaChange();
    },
    [file, dispatch, onFileUploaded, props.onVaChange],
  );

  return <VaFileInput {...mappedProps} onVaChange={handleVaChange} />;
};

export default VaFileInputField;
