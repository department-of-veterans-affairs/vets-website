import React, { useState, useEffect, useRef } from 'react';
import { pick } from 'lodash';
import { useDispatch } from 'react-redux';
import {
  VaFileInputMultiple,
  VaProgressBar,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import vaFileInputFieldMapping from 'platform/forms-system/src/js/web-component-fields/vaFileInputFieldMapping';
import { uploadFile } from 'platform/forms-system/src/js/web-component-fields/vaFileInputFieldHelpers';

/**
 * Matches errors to files based on the file characteristics rather
 * than their position within the respective arrays (which is what VaFileInputMultiple
 * tries to do).
 * @param {Object} e File event, e.g. an upload/change/removal
 * @param {Array} errList list of error objects for uploaded files
 * @returns Array of objects containing file details + an errorMessage property
 * e.g.: [{name: 'file.png', size: 123, errorMessage: 'Too large'}]
 */
function getErrorsForFiles(e, errList) {
  const fileEntries = e?.detail?.state;
  return fileEntries.map((entry, _index) => {
    if (!entry.file) {
      return '';
    }
    // Match errors to files based on their characteristics rather
    // than their array position:
    return errList.find(
      err => err?.name === entry?.file?.name && err?.size === entry?.file?.size,
    );
  });
}

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
  // List of actual errors is not guaranteed to be in the proper order
  // so we use errorsListDisplay which can be sorted in a useEffect after
  // errorsList is updated.
  const [errorsList, setErrorsList] = useState([]);
  const [errorsListDisplay, setErrorsListDisplay] = useState([]);
  const [latestEvent, setLatestEvent] = useState(undefined);
  const [uploadArray, setUploadArray] = useState([]);
  // Used for displaying thumbnails
  const [localFile, setLocalFile] = useState(null);
  // uploadInProgress is used by uploadFile
  // eslint-disable-next-line no-unused-vars
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const pendingUpdate = useRef(null);
  const { formNumber } = props?.uiOptions;
  const { fileUploadUrl } = mappedProps;
  const [progress, setProgress] = useState(0);

  const incompleteUploadMsg = 'File not finished uploading - please wait';

  // Handles showing an error while a file is uploading
  useEffect(
    () => {
      if (uploadInProgress === false) {
        setErrorsList(
          errorsList.filter(e => e?.errorMessage !== incompleteUploadMsg),
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadInProgress],
  );

  useEffect(
    () => {
      if (latestEvent === undefined) return;
      setErrorsListDisplay(getErrorsForFiles(latestEvent, errorsList));
    },
    [errorsList, latestEvent],
  );

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

  // Produces an error message for a given file stating that it is still uploading.
  // Used in conjunction with `uploadInProgress`.
  function addLoadingMsg(f) {
    return {
      name: f?.name,
      size: f?.size,
      errorMessage: incompleteUploadMsg,
    };
  }

  // Function called on every progress update cycle while file is uploading
  function updateProgress(percent) {
    setUploadInProgress(true);
    setProgress(percent);
  }

  /**
   * Identifies the overlap in two arrays of files based on file name and size
   * @param {Array} arr1 Array to check against
   * @param {Array} arr2 Array to be narrowed down based on the presence of files in arr1
   * @returns
   */
  function filterToMatchingObjects(arr1, arr2) {
    // Create a Set of unique identifier strings from arr1
    const arr1Identifiers = new Set(
      arr1.map(item => `${item.name}-${item.size}`),
    );

    // Filter arr2 to only include items whose identifiers exist in the Set
    return arr2
      .filter(item => arr1Identifiers.has(`${item.name}-${item.size}`))
      ?.reverse(); // preserve initial order
  }

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

  // This logic handles setting a newly added file in the state (or not, if there was an error).
  const onFileUploaded = async uploadedFile => {
    if (uploadedFile.errorMessage) {
      setErrorsList([...errorsList, uploadedFile]);
      setUploadInProgress(false);
      return;
    }

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
        const baseArray = prevArray.length === 0 ? [...(fd || [])] : prevArray;
        const newArray = [...baseArray, fileObj];
        pendingUpdate.current = newArray;
        return newArray;
      });

      setLocalFile(uploadedFile.file); // for thumbnail on nav back
      setUploadInProgress(false);
    }
  };

  const handleVaChange = e => {
    setLatestEvent(e);
    const fd = props.childrenProps.formData;
    const fileFromEvent = e.detail.file;

    setErrorsList([
      ...getErrorsForFiles(e, errorsList),
      // Temporary error indicating file not uploaded yet. Is automatically
      // cleared when `isUploading` becomes `false`
      addLoadingMsg(e?.detail?.file),
    ]);

    if (e.detail.action === 'FILE_ADDED') {
      let fileAlreadyUploaded = false;
      // Check if first file
      if (fd !== undefined) {
        fileAlreadyUploaded =
          filterToMatchingObjects([fileFromEvent], fd).length > 0;
      }
      if (fileAlreadyUploaded) return; // bail
      // Fall through to the main dispatch() call
    }

    if (e.detail.action === 'FILE_REMOVED') {
      // If element not found in array, that's likely a file with an
      // error which wasn't actually uploaded but is currently displayed.
      const idx = indexOfMatch(
        fd,
        // identifying properties from newly removed file
        pick(fileFromEvent, ['name', 'size']),
      );

      // check if there was an error associated with this file, if so remove
      setErrorsList(getErrorsForFiles(e, errorsList));

      setLocalFile(null);
      setUploadInProgress(false);

      // Use functional updates to ensure we're using the latest state
      setUploadArray(prevArray => {
        const baseArray = prevArray.length === 0 ? [...(fd || [])] : prevArray;
        const newArray = idx > -1 ? baseArray.toSpliced(idx, 1) : baseArray;
        pendingUpdate.current = newArray;
        return newArray;
      });
      return;
    }

    if (e.detail.action === 'FILE_UPDATED') {
      setLocalFile(null);
      // setUploadInProgress(true);

      let fileAlreadyUploaded = false;

      // Identify which items have changed and drop any that were replaced
      setUploadArray(prevArray => {
        const baseArray = prevArray.length === 0 ? [...(fd || [])] : prevArray;
        const newArray = filterToMatchingObjects(
          e.detail.state.map(el => el.file),
          baseArray,
        );

        fileAlreadyUploaded =
          filterToMatchingObjects([fileFromEvent], newArray).length > 0;

        pendingUpdate.current = newArray;
        return newArray;
      });

      if (fileAlreadyUploaded) return; // bail
      // With target file removed, fall through to the main dispatch() call
      // to upload the replacement
    }

    // Default behavior for when action is FILE_ADDED:
    dispatch(
      uploadFile(
        fileUploadUrl,
        formNumber,
        fileFromEvent,
        onFileUploaded,
        percent => updateProgress(percent),
      ),
    );
  };

  return (
    <>
      <VaFileInputMultiple
        {...mappedProps}
        errors={errorsListDisplay.map(e => e?.errorMessage)}
        value={localFile}
        onVaMultipleChange={handleVaChange}
      />
      {uploadInProgress ? (
        <VaProgressBar percent={progress} label="Uploading file" />
      ) : (
        <></>
      )}
    </>
  );
};

VaFileInputMultipleField.propTypes = {
  childrenProps: PropTypes.object.isRequired,
  uiOptions: PropTypes.object.isRequired,
  onVaChange: PropTypes.func,
};

export default VaFileInputMultipleField;
