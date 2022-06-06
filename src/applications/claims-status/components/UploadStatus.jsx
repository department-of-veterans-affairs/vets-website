import React from 'react';
import PropTypes from 'prop-types';

export default function UploadStatus({ files, onCancel, progress }) {
  const handleClick = evt => {
    evt.preventDefault();
    onCancel();
  };

  return (
    <div>
      <div className="claims-status-upload-header" id="upload-status-title">
        Uploading files
      </div>
      <div>
        <h4>
          Uploading {files} {files === 1 ? 'file' : 'files'}
          ...
        </h4>
        <va-progress-bar percent={progress * 100} />
        <p>Your files are uploading. Please do not close this window.</p>
        <button
          type="button"
          className="usa-button-secondary"
          onClick={handleClick}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

UploadStatus.propTypes = {
  files: PropTypes.number,
  progress: PropTypes.number,
  onCancel: PropTypes.func,
};
