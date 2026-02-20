import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isEmpty } from 'lodash';
import {
  MISSING_PASSWORD_ERROR,
  MISSING_FILE,
  MISSING_ADDITIONAL_INFO,
} from '../validation';
import {
  useFileUpload,
  getFileError,
  simulateUploadMultiple,
  getMockFileData,
  VaProgressUploadAnnounce,
} from './vaFileInputFieldHelpers';
import vaFileInputFieldMapping from './vaFileInputFieldMapping';

import { errorManager } from '../utilities/file/passwordErrorState';

const VaFileInputMultipleField = props => {
  const { uiOptions = {}, childrenProps } = props;
  const [encrypted, setEncrypted] = useState([]);
  const [errors, setErrors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [percentsUploaded, setPercentsUploaded] = useState([]);
  const [
    passwordSubmissionSuccessArray,
    setPasswordSubmissionSuccessArray,
  ] = useState([]);
  const [initPoll, setInitPoll] = useState(true);
  const dispatch = useDispatch();
  const mappedProps = vaFileInputFieldMapping(props);
  const { percentUploaded, handleUpload } = useFileUpload(
    uiOptions,
    mappedProps.accept,
    dispatch,
  );
  const componentRef = useRef(null);

  // if prefill, initialize values
  useEffect(() => {
    const doPrefill =
      Array.isArray(mappedProps.uploadedFiles) && componentRef.current;
    if (doPrefill) {
      const nulls = new Array(childrenProps.formData.length).fill(null);
      setErrors([...nulls]);
      setEncrypted([...nulls]);
      childrenProps.formData.forEach((_, i) =>
        errorManager.addPasswordInstance(i),
      );
      setCurrentIndex(childrenProps.formData.length - 1);
      componentRef.current.value = mappedProps.uploadedFiles;
    }
  }, []);

  // update the percent uploaded array
  useEffect(
    () => {
      const _percents = [...percentsUploaded];
      _percents[currentIndex] = percentUploaded;
      setPercentsUploaded(_percents);
    },
    [percentUploaded],
  );

  function getSlotContent() {
    const slot = componentRef.current?.shadowRoot
      ?.querySelector('va-file-input')
      ?.shadowRoot?.querySelector('slot');
    if (slot) {
      const [slotContent] =
        slot?.assignedElements?.({ flatten: true }) ||
        slot?.assignedNodes().filter(n => n.nodeType === 1);
      return !!slotContent;
    }
    return false;
  }

  // update the additional inputs with prefill data (if present)
  // set errors on additional inputs (if present)
  useEffect(
    () => {
      function updateAdditionalInputs() {
        childrenProps.formData.forEach((_, index) => {
          const instance = componentRef.current.shadowRoot.getElementById(
            `instance-${index}`,
          );
          if (instance) {
            const slot = instance.shadowRoot.querySelector('slot');
            if (!slot) return;
            const [slotContent] =
              slot?.assignedElements?.({ flatten: true }) ||
              slot?.assignedNodes().filter(n => n.nodeType === 1);
            if (slotContent) {
              setInitPoll(false);
              const file = childrenProps.formData[index];
              const _isEmpty = !file || (file && isEmpty(file.additionalData));
              // component missing additional data and has been touched and instance not already in error state
              const additionalInputError =
                _isEmpty &&
                index < errorManager.getLastTouched() &&
                !instance.getAttribute('error')
                  ? childrenProps?.uiSchema?.['ui:errorMessages']
                      ?.additionalInput || MISSING_ADDITIONAL_INFO
                  : '';
              const additionalData = file?.additionalData || null;
              uiOptions.additionalInputUpdate(
                slotContent.firstElementChild,
                additionalInputError,
                additionalData,
              );
            }
          }
        });
      }

      function sleep(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
      }

      // poll on load until slot content renders
      async function poll() {
        const WAIT = 50;
        const MAXLOOP = 2000 / WAIT;
        for (let attempt = 0; attempt < MAXLOOP; attempt++) {
          const ready = getSlotContent();
          if (ready) {
            updateAdditionalInputs();
            return;
          }
          // eslint-disable-next-line no-await-in-loop
          await sleep(WAIT);
        }
      }

      if (initPoll) {
        poll();
      } else {
        updateAdditionalInputs();
      }
    },

    [childrenProps.formData, mappedProps.error],
  );

  // update errors array with missing file error that was set in validator
  useEffect(
    () => {
      if (mappedProps.error === MISSING_FILE) {
        const _errors = [...errors];
        _errors[0] =
          childrenProps?.uiSchema?.['ui:errorMessages']?.required ||
          MISSING_FILE;
        setErrors(_errors);
      }
    },
    [mappedProps.error],
  );

  const assignFileUploadToStore = (uploadedFile, index) => {
    if (!uploadedFile) return;

    const { file, ...rest } = uploadedFile;

    const { name, size, type } = file;

    const newFile = {
      ...rest,
      name,
      size,
      type,
    };

    const existingFile = childrenProps.formData[index];
    // if existingFile is not null then either
    // 1. it is a placeholder for an encrypted file where additional info was added before the password OR
    // 2. it is a file that is being replaced
    let files;
    if (existingFile) {
      if (encrypted[index] && existingFile.additionalData) {
        newFile.additionalData = existingFile.additionalData;
      }
      files = [...childrenProps.formData];
      files[index] = newFile;
    } else {
      files = [...childrenProps.formData, newFile];
    }
    childrenProps.onChange(files);
  };

  // set errors and related statuses based on upload result
  const handleUploadErrors = ({ errorMessage, isEncrypted }, index) => {
    const _errors = [...errors];
    const _error = errorMessage || null;
    _errors[index] = _error;
    setErrors(_errors);
    // file was encrypted
    if (isEncrypted) {
      const _passwordSubmissionSuccessArray = [
        ...passwordSubmissionSuccessArray,
      ];
      _passwordSubmissionSuccessArray[index] = !errorMessage;
      setPasswordSubmissionSuccessArray(_passwordSubmissionSuccessArray);
      // file was successfully decrypted
      // if (!errorMessage) {
      //   passwordErrorManager.setHasPassword(true);
      //   passwordError = null;
      // }
    }
  };

  const handleFileProcessing = (uploadedFile, index) => {
    if (!uploadedFile || !uploadedFile.file) return;
    handleUploadErrors(uploadedFile, index);
    assignFileUploadToStore(uploadedFile, index);
  };

  const handleFileAdded = async (file, index) => {
    const { fileError, encryptedCheck } = await getFileError(
      file,
      uiOptions,
      childrenProps.formData,
    );
    const _errors = [...errors];

    if (fileError) {
      _errors[index] = fileError;
      setErrors(_errors);
      errorManager.setFileCheckError(index, true);
      const files = [...childrenProps.formData];
      // add placeholder file in case another file added before user resolves this error
      files[index] = {};
      childrenProps.onChange(files);
      return;
    }

    // file ok
    errorManager.setFileCheckError(index, false);
    _errors[index] = null;
    setErrors(_errors);

    const _encrypted = [...encrypted];
    _encrypted[index] = encryptedCheck;
    setEncrypted(_encrypted);

    // keep track of potential missisng password errors
    errorManager.addPasswordInstance(index, encryptedCheck);

    // mock form has no back-end but we want to add files and simulate progress of upload
    if (uiOptions.skipUpload && !encryptedCheck) {
      simulateUploadMultiple(
        setPercentsUploaded,
        percentsUploaded,
        index,
        childrenProps,
        file,
      );
      return;
    }

    // this file not encrypted - upload right now
    if (!encryptedCheck) {
      handleUpload(file, handleFileProcessing, null, index);
    }
  };

  function removeOneFromArray(array, index) {
    return [...array].toSpliced(index, 1);
  }

  const handleFileRemoved = index => {
    setErrors(removeOneFromArray(errors, index));
    errorManager.setFileCheckError(index, false);
    errorManager.setInternalFileInputErrors(index, false);
    errorManager.removeInstance(index);

    setEncrypted(removeOneFromArray(encrypted, index));
    setPercentsUploaded(removeOneFromArray(percentsUploaded, index));

    const formData = removeOneFromArray(childrenProps.formData, index);
    childrenProps.onChange(formData);
  };

  const handleChange = e => {
    const { detail } = e;
    const { action, state, file, index } = detail;
    switch (action) {
      case 'FILE_ADDED': {
        errorManager.setInternalFileInputErrors(index, false);
        handleFileAdded(file, index);
        setCurrentIndex(index);
        break;
      }
      case 'FILE_UPDATED': {
        handleFileAdded(file, index);
        setCurrentIndex(index);
        break;
      }
      case 'PASSWORD_UPDATE': {
        // reset in case user is replacing one encrypted file with another
        const _passwordSubmissionSuccessArray = [
          ...passwordSubmissionSuccessArray,
        ];
        _passwordSubmissionSuccessArray[index] = null;
        setPasswordSubmissionSuccessArray(_passwordSubmissionSuccessArray);
        setCurrentIndex(index);
        const { file: passwordFile, password } = state[index];
        errorManager.resetInstance(index);
        if (uiOptions.skipUpload) {
          const formData = [
            ...childrenProps.formData,
            getMockFileData(passwordFile),
          ];
          setTimeout(() => {
            childrenProps.onChange(formData);
            handleUploadErrors(
              { errorMessage: null, isEncrypted: true },
              index,
            );
          }, 500);
        } else {
          handleUpload(passwordFile, handleFileProcessing, password, index);
        }
        break;
      }
      case 'FILE_REMOVED':
        handleFileRemoved(index);
        break;
      default:
        break;
    }
  };

  // get the va-file-input instances
  function getFileInputInstanceIndex(e) {
    const [vaFileInput] = e
      .composedPath()
      .filter(el => el.tagName === 'VA-FILE-INPUT');

    let els = [];
    if (componentRef.current?.shadowRoot) {
      els = Array.from(
        componentRef.current.shadowRoot.querySelectorAll('va-file-input'),
      );
    }
    return els.findIndex(el => el.id === vaFileInput.id);
  }

  const handleAdditionalInput = e => {
    const index = getFileInputInstanceIndex(e);
    // update the formData
    if (mappedProps.handleAdditionalInput) {
      const payload = mappedProps.handleAdditionalInput(e);
      const updatedFormData = [...(childrenProps.formData || [])];
      updatedFormData[index] = {
        ...updatedFormData[index],
        additionalData: payload,
      };

      childrenProps.onChange(updatedFormData);
    }
  };

  const handleInternalFileInputError = e => {
    const index = getFileInputInstanceIndex(e);
    errorManager.setInternalFileInputErrors(index, true);
    const _errors = [...errors];
    _errors[index] = e.detail.error;
    setErrors(_errors);
    const files = [...childrenProps.formData];
    // add placeholder file
    files[index] = {};
    childrenProps.onChange(files);
  };

  // get the password errors for any relevant instances
  const passwordErrors = errorManager.getPasswordInstances().map(instance => {
    return instance && instance.hasPasswordError()
      ? MISSING_PASSWORD_ERROR
      : null;
  });

  const slotFieldIndexes = errors
    .map((error, i) => (error ? null : i))
    .filter(i => i !== null);

  return (
    <>
      <VaProgressUploadAnnounce
        uploading={percentsUploaded.some(percent => !!percent)}
      />
      <VaFileInputMultiple
        data-dd-privacy="mask"
        {...mappedProps}
        error={mappedProps.error}
        ref={componentRef}
        encrypted={encrypted}
        onVaMultipleChange={handleChange}
        onVaFileInputError={handleInternalFileInputError}
        errors={errors}
        passwordSubmissionSuccessList={passwordSubmissionSuccessArray}
        percentUploaded={percentsUploaded}
        passwordErrors={passwordErrors}
        onVaSelect={handleAdditionalInput}
        slotFieldIndexes={slotFieldIndexes}
      >
        {mappedProps.additionalInput && (
          <div className="additional-input-container">
            {mappedProps.additionalInput({
              labels: uiOptions.additionalInputLabels,
            })}
          </div>
        )}
      </VaFileInputMultiple>
    </>
  );
};

export default VaFileInputMultipleField;
