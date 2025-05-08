import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
const VaFileInputMultipleField = props => {
  const mappedProps = vaFileInputFieldMapping(props);
  const dispatch = useDispatch();
  const [localFile, setLocalFile] = useState(null);
  const [uploadArray, setUploadArray] = useState([]);
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
    if (uploadedFile.file) {
      const localFilePath = URL.createObjectURL(uploadedFile.file);
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

      // Use functional updates here as well to ensure latest state
      setUploadArray(prevArray => {
        const newArray = [...prevArray, fileObj];
        props.childrenProps.onChange(newArray); // Move this inside the setter
        return newArray;
      });

      setLocalFile(uploadedFile.file); // for thumbnail on nav back
      setUploadInProgress(false);
    }
  };

  function indexOfMatch(arr, properties) {
    return arr.findIndex(obj => {
      return Object.keys(properties).every(key => obj[key] === properties[key]);
    });
  }

  const handleVaChange = e => {
    const fileFromEvent = e.detail.file;

    if (e.detail.action === 'FILE_REMOVED') {
      const idx = indexOfMatch(
        uploadArray,
        _.pick(fileFromEvent, ['name', 'size', 'lastModified']), // identifying properties from newly removed file
      );

      setLocalFile(null);
      setUploadInProgress(false);

      // Use functional updates to ensure we're using the latest state
      setUploadArray(prevArray => {
        const newArray = prevArray.toSpliced(idx, 1);
        props.childrenProps.onChange(newArray); // Update form data with the new array
        return newArray;
      });
      return;
    }

    if (e.detail.action === 'FILE_UPDATED') {
      const idx = indexOfMatch(
        e.detail.state, // the list of uploaded files
        ['changed'], // the file that was updated
      );

      setLocalFile(null);
      setUploadInProgress(false);

      // Use functional updates here too
      setUploadArray(prevArray => {
        const newArray = prevArray.toSpliced(idx, 1);
        props.childrenProps.onChange(newArray);
        return newArray;
      });
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
      onVaMultipleChange={handleVaChange}
    />
  );
};

VaFileInputMultipleField.propTypes = {
  childrenProps: PropTypes.object.isRequired,
  uiOptions: PropTypes.object.isRequired,
  onVaChange: PropTypes.func,
};

export default VaFileInputMultipleField;
