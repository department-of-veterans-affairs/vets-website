import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import debounce from 'platform/utilities/data/debounce';
import { isEmpty } from 'lodash';
import {
  MISSING_PASSWORD_ERROR,
  MISSING_FILE,
  MISSING_ADDITIONAL_INFO,
} from '../validation';
import {
  useFileUpload,
  DEBOUNCE_WAIT,
  getFileError,
  simulateUploadMultiple,
} from './vaFileInputFieldHelpers';
import vaFileInputFieldMapping from './vaFileInputFieldMapping';

import { errorManager } from '../utilities/file/passwordErrorState';

const VaFileInputMultipleField = props => {
  const { uiOptions = {}, childrenProps } = props;
  const [encrypted, setEncrypted] = useState([]);
  const [errors, setErrors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [percentsUploaded, setPercentsUploaded] = useState([]);
  const [initPoll, setInitPoll] = useState(true);
  const dispatch = useDispatch();
  const { percentUploaded, handleUpload } = useFileUpload(
    uiOptions.fileUploadUrl,
    uiOptions.accept,
    uiOptions.formNumber,
    dispatch,
  );
  const componentRef = useRef(null);
  const mappedProps = vaFileInputFieldMapping(props);

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
    // 2. a file that is being replaced
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

  const handleFileProcessing = (uploadedFile, index) => {
    if (!uploadedFile || !uploadedFile.file) return;

    const _errors = [...errors];
    const _error = uploadedFile.errorMessage || null;
    _errors[index] = _error;
    setErrors(_errors);
    assignFileUploadToStore(uploadedFile, index);
  };

  const handleFileAdded = async (file, index, mockFormData) => {
    const { fileError, encryptedCheck } = await getFileError(file, uiOptions);
    const _errors = [...errors];

    if (fileError) {
      _errors[index] = fileError;
      setErrors(_errors);
      errorManager.setFileCheckError(index, true);
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

    // cypress test / skip the network call and its callbacks
    if (environment.isTest() && !environment.isUnitTest()) {
      childrenProps.onChange([mockFormData]);
      return;
    }

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

  const handleFileRemoved = _file => {
    const index = (childrenProps.formData || []).findIndex(
      file => file.name === _file.name && file.size === _file.size,
    );

    setErrors(removeOneFromArray(errors, index));
    errorManager.removeInstance(index);

    setEncrypted(removeOneFromArray(encrypted, index));
    setPercentsUploaded(removeOneFromArray(percentsUploaded, index));

    const formData = removeOneFromArray(childrenProps.formData, index);
    childrenProps.onChange(formData);
  };

  // upload after debounce
  const debouncePassword = useMemo(
    () =>
      debounce(DEBOUNCE_WAIT, ({ file, password }, index) => {
        if (password && password.length > 0) {
          errorManager.resetInstance(index);
          const _encrypted = [...encrypted];
          _encrypted[index] = null;
          setEncrypted(_encrypted);
          // eslint-disable-next-line no-unused-expressions
          uiOptions.skipUpload
            ? simulateUploadMultiple(
                setPercentsUploaded,
                percentsUploaded,
                index,
                childrenProps,
                file,
              )
            : handleUpload(file, handleFileProcessing, password, index);
        }
      }),
    [handleUpload],
  );

  const handleChange = e => {
    const { detail } = e;
    const { action, state, file, mockFormData } = detail;
    const findFileIndex = (_state, _file) => {
      return _state.findIndex(
        f => f.file.name === _file.name && f.file.size === _file.size,
      );
    };
    switch (action) {
      case 'FILE_ADDED': {
        const _currentIndex = state.length - 1;
        errorManager.setInternalFileInputErrors(_currentIndex, false);
        handleFileAdded(file, _currentIndex, mockFormData);
        setCurrentIndex(_currentIndex);
        break;
      }
      case 'FILE_UPDATED': {
        const index = findFileIndex(state, file);
        handleFileAdded(file, index);
        setCurrentIndex(index);
        break;
      }
      case 'PASSWORD_UPDATE': {
        const index = findFileIndex(state, file);
        setCurrentIndex(index);
        const passwordFile = state[index];
        debouncePassword(passwordFile, index);
        break;
      }
      case 'FILE_REMOVED':
        handleFileRemoved(file);
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
  };

  // get the password errors for any relevant instances
  const passwordErrors = errorManager.getPasswordInstances().map(instance => {
    return instance && instance.hasPasswordError()
      ? MISSING_PASSWORD_ERROR
      : null;
  });

  const resetVisualState = errors.map(error => (error ? true : null));
  return (
    <VaFileInputMultiple
      {...mappedProps}
      error={mappedProps.error}
      ref={componentRef}
      encrypted={encrypted}
      onVaMultipleChange={handleChange}
      onVaFileInputError={handleInternalFileInputError}
      errors={errors}
      resetVisualState={resetVisualState}
      percentUploaded={percentsUploaded}
      passwordErrors={passwordErrors}
      onVaSelect={handleAdditionalInput}
      maxFileSize={uiOptions.maxFileSize}
      minFileSize={uiOptions.minFileSize}
    >
      {mappedProps.additionalInput && (
        <div className="additional-input-container">
          {mappedProps.additionalInput()}
        </div>
      )}
    </VaFileInputMultiple>
  );
};

export default VaFileInputMultipleField;
