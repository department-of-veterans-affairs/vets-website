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

  // update the additional inputs with prefill data and/or set errors on additional inputs
  useEffect(
    () => {
      // using a delay because the slot content does not render immediatley
      // TODO: find a cleaner solution than setTimeout
      const id = setTimeout(() => {
        if (
          componentRef.current &&
          componentRef.current.shadowRoot &&
          uiOptions.additionalInputUpdate
        ) {
          childrenProps.formData.forEach((_, index) => {
            const instance = componentRef.current.shadowRoot.getElementById(
              `instance-${index}`,
            );
            if (instance) {
              const slotContent = instance.shadowRoot
                .querySelector('slot')
                ?.assignedNodes()[0]?.firstElementChild;
              if (slotContent) {
                const file = childrenProps.formData[index];
                const _isEmpty =
                  !file || (file && isEmpty(file.additionalData));
                // component missing additional data and has been touched and instance not already in error state
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
        }
      }, 150);

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

    const encryptedFile = childrenProps.formData[index];
    // check to see if we are adding an encrypted pdf
    // where the additional info was added before the password
    let files;
    if (encryptedFile?.additionalData) {
      newFile.additionalData = encryptedFile.additionalData;
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
    // if there is no back-end (e.g. mock-forms) don't set network errors that would prevent navigation
    const _error = uiOptions.skipUpload
      ? null
      : uploadedFile.errorMessage || null;
    _errors[index] = _error;
    setErrors(_errors);
    assignFileUploadToStore(uploadedFile, index);
  };

  const handleFileAdded = async ({ file }, index, mockFormData) => {
    const checks = await standardFileChecks(file);
    let fileCheckError;
    if (!checks.checkTypeAndExtensionMatches) {
      fileCheckError = FILE_TYPE_MISMATCH_ERROR;
    }

    if (!!checks.checkIsEncryptedPdf && uiOptions.disallowEncryptedPdfs) {
      fileCheckError = UNSUPPORTED_ENCRYPTED_FILE_ERROR;
    }

    if (!checks.checkUTF8Encoding) {
      fileCheckError = UTF8_ENCODING_ERROR;
    }

    const _errors = [...errors];
    if (fileCheckError) {
      _errors[index] = fileCheckError;
      setErrors(_errors);
      errorManager.setFileCheckError(index, true);
      return;
    }

    // file ok
    errorManager.setFileCheckError(index, false);
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

    // keep track of potential missisng password errors
    errorManager.addPasswordInstance(index, !!checks.checkIsEncryptedPdf);

    // this file not encrypted - upload right now
    if (!checks.checkIsEncryptedPdf) {
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
        errorManager.setInternalFileInputErrors(_currentIndex, false);
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
