import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  standardFileChecks,
  FILE_TYPE_MISMATCH_ERROR,
} from 'platform/forms-system/src/js/utilities/file';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import debounce from 'platform/utilities/data/debounce';
import { isEmpty } from 'lodash';
import {
  MISSING_PASSWORD_ERROR,
  UNSUPPORTED_ENCRYPTED_FILE_ERROR,
  MISSING_FILE,
  UTF8_ENCODING_ERROR,
  MISSING_ADDITIONAL_INFO,
} from '../validation';
import { useFileUpload } from './vaFileInputFieldHelpers';
import vaFileInputFieldMapping from './vaFileInputFieldMapping';

import { errorManager } from '../utilities/file/passwordErrorState';

const VaFileInputMultipleField = props => {
  const { uiOptions = {}, childrenProps } = props;
  const [encrypted, setEncrypted] = useState([]);
  const [errors, setErrors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [percentsUploaded, setPercentsUploaded] = useState([]);
  const dispatch = useDispatch();
  const { percentUploaded, handleUpload } = useFileUpload(
    uiOptions.fileUploadUrl,
    '.pdf,.jpeg,.png',
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
      setErrors(new Array(childrenProps.formData.length).fill(null));
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

  // update the additional inputs with error or with data if prefill
  useEffect(
    () => {
      let id;
      if (
        componentRef.current &&
        componentRef.current.shadowRoot &&
        uiOptions.additionalInputUpdate
      ) {
        // using a delay because the slot content does not render immediatley
        // TODO: find a cleaner solution than setTimeout
        id = setTimeout(() => {
          errorManager.getPasswordInstances().forEach((_, index) => {
            const instance = componentRef.current.shadowRoot.getElementById(
              `instance-${index}`,
            );
            if (instance) {
              const slotContent = instance.shadowRoot
                .querySelector('slot')
                ?.assignedNodes()[0]?.firstElementChild;
              if (slotContent) {
                // component missing additional data and has been touched and instance not already in error state
                const file = childrenProps.formData[index];
                const _isEmpty =
                  !file || (file && isEmpty(file.additionalData));
                const error =
                  _isEmpty &&
                  index < errorManager.getLastTouched() &&
                  !instance.getAttribute('error')
                    ? MISSING_ADDITIONAL_INFO
                    : '';
                const additionalData = file?.additionalData || null;
                uiOptions.additionalInputUpdate(
                  slotContent,
                  error,
                  additionalData,
                );
              }
            }
          });
        }, 100);
      }
      return () => {
        clearTimeout(id);
      };
    },
    [childrenProps.formData, mappedProps.error],
  );

  // update errors array with missing file error that was set in validator
  useEffect(
    () => {
      if (mappedProps.error === MISSING_FILE) {
        const _errors = [...errors];
        _errors[0] = MISSING_FILE;
        setErrors(_errors);
      }
    },
    [mappedProps.error],
  );

  const assignFileUploadToStore = uploadedFile => {
    if (!uploadedFile) return;

    const { file, ...rest } = uploadedFile;

    const { name, size, type } = file;

    const newFile = {
      ...rest,
      name,
      size,
      type,
    };

    childrenProps.onChange([...childrenProps.formData, newFile]);
  };

  const handleFileProcessing = (uploadedFile, index) => {
    if (!uploadedFile || !uploadedFile.file) return;

    const _errors = [...errors];
    // if there is no back-end (e.g. mock-forms) don't set network errors that would prevent navigation
    if (!uiOptions.skipUpload) {
      _errors[index] = uploadedFile.errorMessage || null;
    } else {
      _errors[index] = null;
    }
    setErrors(_errors);
    assignFileUploadToStore(uploadedFile);
  };

  const handleFileAdded = async ({ file }, index, mockFormData) => {
    const checks = await standardFileChecks(file);
    const _errors = [...errors];
    if (!checks.checkTypeAndExtensionMatches) {
      _errors[index] = FILE_TYPE_MISMATCH_ERROR;
      setErrors(_errors);
      return;
    }
    if (!!checks.checkIsEncryptedPdf && uiOptions.disallowEncryptedPdfs) {
      _errors[index] = UNSUPPORTED_ENCRYPTED_FILE_ERROR;
      setErrors(_errors);
      return;
    }
    if (!checks.checkUTF8Encoding) {
      _errors[index] = UTF8_ENCODING_ERROR;
      setErrors(_errors);
      return;
    }

    _errors[index] = null;

    setErrors(_errors);
    const _encrypted = [...encrypted];
    _encrypted[index] = !!checks.checkIsEncryptedPdf;
    setEncrypted(_encrypted);

    // cypress test / skip the network call and its callbacks
    if (environment.isTest() && !environment.isUnitTest()) {
      childrenProps.onChange([...mockFormData]);
      return;
    }

    // this file not encrypted
    if (!checks.checkIsEncryptedPdf) {
      handleUpload(file, handleFileProcessing, null, index);
      errorManager.addPasswordInstance(index);
      // this file is encrypted
    } else {
      errorManager.addPasswordInstance(index, true);
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
      debounce(500, ({ file, password }, index) => {
        if (password.length > 0) {
          errorManager.resetInstance(index);
          handleUpload(file, handleFileProcessing, password, index);
        }
      }),
    [handleUpload],
  );

  const handleChange = e => {
    const { detail } = e;
    const { action, state, file, mockFormData } = detail;
    const findFileIndex = () =>
      state.findIndex(
        f => f.file.name === file.name && f.file.size === file.size,
      );
    const _file = state.at(-1);
    switch (action) {
      case 'FILE_ADDED': {
        const _currentIndex = state.length - 1;
        handleFileAdded(_file, _currentIndex, mockFormData);
        setCurrentIndex(_currentIndex);
        break;
      }
      case 'FILE_UPDATED': {
        const index = findFileIndex();
        handleFileAdded(_file, index);
        setCurrentIndex(index);
        break;
      }
      case 'PASSWORD_UPDATE': {
        const index = findFileIndex();
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

  const handleAdditionalInput = e => {
    // get the va-file-input instance from which event was emitted
    const [vaFileInput] = e
      .composedPath()
      .filter(el => el.tagName === 'VA-FILE-INPUT');

    // find the index of the instance
    const els = componentRef.current.shadowRoot.querySelectorAll(
      'va-file-input',
    );
    const index = Array.from(els).findIndex(el => el.id === vaFileInput.id);

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

  // get the password errors for any relevant instances
  const passwordErrors = errorManager.getPasswordInstances().map(instance => {
    return instance && instance.hasPasswordError()
      ? MISSING_PASSWORD_ERROR
      : null;
  });

  const resetVisualState = errors.map(error => (error ? true : null));

  return (
    <VaFileInputMultiple
      ref={componentRef}
      encrypted={encrypted}
      onVaMultipleChange={handleChange}
      errors={errors}
      resetVisualState={resetVisualState}
      percentUploaded={percentsUploaded}
      passwordErrors={passwordErrors}
      onVaSelect={handleAdditionalInput}
      maxFileSize={uiOptions.maxFileSize}
      min-file-size={uiOptions.minFileSize}
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
