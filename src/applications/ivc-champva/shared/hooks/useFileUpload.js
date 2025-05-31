import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { pick } from 'lodash';
import { uploadScannedForm as uploadFile } from 'platform/forms-system/src/js/web-component-fields/vaFileInputFieldHelpers';
import {
  getErrorsForFiles,
  addLoadingMsg,
  filterToMatchingObjects,
  indexOfMatch,
  createFileObject,
} from '../utils/fileInputUtils';

/**
 * Custom hook to manage file upload state and actions for the v3
 * VaFileInputMultiple component
 * @param {Object} props Component props
 * @param {String} incompleteUploadMsg Message to display during upload
 * @returns {Object} State and handlers for file uploads
 */
export function useFileUploadState(props, incompleteUploadMsg) {
  const dispatch = useDispatch();
  const [errorsList, setErrorsList] = useState([]);
  const [errorsListDisplay, setErrorsListDisplay] = useState([]);
  const [latestEvent, setLatestEvent] = useState(undefined);
  const [uploadArray, setUploadArray] = useState([]);
  const [localFile, setLocalFile] = useState(null);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const pendingUpdate = useRef(null);

  // Memoize derived values from props to prevent unnecessary re-renders
  const formNumber = useMemo(() => props?.uiOptions?.formNumber, [
    props?.uiOptions,
  ]);
  const mappedProps = useMemo(() => props.mappedProps, [props.mappedProps]);
  const fileUploadUrl = useMemo(() => mappedProps?.fileUploadUrl, [
    mappedProps,
  ]);

  // Handles showing an error while a file is uploading - using functional updates to avoid dependency on errorsList
  useEffect(
    () => {
      if (uploadInProgress === false) {
        setErrorsList(prevErrors =>
          prevErrors.filter(e => e?.errorMessage !== incompleteUploadMsg),
        );
      }
    },
    [uploadInProgress, incompleteUploadMsg],
  );

  // Use a ref for formData to avoid unnecessary re-renders
  const formDataRef = useRef(props.childrenProps.formData);

  // Update ref when formData changes
  useEffect(
    () => {
      formDataRef.current = props.childrenProps.formData;
    },
    [props.childrenProps.formData],
  );

  useEffect(
    () => {
      if (latestEvent === undefined) return;
      // Use a ref to compare previous and current errorsList to avoid unnecessary updates
      const errorsToDisplay = getErrorsForFiles(latestEvent, errorsList);
      if (
        JSON.stringify(errorsToDisplay) !== JSON.stringify(errorsListDisplay)
      ) {
        setErrorsListDisplay(errorsToDisplay);
      }
    },
    [latestEvent, errorsList, errorsListDisplay],
  );

  useEffect(
    () => {
      // Since the multi-file input doesn't "remember" the thumbnails of
      // uploaded files when you navigate away and back, this re-produces them
      // by creating File objects from the files stored in the formData object.
      const fd = formDataRef.current;
      if (fd?.length === 0 || fd?.length === undefined) return;

      const fetchFile = async () => {
        try {
          const representations = await Promise.all(
            fd.map(async el => {
              const response = await fetch(el?.localFilePath);
              const blob = await response.blob();
              return new File([blob], el?.name, { type: el.type });
            }),
          );
          setLocalFile(representations);
        } catch (error) {
          // Log error but don't update state
          // eslint-disable-next-line no-console
          console.error('Error fetching files:', error);
        }
      };

      fetchFile();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Run only once
  );

  // This useEffect prevents the "Cannot update a component while rendering a different component" warning
  useEffect(
    () => {
      if (pendingUpdate.current !== null) {
        props.childrenProps.onChange(pendingUpdate.current);
        pendingUpdate.current = null;
      }
    },
    [props.childrenProps, uploadArray],
  );

  const updateProgress = useCallback(percent => {
    setUploadInProgress(true);
    setProgress(percent);
  }, []);

  const onFileUploaded = useCallback(
    async uploadedFile => {
      if (uploadedFile.errorMessage) {
        setErrorsList(prevErrors => [...prevErrors, uploadedFile]);
        setUploadInProgress(false);
        return;
      }

      if (uploadedFile.file) {
        const fileObj = createFileObject(uploadedFile);

        setUploadArray(prevArray => {
          const fd = formDataRef.current;
          const baseArray =
            prevArray.length === 0 ? [...(fd || [])] : prevArray;
          const newArray = [...baseArray, fileObj];
          pendingUpdate.current = newArray;
          return newArray;
        });

        setLocalFile(uploadedFile.file); // for thumbnail on nav back
        setUploadInProgress(false);
      }
    },
    [], // No external dependencies needed since we use formDataRef
  );

  const uploadFileAction = useCallback(
    (fileUploadUrl_, formNumber_, file, onSuccess, onProgress) => {
      return dispatch(
        uploadFile(fileUploadUrl_, formNumber_, file, onSuccess, onProgress),
      );
    },
    [dispatch],
  );

  const handleVaChange = useCallback(
    e => {
      setLatestEvent(e);
      const fd = formDataRef.current;
      const fileFromEvent = e.detail.file;

      if (e.detail.action === 'FILE_REMOVED') {
        // If element not found in array, that's likely a file with an
        // error which wasn't actually uploaded but is currently displayed.
        const idx = indexOfMatch(
          fd,
          // identifying properties from newly removed file
          pick(fileFromEvent, ['name', 'size']),
        );

        // check if there was an error associated with this file, if so remove
        setErrorsList(prevErrors => getErrorsForFiles(e, prevErrors));

        setLocalFile(null);
        setUploadInProgress(false);

        // Use functional updates to ensure we're using the latest state
        setUploadArray(prevArray => {
          const baseArray =
            prevArray.length === 0 ? [...(fd || [])] : prevArray;
          const newArray =
            idx > -1
              ? [...baseArray.slice(0, idx), ...baseArray.slice(idx + 1)]
              : baseArray;
          pendingUpdate.current = newArray;
          return newArray;
        });
        return;
      }

      if (e.detail.action === 'FILE_UPDATED') {
        setLocalFile(null);

        let fileAlreadyUploaded = false;

        // Use functional updates here too
        setUploadArray(prevArray => {
          const baseArray =
            prevArray.length === 0 ? [...(fd || [])] : prevArray;
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
      }

      if (e.detail.action === 'FILE_ADDED') {
        let fileAlreadyUploaded = false;
        if (fd !== undefined) {
          fileAlreadyUploaded =
            filterToMatchingObjects([fileFromEvent], fd).length > 0;
        }
        if (fileAlreadyUploaded) return;
      }

      // At this point, we're going to attempt an upload
      // The upload progress indicator will be shown when updateProgress is called

      // Upload the file - note we don't add the temporary error message here
      uploadFileAction(
        fileUploadUrl,
        formNumber,
        fileFromEvent,
        onFileUploaded,
        percent => {
          // This is called when upload actually starts and reports progress
          // Now we add the temporary message about upload in progress
          setErrorsList(prevErrors => {
            // Check if we already have this message to avoid duplicates
            const hasLoadingMsg = prevErrors.some(
              err =>
                err?.name === fileFromEvent.name &&
                err?.errorMessage === incompleteUploadMsg,
            );

            if (hasLoadingMsg) return prevErrors;

            return [
              ...prevErrors,
              addLoadingMsg(fileFromEvent, incompleteUploadMsg),
            ];
          });
          updateProgress(percent);
        },
      );
    },
    [
      fileUploadUrl,
      formNumber,
      incompleteUploadMsg,
      onFileUploaded,
      updateProgress,
      uploadFileAction,
    ],
  );

  return {
    errorsList,
    setErrorsList,
    errorsListDisplay,
    latestEvent,
    uploadArray,
    localFile,
    uploadInProgress,
    progress,
    handleVaChange,
  };
}
