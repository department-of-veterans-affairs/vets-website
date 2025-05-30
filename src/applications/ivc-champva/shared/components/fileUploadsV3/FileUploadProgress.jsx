import React from 'react';
import PropTypes from 'prop-types';
import { VaProgressBar } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Wrapper around VaProgressBar with a data-testid set.
 */
const FileUploadProgress = ({
  percent,
  isUploading,
  label = 'Uploading file',
}) => {
  if (!isUploading) return null;

  return (
    <VaProgressBar
      percent={percent}
      label={label}
      data-testid="file-upload-progress"
    />
  );
};

FileUploadProgress.propTypes = {
  isUploading: PropTypes.bool.isRequired,
  percent: PropTypes.number.isRequired,
  label: PropTypes.string,
};

export default FileUploadProgress;
