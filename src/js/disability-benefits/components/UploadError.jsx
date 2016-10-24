import React from 'react';
import Scroll from 'react-scroll';

const Element = Scroll.Element;

export default function UploadError() {
  return (
    <div>
      <Element name="uploadError"/>
      <div className="upload-error usa-alert usa-alert-error claims-alert">
        <div className="usa-alert-body">
          <h4 className="usa-alert-heading">Error uploading files</h4>
          <p className="usa-alert-text">There was an error uploading your files. Please try again</p>
        </div>
      </div>
    </div>
  );
}
