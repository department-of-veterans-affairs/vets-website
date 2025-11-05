import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import debounce from 'platform/utilities/data/debounce';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import vaFileInputFieldMapping from './vaFileInputFieldMapping';
import {
  useFileUpload,
  getFileError,
  DEBOUNCE_WAIT,
  simulateUploadSingle,
} from './vaFileInputFieldHelpers';
import passwordErrorState from '../utilities/file/passwordErrorState';

/**
 * Usage uiSchema:
 * ```
 * fileInput: {
 *   'ui:title': 'A file input',
 *   'ui:webComponentField': VaFileInput,
 *   'ui:hint': 'hint',
 *   'ui:errorMessages': {
 *     required: 'This is a custom error message.',
 *   },
 *   formNumber: '20-10206'
 *   fileUploadUrl: 'https://api.test.gov',
 *   'ui:options': {
 *     accept: '.pdf,.jpeg,.png',
 *     enableAnalytics: true,
 *     encrypted: true,
 *     maxFileSize: 1048576
 *   },
 * }
 * ```
 *
 * Usage schema:
 * ```
 * uploadedFile: {
 *   type: 'object',
 *    properties: {
 *       confirmationCode: {
 *         type: 'string',
 *       },
 *       isEncrypted: {
 *         type: 'boolean',
 *       },
 *       password: {
 *         type: 'string',
 *       },
 *       name: {
 *         type: 'string',
 *       },
 *       size: {
 *         type: 'integer',
 *       },
 *       fileType: {
 *         type: 'string',
 *       },
 *       warnings: {
 *         type: 'array',
 *         items: {
 *           type: 'string',
 *         },
 *       },
 *       additionalData: {
 *         type: 'object',
 *         properties: {},
 *       },
 *     },
 * },
 * ```
 
 
 * @param {WebComponentFieldProps} props */
const VaFileInputField = props => {
  const { uiOptions = {}, childrenProps } = props;
  const { formNumber } = uiOptions;
  const mappedProps = vaFileInputFieldMapping(props);
  const { accept, fileUploadUrl } = mappedProps;
  const dispatch = useDispatch();
  const [error, setError] = useState(mappedProps.error);
  const [fileWithPassword, setFileWithPassword] = useState(null);
  const { percentUploaded, handleUpload } = useFileUpload(
    fileUploadUrl,
    accept,
    formNumber,
    dispatch,
  );
  const [encrypted, setEncrypted] = useState(false);
  const [passwordErrorManager, setPasswordErrorManager] = useState(null);
  const [pendingPassword, setPendingPassword] = useState('');
  const [localPasswordError, setLocalPasswordError] = useState(null);
  // Instrumentation for tests: track last upload (file & password)
  const [lastUpload, setLastUpload] = useState(null);
  const [percent, setPercent] = useState(null);
  const _id = childrenProps.idSchema.$id;

  // only needed because sometimes we skip upload and simulate percent progress
  useEffect(
    () => {
      setPercent(percentUploaded);
    },
    [percentUploaded],
  );

  useEffect(
    () => {
      const instance = passwordErrorState.getInstance(_id);
      setPasswordErrorManager(instance);
      return () => {
        instance.reset();
      };
    },
    [_id],
  );

  const getErrorMessage = field => {
    let errorMessage = null;
    const errorArray = childrenProps.errorSchema[field]?.__errors;
    if (errorArray && errorArray.length > 0) {
      [errorMessage] = errorArray;
    }
    return errorMessage;
  };

  const additionalInputError = getErrorMessage('additionalData');
  const schemaPasswordError = getErrorMessage('isEncrypted');

  const assignFileUploadToStore = uploadedFile => {
    if (!uploadedFile) return;

    const { file, ...rest } = uploadedFile;

    const { name, size, type } = file;

    childrenProps.onChange({
      ...childrenProps.formData,
      ...rest,
      name,
      size,
      type,
      _id,
      // reset additionalData when adding a file
      additionalData: {},
    });
  };

  const handleFileProcessing = uploadedFile => {
    if (!uploadedFile || !uploadedFile.file) return;
    setError(uploadedFile.errorMessage);
    assignFileUploadToStore(uploadedFile);

    // If upload succeeded (no errorMessage), clear password state/UI
    if (!uploadedFile.errorMessage) {
      setEncrypted(false);
      setFileWithPassword(null);
      setPendingPassword('');
      setLocalPasswordError(null);
      if (passwordErrorManager) {
        passwordErrorManager.setHasPassword(true);
      }
    }
  };

  // upload after debounce
  const debouncePassword = useMemo(
    () =>
      debounce(DEBOUNCE_WAIT, password => {
        // Only update validation state as the user types; do NOT upload yet.
        if (fileWithPassword && passwordErrorManager) {
          passwordErrorManager.setHasPassword(password.length > 0);
          childrenProps.onChange({
            ...childrenProps.formData,
            _id,
          });
        }
      }),
    [passwordErrorManager, fileWithPassword, childrenProps, _id],
  );

  const handleVaChange = async e => {
    const fileFromEvent = e.detail.files[0];

    if (!fileFromEvent) {
      setError(mappedProps.error);
      childrenProps.onChange({});
      return;
    }

    const { fileError, encryptedCheck } = await getFileError(
      fileFromEvent,
      uiOptions,
    );

    if (fileError) {
      setError(fileError);
      childrenProps.onChange({});
      return;
    }

    // file ok
    setError(null);
    passwordErrorManager.setNeedsPassword(encryptedCheck);
    setEncrypted(encryptedCheck);

    // cypress test / skip the network call and its callbacks
    if (environment.isTest() && !environment.isUnitTest()) {
      childrenProps.onChange(e.detail.mockFormData);
      return;
    }

    if (uiOptions.skipUpload && !encryptedCheck) {
      simulateUploadSingle(setPercent, childrenProps.onChange, fileFromEvent);
      return;
    }

    // delay uploading for encrypted files until password is entered
    if (encryptedCheck) {
      setFileWithPassword(fileFromEvent);
      childrenProps.onChange({
        isEncrypted: encryptedCheck,
        _id,
      });
    } else {
      setLastUpload({ file: fileFromEvent, password: null });
      handleUpload(fileFromEvent, handleFileProcessing);
    }
  };

  const handleVaPasswordChange = e => {
    const { password } = e.detail;
    setPendingPassword(password || '');
    // Clear local password error feedback once user starts typing again
    if (localPasswordError) setLocalPasswordError(null);
    debouncePassword(password || '');
  };

  const handleAddPasswordClick = () => {
    if (!pendingPassword) {
      // Show a required error near the password field and focus stays there
      setLocalPasswordError('Please provide a password to decrypt this file');
      if (passwordErrorManager) {
        passwordErrorManager.setHasPassword(false);
      }
      // Trigger a lightweight change so validation messages can appear
      childrenProps.onChange({
        ...childrenProps.formData,
        _id,
      });
      return;
    }

    if (fileWithPassword) {
      // Mark that we now have a password and proceed with upload
      if (passwordErrorManager) {
        passwordErrorManager.setHasPassword(true);
      }
      childrenProps.onChange({
        ...childrenProps.formData,
        _id,
      });
      setLastUpload({ file: fileWithPassword, password: pendingPassword });
      // eslint-disable-next-line no-unused-expressions
      uiOptions.skipUpload
        ? simulateUploadSingle(
            setPercent,
            childrenProps.onChange,
            fileWithPassword,
          )
        : handleUpload(fileWithPassword, handleFileProcessing, pendingPassword);
    }
  };

  const handleAdditionalInput = e => {
    if (mappedProps.handleAdditionalInput) {
      const payload = mappedProps.handleAdditionalInput(e);
      childrenProps.onChange({
        _id,
        ...childrenProps.formData,
        additionalData: payload,
      });
    }
  };

  const handleInternalError = e => {
    const { error: _error } = e.detail;
    if (_error) {
      setError(_error);
    }
  };

  const _error = error || mappedProps.error;
  const fileHasBeenAdded = Boolean(
    childrenProps.formData.name && childrenProps.formData.name !== 'uploading',
  );
  const combinedPasswordError = localPasswordError || schemaPasswordError;

  // Test harness (non-production) to allow unit tests to drive internal logic
  if (uiOptions?.testHarness && typeof uiOptions.testHarness === 'function') {
    // Only invoke once per render cycle with current closures
    uiOptions.testHarness({
      triggerFile: file => handleVaChange({ detail: { files: [file] } }),
      triggerPassword: password =>
        handleVaPasswordChange({ detail: { password } }),
      clickAddPassword: handleAddPasswordClick,
      getState: () => ({
        encrypted,
        hasFileWithPassword: !!fileWithPassword,
        pendingPassword,
        localPasswordError,
        lastUpload,
      }),
    });
  }

  return (
    <VaFileInput
      {...mappedProps}
      error={_error}
      encrypted={encrypted}
      resetVisualState={!!_error}
      uploadedFile={mappedProps.uploadedFile}
      onVaFileInputError={handleInternalError}
      onVaChange={handleVaChange}
      onVaPasswordChange={handleVaPasswordChange}
      percentUploaded={percent || null}
      passwordError={combinedPasswordError}
    >
      {/* Show the confirmation button when awaiting an encrypted file's password */}
      {encrypted &&
        fileWithPassword && (
          <div className="vads-u-margin-top--2">
            <va-button
              class="vads-u-width--auto"
              text="Add password"
              onClick={handleAddPasswordClick}
              uswds
            />
          </div>
        )}
      <div className="additional-input-container">
        {fileHasBeenAdded &&
          mappedProps.additionalInput &&
          React.cloneElement(
            // clone element so we can attach listeners
            mappedProps.additionalInput(
              additionalInputError,
              childrenProps.formData.additionalData,
            ),
            {
              // attach other listeners as needed
              onVaChange: handleAdditionalInput,
              onVaSelect: handleAdditionalInput,
              onVaValueChange: handleAdditionalInput,
            },
          )}
      </div>
    </VaFileInput>
  );
};

VaFileInputField.propTypes = {
  childrenProps: PropTypes.object.isRequired,
  uiOptions: PropTypes.shape({
    maxFileSize: PropTypes.number,
    formNumber: PropTypes.string,
  }),
  onVaChange: PropTypes.func,
};

VaFileInputField.defaultProps = {
  uiOptions: {},
};

export default VaFileInputField;
