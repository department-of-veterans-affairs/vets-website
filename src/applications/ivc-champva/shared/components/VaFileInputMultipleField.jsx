import React from 'react';
import PropTypes from 'prop-types';
import vaFileInputFieldMapping from 'platform/forms-system/src/js/web-component-fields/vaFileInputFieldMapping';
import FileInputControl from './fileUploadsV3/FileInputControl';
import FileUploadProgress from './fileUploadsV3/FileUploadProgress';
import { useFileUploadState } from '../hooks/useFileUpload';

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

  // Constant message for incomplete uploads
  const incompleteUploadMsg = 'File not finished uploading - please wait';

  // Use custom hook to manage file upload state and actions
  const {
    errorsListDisplay,
    localFile,
    uploadInProgress,
    progress,
    handleVaChange,
  } = useFileUploadState(
    {
      ...props,
      mappedProps,
    },
    incompleteUploadMsg,
  );

  return (
    <div data-testid="va-file-input-multiple-field">
      {/* The actual VaFileInputMultiple is contained in this */}
      <FileInputControl
        mappedProps={mappedProps}
        errors={errorsListDisplay?.map(e => e?.errorMessage)}
        value={localFile}
        onChange={handleVaChange}
      />
      {/* Progress bar used while file is uploading. Split out for ease of testing. */}
      <FileUploadProgress
        percent={progress}
        isUploading={uploadInProgress}
        label="Uploading file"
      />
    </div>
  );
};

VaFileInputMultipleField.propTypes = {
  childrenProps: PropTypes.object.isRequired,
  uiOptions: PropTypes.object.isRequired,
  onVaChange: PropTypes.func,
};

export default VaFileInputMultipleField;
