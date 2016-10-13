import React from 'react';

class AddFilesForm extends React.Component {
  render() {
    return (
      <div className="upload-files">
        <h4>Select files to upload</h4>
        <div className="button-container">
          <button className="usa-button-outline">Add Files</button>
        </div>
        <div className="file-requirements">
          <p className="file-requirement-header">Accepted file types:</p>
          <p className="file-requirement-text">pdf (unlocked), gif, tiff, tif, jpeg, jpg, bmp, txt</p>
          <p className="file-requirement-header">Maximum file size:</p>
          <p className="file-requirement-text">{"25MB"}</p>
        </div>
        <div className="document-item-container">
          <div className="document-title-size">
            <div className="document-title-header">
              <h4 className="title">{"dd214-l-weber.pdf"}</h4>
            </div>
            <div className="document-size-text">
              <p className="size">{"300KB"}</p>
            </div>
          </div>
          <div className="remove-document-button">
            <button className="usa-button-outline">Remove</button>
          </div>
          <div className="clearfix"></div>
          <div className="document-type-dropdown">
            <label>{"What type of document is this?"}</label>
            <select className="form-select-medium">
              <option value></option>
              <option value="Jr.">{"Copy of DD214"}</option>
              // TODO: Get actual list of possible documents
            </select>
          </div>
        </div>
        <div className="button-container">
          <button className="va-button-secondary">Submit Files for Review</button>
        </div>
      </div>
    );
  }
}

export default AddFilesForm;
