import React from 'react';

export default function UploadError() {
  return (
    <div className="upload-error usa-alert usa-alert-error claims-alert">
      <div className="usa-alert-body">
        <h4 className="usa-alert-heading">Error uploading Files</h4>
        <p className="usa-alert-text">There was an error uploading your files. Please try again</p>
      </div>
    </div>
  );
}
