import React, { useState, useEffect } from 'react';
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
  const [localFile, setLocalFile] = useState(null);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const { formNumber } = props?.uiOptions;
  const { fileUploadUrl } = mappedProps;

  useEffect(() => {
    // Since the multi-file input doesn't "remember" the thumbnails of
    // uploaded files when you navigate away and back, this re-produces them
    // by creating File objects from the files stored in the formData object.
    const fd = props.childrenProps.formData;
    if (fd.length === 0) return;

    const fetchFile = async () => {
      const representations = await Promise.all(
        fd.map(async el => {
          const response = await fetch(el?.localFilePath);
          const blob = await response.blob();
          return new File([blob], el?.name, { type: el.type });
        }),
      );
      setLocalFile(representations);
    };

    fetchFile();
  }, []);

  const onFileUploaded = async uploadedFile => {
    // debugger;
    if (uploadedFile.file) {
      const localFilePath = URL.createObjectURL(uploadedFile.file);
      // De-nesting the properties contained in uploadedFile.file
      const fileObj = {
        lastModified: uploadedFile.file.lastModified,
        lastModifiedDate: uploadedFile.file.lastModifiedDate,
        type: uploadedFile.file.type,
        name: uploadedFile.name,
        size: uploadedFile.size,
        warnings: uploadedFile.warnings,
        confirmationCode: uploadedFile.confirmationCode,
        isEncrypted: uploadedFile.isEncrypted,
        localFilePath,
      };

      // Extend our list of uploaded files for this instance of the uploader
      file.push(fileObj);
      setLocalFile(uploadedFile.file); // for thumbnail on nav back
      setUploadInProgress(false);

      // Commit list of uploaded files
      props.childrenProps.onChange(file);
    }
  };

  const handleVaChange = e => {
    const fileFromEvent = e.detail.files[0];
    if (!fileFromEvent) {
      props.childrenProps.onChange({ localFilePath: '' });
      setLocalFile(null);
      setUploadInProgress(false);
      props.childrenProps.onChange(file);
      return;
    }

    if (
      localFile?.slice(-1).lastModified === fileFromEvent.lastModified &&
      localFile?.slice(-1).size === fileFromEvent.size
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
      value={localFile}
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
