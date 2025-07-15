import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { VaFileInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import debounce from 'platform/utilities/data/debounce';
import {
  readAndCheckFile,
  checkIsEncryptedPdf,
} from 'platform/forms-system/src/js/utilities/file';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import vaFileInputFieldMapping from './vaFileInputFieldMapping';
import { uploadScannedForm } from './vaFileInputFieldHelpers';

import passwordErrorState from '../utilities/file/errorState';

const useFileUpload = (fileUploadUrl, accept, formNumber, dispatch) => {
  const [isUploading, setIsUploading] = useState(false);
  const [percentUploaded, setPercentUploaded] = useState(null);

  const uploadFile = (file, onSuccess, password = null) => {
    setIsUploading(true);

    const onFileUploaded = uploadedFile => {
      setIsUploading(false);
      setPercentUploaded(null);
      if (onSuccess) onSuccess(uploadedFile);
    };

    const onFileUploading = percent => {
      setPercentUploaded(percent);
      setIsUploading(true);
    };

    dispatch(
      uploadScannedForm(
        fileUploadUrl,
        formNumber,
        file,
        onFileUploaded,
        onFileUploading,
        accept,
        password,
      ),
    );
  };

  return { isUploading, percentUploaded, uploadFile };
};

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
  const { percentUploaded, uploadFile } = useFileUpload(
    uiOptions.fileUploadUrl,
    accept,
    formNumber,
    dispatch,
  );
  const [encrypted, setEncrypted] = useState(false);

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
  const debouncePassword = useMemo(() =>
    debounce(500, password => {
      if (fileWithPassword) {
        passwordErrorState.setHasPassword(password.length > 0);
        childrenProps.onChange({
          ...childrenProps.formData,
          hasPasswordError: false,
        });
        passwordError = null;
        uploadFile(fileWithPassword, handleFileProcessing, password);
      }
    }),
  );

  const handleVaChange = async e => {
    const fileFromEvent = e.detail.files[0];

    if (!fileFromEvent) {
      setError(mappedProps.error);
      childrenProps.onChange({});
      return;
    }

    let _encrypted = false;
    // set encrypted state
    if (fileFromEvent && fileFromEvent?.type === 'application/pdf') {
      const result = await readAndCheckFile(fileFromEvent, {
        checkIsEncryptedPdf,
      });
      _encrypted = result.checkIsEncryptedPdf;
      passwordErrorState.setNeedsPassword(_encrypted);
      setEncrypted(_encrypted);
    } else {
      passwordErrorState.setNeedsPassword(false);
    }

    childrenProps.onChange({
      ...childrenProps.formData,
      name: 'uploading',
    });

    // cypress test / skip the network call and its callbacks
    if (environment.isTest() && !environment.isUnitTest()) {
      handleFileProcessing(fileFromEvent);
      // delay uploading for encrypted files until password is entered
    } else if (_encrypted) {
      setFileWithPassword(fileFromEvent);
    } else {
      uploadFile(fileFromEvent, handleFileProcessing);
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
        ...childrenProps.formData,
        additionalData: payload,
        hasAdditionalInputError: false,
      });
    }
  };

  const _error = error || mappedProps.error;
  return (
    <VaFileInput
      {...mappedProps}
      error={_error}
      encrypted={encrypted}
      resetVisualState={!!_error}
      uploadedFile={mappedProps.uploadedFile}
      onVaChange={handleVaChange}
      onVaPasswordChange={handleVaPasswordChange}
      percentUploaded={percentUploaded || null}
      passwordError={passwordError}
    >
      <div className="additional-input-container">
        {mappedProps.additionalInput &&
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
