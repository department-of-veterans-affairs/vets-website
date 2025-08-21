import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import debounce from 'platform/utilities/data/debounce';
import {
  standardFileChecks,
  FILE_TYPE_MISMATCH_ERROR,
} from 'platform/forms-system/src/js/utilities/file';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  UNSUPPORTED_ENCRYPTED_FILE_ERROR,
  UTF8_ENCODING_ERROR,
} from '../validation';
import vaFileInputFieldMapping from './vaFileInputFieldMapping';
import { useFileUpload } from './vaFileInputFieldHelpers';

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
  const { accept } = mappedProps;
  const dispatch = useDispatch();
  const [error, setError] = useState(mappedProps.error);
  const [fileWithPassword, setFileWithPassword] = useState(null);
  const { percentUploaded, handleUpload } = useFileUpload(
    uiOptions.fileUploadUrl,
    accept,
    formNumber,
    dispatch,
  );
  const [encrypted, setEncrypted] = useState(false);
  const [passwordErrorManager, setPasswordErrorManager] = useState(null);
  const _id = childrenProps.idSchema.$id;

  useEffect(() => {
    const instance = passwordErrorState.getInstance(_id);
    setPasswordErrorManager(instance);
    return () => {
      instance.reset();
    };
  }, []);

  const getErrorMessage = field => {
    let errorMessage = null;
    const errorArray = childrenProps.errorSchema[field].__errors;
    if (errorArray && errorArray.length > 0) {
      errorMessage = errorArray[0];
    }
    return errorMessage;
  };

  const additionalInputError = getErrorMessage('additionalData');
  let passwordError = getErrorMessage('isEncrypted');

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
    });
  };

  const handleFileProcessing = uploadedFile => {
    if (!uploadedFile || !uploadedFile.file) return;

    // if there is no back-end (e.g. mock-forms) don't set network errors that would prevent navigation
    if (!uiOptions.skipUpload) {
      setError(uploadedFile.errorMessage);
    }

    assignFileUploadToStore(uploadedFile);
  };

  // upload after debounce
  const debouncePassword = useMemo(
    () =>
      debounce(500, password => {
        if (fileWithPassword) {
          passwordErrorManager.setHasPassword(password.length > 0);
          childrenProps.onChange({
            ...childrenProps.formData,
            _id,
          });
          passwordError = null;
          handleUpload(fileWithPassword, handleFileProcessing, password);
        }
      }),
    [handleUpload],
  );

  const handleVaChange = async e => {
    const fileFromEvent = e.detail.files[0];

    if (!fileFromEvent) {
      setError(mappedProps.error);
      childrenProps.onChange({});
      return;
    }

    const checks = await standardFileChecks(fileFromEvent);
    let fileCheckError = null;
    if (!checks.checkTypeAndExtensionMatches) {
      fileCheckError = FILE_TYPE_MISMATCH_ERROR;
    }

    if (!!checks.checkIsEncryptedPdf && uiOptions.disallowEncryptedPdfs) {
      fileCheckError = UNSUPPORTED_ENCRYPTED_FILE_ERROR;
    }

    if (!checks.checkUTF8Encoding) {
      fileCheckError = UTF8_ENCODING_ERROR;
    }

    if (fileCheckError) {
      setError(fileCheckError);
      childrenProps.onChange({});
      return;
    }

    passwordErrorManager.setNeedsPassword(!!checks.checkIsEncryptedPdf);
    setEncrypted(!!checks.checkIsEncryptedPdf);

    childrenProps.onChange({
      ...childrenProps.formData,
      _id,
      name: 'uploading',
    });

    // cypress test / skip the network call and its callbacks
    if (environment.isTest() && !environment.isUnitTest()) {
      childrenProps.onChange(e.detail.mockFormData);
      // delay uploading for encrypted files until password is entered
    } else if (checks.checkIsEncryptedPdf) {
      setFileWithPassword(fileFromEvent);
    } else {
      handleUpload(fileFromEvent, handleFileProcessing);
    }
  };

  const handleVaPasswordChange = e => {
    const { password } = e.detail;
    debouncePassword(password);
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
  const fileHasBeenAdded =
    (childrenProps.formData.name &&
      childrenProps.formData.name !== 'uploading') ||
    fileWithPassword;
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
      percentUploaded={percentUploaded || null}
      passwordError={passwordError}
    >
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
