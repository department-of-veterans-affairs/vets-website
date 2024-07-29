import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
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
  const { formNumber } = props?.uiOptions;
  const { fileUploadUrl } = mappedProps;

  const onFileUploaded = useCallback(
    uploadedFile => {
      if (uploadedFile.confirmationCode) {
        props.childrenProps.onChange(uploadedFile);
      }
    },
    [props.childrenProps],
  );

  const handleVaChangeBug = event => {
    let newFile = event.detail.files[0];

    // if the user is deleting the file, the files will be the same
    if (areFilesEqual(file, newFile) || !newFile) {
      newFile = null;
      dispatch(
        setData({
          ...formData,
          uploadedFile: {
            confirmationCode: null,
            isEncrypted: null,
            name: null,
            size: null,
            warnings: null,
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

VaFileInputField.propTypes = {
  childrenProps: PropTypes.object.isRequired,
  uiOptions: PropTypes.object.isRequired,
  onVaChange: PropTypes.func.isRequired,
};

export default VaFileInputField;
