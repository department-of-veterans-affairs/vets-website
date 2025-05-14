import React, { useState, useEffect, useRef } from 'react';
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
 *   type: 'array'
 *   items: {
 *     type: 'object',
 *     properties {},
 *   },
 * },
 * ```
 * @param {WebComponentFieldProps} props */
const VaFileInputMultipleField = props => {
  const mappedProps = vaFileInputFieldMapping(props);
  const dispatch = useDispatch();
  const [localFile, setLocalFile] = useState(null);
  const [uploadArray, setUploadArray] = useState([]);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const pendingUpdate = useRef(null);
  const { formNumber } = props?.uiOptions;
  const { fileUploadUrl } = mappedProps;

  useEffect(() => {
    // Since the multi-file input doesn't "remember" the thumbnails of
    // uploaded files when you navigate away and back, this re-produces them
    // by creating File objects from the files stored in the formData object.
    const fd = props.childrenProps.formData;
    if (fd?.length === 0 || fd?.length === undefined) return;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This useEffect + the pendingUpdate state are used to prevent the
  // "Cannot update a component while rendering a different component" warning
  // by preventing interruptions.
  useEffect(
    () => {
      if (pendingUpdate.current !== null) {
        props.childrenProps.onChange(pendingUpdate.current);
        pendingUpdate.current = null;
      }
    },
    [props.childrenProps, uploadArray],
  );

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

      setUploadArray(prevArray => {
        const fd = props.childrenProps.formData;
        const baseArray = prevArray.length === 0 ? [...fd] : prevArray;
        const newArray = [...baseArray, fileObj];
        pendingUpdate.current = newArray;
        return newArray;
      });

      setLocalFile(uploadedFile.file); // for thumbnail on nav back
      setUploadInProgress(false);
    }
  };

  /**
   * Finds the index of an object in an array that matches the given properties
   * @param {Array} arr - The array to search
   * @param {Object} properties - The properties to match, e.g., {size: 123, name: 'test.png'}
   * @returns {number} The index of the matching object, or -1 if not found
   */
  function indexOfMatch(arr, properties) {
    return arr.findIndex(obj => {
      return Object.keys(properties).every(key => obj[key] === properties[key]);
    });
  }

  const handleVaChange = e => {
    const fd = props.childrenProps.formData;
    const fileFromEvent = e.detail.file;

    if (e.detail.action === 'FILE_REMOVED') {
      const idx = indexOfMatch(
        fd,
        // identifying properties from newly removed file
        _.pick(fileFromEvent, ['name', 'size']),
      );

      setLocalFile(null);
      setUploadInProgress(false);

      // Use functional updates to ensure we're using the latest state
      setUploadArray(prevArray => {
        const baseArray = prevArray.length === 0 ? [...fd] : prevArray;
        const newArray = baseArray.toSpliced(idx, 1);
        pendingUpdate.current = newArray;
        return newArray;
      });
      return;
    }

    if (e.detail.action === 'FILE_UPDATED') {
      const idx = indexOfMatch(
        e.detail.state, // the list of uploaded files
        { changed: true }, // to identify the target to be replaced
      );

      setLocalFile(null);
      setUploadInProgress(false);

      // Use functional updates here too
      setUploadArray(prevArray => {
        const baseArray = prevArray.length === 0 ? [...fd] : prevArray;
        const newArray = baseArray.toSpliced(idx, 1);
        pendingUpdate.current = newArray;
        return newArray;
      });
      // With target file removed, fall through to the main dispatch() call
      // to upload the replacement
    }

    if (
      localFile?.slice(-1).lastModified === fileFromEvent.lastModified &&
      localFile?.slice(-1).size === fileFromEvent.size
    ) {
      // This guard clause protects against infinite looping/updating if the localFile and fileFromEvent are identical
      return;
    }

    // Default behavior for when action is FILE_ADDED:
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
