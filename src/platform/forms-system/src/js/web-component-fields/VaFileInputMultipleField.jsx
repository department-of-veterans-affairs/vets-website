import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  standardFileChecks,
  FILE_TYPE_MISMATCH_ERROR,
} from 'platform/forms-system/src/js/utilities/file';
import debounce from 'platform/utilities/data/debounce';
import { isEmpty } from 'lodash';
import {
  // MISSING_PASSWORD_ERROR,
  UNSUPPORTED_ENCRYPTED_FILE_ERROR,
} from '../validation';
import { useFileUpload } from './vaFileInputFieldHelpers';
import vaFileInputFieldMapping from './vaFileInputFieldMapping';

import { errorManager } from '../utilities/file/passwordErrorState';

const VaFileInputMultipleField = props => {
  const { uiOptions = {}, childrenProps } = props;
  const [encrypted, setEncrypted] = useState([]);
  const [errors, setErrors] = useState([]);
  const [resetVisualState, setResetVisualState] = useState([]);
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

  useEffect(
    () => {
      const _percents = [...percentsUploaded];
      _percents[currentIndex] = percentUploaded;
      setPercentsUploaded(_percents);
    },
    [percentUploaded],
  );

  // keep the resetVisualState array in sync with error arrray
  useEffect(
    () => {
      const _resetValues = errors.map(error => !!error);
      setResetVisualState(_resetValues);
    },
    [errors],
  );

  // update the additional inputs with error or with data if prefill
  useEffect(
    () => {
      if (componentRef.current) {
        childrenProps.formData.forEach((file, i) => {
          if (uiOptions.additionalInputUpdate) {
            const instance = componentRef.current.shadowRoot.getElementById(
              `instance-${i}`,
            );
            // if instance has an error the additional input is not shown
            if (!instance.getAttribute('error')) {
              const slotContent = instance.shadowRoot
                .querySelector('slot')
                .assignedNodes()[0].firstElementChild;
              // component missing additional data
              const error = isEmpty(file.additionalData)
                ? 'This field required'
                : '';
              uiOptions.additionalInputUpdate(
                slotContent,
                error,
                file.additionalData,
              );
            }
          }
        });
      }
    },
    [childrenProps.formData],
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

  const handleFileProcessing = uploadedFile => {
    if (!uploadedFile || !uploadedFile.file) return;

    // if there is no back-end (e.g. mock-forms) don't set network errors that would prevent navigation
    if (!uiOptions.skipUpload) {
      const _errors = [...errors];
      _errors[currentIndex] = uploadedFile.errorMessage;
      setErrors(_errors);
    }

    assignFileUploadToStore(uploadedFile);
  };

  const handleFileAdded = async ({ file }) => {
    const checks = await standardFileChecks(file);
    if (!checks.checkTypeAndExtensionMatches) {
      setErrors(prev => [...prev, FILE_TYPE_MISMATCH_ERROR]);
      setResetVisualState(prev => [...prev, true]);
      childrenProps.onChange([]);
      return;
    }

    if (!!checks.checkIsEncryptedPdf && uiOptions.disallowEncryptedPdfs) {
      setErrors(prev => [...prev, UNSUPPORTED_ENCRYPTED_FILE_ERROR]);
      setResetVisualState(prev => [...prev, true]);
      childrenProps.onChange([]);
      return;
    }

    setErrors(prev => [...prev, null]);
    setEncrypted(prev => [...prev, !!checks.checkIsEncryptedPdf]);

    if (!checks.checkIsEncryptedPdf) {
      handleUpload(file, handleFileProcessing);
      errorManager.addPasswordInstance();
    } else {
      errorManager.addPasswordInstance(true);
    }
  };

  function removeOneFromArray(array, index) {
    return [...array].toSpliced(index, 1);
  }

  const handleFileRemoved = _file => {
    const index = childrenProps.formData.indexOf(
      file =>
        file.lastModified === _file.lastModified &&
        file.name === _file.name &&
        file.size === _file.size,
    );

    setErrors(removeOneFromArray(errors, index));
    setResetVisualState(removeOneFromArray(resetVisualState, index));
    errorManager.removePasswordInstance(index);
    setEncrypted(removeOneFromArray(encrypted, index));
    setPercentsUploaded(removeOneFromArray(percentsUploaded, index));

    const formData = removeOneFromArray(childrenProps.formData, index);
    childrenProps.onChange(formData);
  };

  // upload after debounce
  const debouncePassword = useMemo(
    () =>
      debounce(1000, ({ file, password }, index) => {
        if (password.length > 0) {
          errorManager.setHasPassword(index, true);
          handleUpload(file, handleFileProcessing, password);
        }
      }),
    [],
  );

  const handleChange = e => {
    const { detail } = e;
    const { action, state, file } = detail;
    if (state.length > 0) {
      const _file = state.at(-1);
      switch (action) {
        case 'FILE_ADDED':
          handleFileAdded(_file);
          setCurrentIndex(state.length - 1);
          break;
        case 'PASSWORD_UPDATE': {
          const index = state.findIndex(f => {
            return (
              f.file.lastModified === _file.file.lastModified &&
              f.file.name === _file.file.name &&
              f.file.size === _file.file.size
            );
          });
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
      ? 'Encrypted files require a password'
      : null;
  });

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
