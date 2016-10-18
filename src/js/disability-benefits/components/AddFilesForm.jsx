import React from 'react';

import FileInput from '../../common/components/form-elements/FileInput';
import Modal from '../../common/components/Modal';

import UploadStatus from './UploadStatus';

function displayFileSize(size) {
  if (size < 1024) {
    return `${size}B`;
  }

  const kbSize = size / 1024;
  if (kbSize < 1024) {
    return `${Math.round(kbSize)}KB`;
  }

  const mbSize = kbSize / 1024;
  return `${Math.round(mbSize)}MB`;
}

const mimeTypes = [
  'pdf',
  'gif',
  'tiff',
  'tif',
  'jpeg',
  'jpg',
  'bmp',
  'txt'
];

const displayTypes = mimeTypes.map(type => (type === 'pdf' ? 'pdf (unlocked)' : type)).join(', ');


class AddFilesForm extends React.Component {
  render() {
    return (
      <div className="upload-files">
        <h4>Select files to upload</h4>
        <div className="button-container">
          <FileInput
              mimeTypes={mimeTypes.join(',')}
              onChange={files => this.props.onAddFile(files[0])}
              buttonText="Add Files"
              name="fileUpload"/>
        </div>
        <div className="file-requirements">
          <p className="file-requirement-header">Accepted file types:</p>
          <p className="file-requirement-text">{displayTypes}</p>
          <p className="file-requirement-header">Maximum file size:</p>
          <p className="file-requirement-text">{"25MB"}</p>
        </div>
        {this.props.files.map((file, index) =>
          <div key={file.name} className="document-item-container">
            <div className="document-title-size">
              <div className="document-title-header">
                <h4 className="title">{file.name}</h4>
              </div>
              <div className="document-size-text">
                <p className="size">{displayFileSize(file.size)}</p>
              </div>
            </div>
            <div className="remove-document-button">
              <button className="usa-button-outline" onClick={() => this.props.onRemoveFile(index)}>Remove</button>
            </div>
            <div className="clearfix"></div>
          </div>)}
        <div className="button-container">
          <button
              disabled={this.props.files.length === 0}
              className={this.props.files.length === 0 ? 'usa-button usa-button-disabled' : 'usa-button'}
              onClick={this.props.onSubmit}>
            Submit Files for Review
          </button>
        </div>
        <Modal
            onClose={() => true}
            visible={this.props.uploading}
            hideCloseButton
            cssClass="claims-upload-modal"
            contents={<UploadStatus
                progress={this.props.progress}
                files={this.props.files.length}/>}/>
      </div>
    );
  }
}

AddFilesForm.propTypes = {
  files: React.PropTypes.array.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onAddFile: React.PropTypes.func.isRequired,
  onRemoveFile: React.PropTypes.func.isRequired
};

export default AddFilesForm;
