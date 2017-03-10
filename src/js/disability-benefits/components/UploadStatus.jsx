import React from 'react';
import ProgressBar from '../../common/components/ProgressBar';

export default function UploadStatus({ progress, files, onCancel }) {
  return (
    <div>
      <div className="claims-status-upload-header">Uploading files</div>
      <div className="claims-status-upload-inner">
        <h4>Uploading {files} {files === 1 ? 'file' : 'files'}...</h4>
        <ProgressBar percent={progress * 100}/>
        Your files are uploading. Please do not close this window.
        <p>
          <a onClick={(evt) => {
            evt.preventDefault();
            onCancel();
          }} href>Cancel</a>
        </p>
      </div>
    </div>
  );
}
