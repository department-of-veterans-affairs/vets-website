import {
  VaButton,
  VaFileInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { getFileSize } from '../helpers';

const FileUpload = props => {
  const {
    acceptFileTypes = '.pdf,.jpeg,.png',
    buttonText = 'Upload file',
    error,
    label = 'Upload your file',
    header = 'Upload your files',
    hint = null,
    showDescription = true,
    success = null,
  } = props;

  const [attachments, setAttachments] = useState([]);

  const onAddFile = async event => {
    const { files } = event.detail;
    setAttachments([...attachments, ...files]);
  };

  const onRemoveFile = fileToRemoveName => {
    setAttachments(attachments.filter(file => file.name !== fileToRemoveName));
  };

  const renderAlert = () => {
    if (success === true) {
      return (
        <div className="usa-alert usa-alert--success usa-alert--slim">
          <div className="usa-alert__body">
            <p className="usa-alert__text">File attached successfully</p>
          </div>
        </div>
      );
    }
    if (success === false) {
      return (
        <div className="usa-alert usa-alert--error usa-alert--slim">
          <div className="usa-alert__body">
            <p className="usa-alert__text">Issue uploading your file</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h3 className="site-preview-heading" data-testid="file-upload-header">
        {header}
      </h3>
      <div className="usa-form-group">
        {showDescription ? (
          <p>
            You’ll need to scan your document onto your device to submit this
            application, such as your computer, tablet, or mobile phone. You can
            upload your document from there.
          </p>
        ) : null}
        <div>
          <p>Guidelines to upload a file:</p>
          <ul>
            <li>You can upload a .pdf, .jpeg, or.png file</li>
            <li>Your file should be no larger than 25MB</li>
          </ul>
        </div>
        <VaFileInput
          accept={acceptFileTypes}
          button-text={buttonText}
          data-testid="ask-va-file-upload-button"
          error={error}
          hint={hint}
          label={label}
          name="ask-va-file-input"
          onVaChange={onAddFile}
          uswds
        />
        {/* <input
          accept=".pdf,.jpeg,.png"
          id="file-input-multiple"
          className="usa-file-input"
          type="file"
          name="file-input-multiple"
          aria-describedby="file-input-multiple-hint"
          aria-label="Drag files here or choose from folder"
          multiple="multiple"
          onChange={onAddFile}
        /> */}
      </div>
      <h3 className="site-preview-heading">Attachments</h3>
      {renderAlert()}
      {attachments.length > 0 ? (
        <ul className="attachments-list">
          {attachments.map(file => (
            <li key={file.name + file.size}>
              <div className="attachment-file">
                <span>
                  <i
                    className="fas fa-paperclip"
                    alt="Attachment icon"
                    aria-hidden="true"
                  />
                  <span className="vads-u-margin-left--1">{file.name}</span> (
                  {getFileSize(file.size)})
                </span>
                <VaButton
                  onClick={() => onRemoveFile(file.name)}
                  secondary
                  text="Remove"
                  uswds
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-attachments">There are no attachments.</div>
      )}
    </div>
  );
};

FileUpload.propTypes = {
  acceptFileTypes: PropTypes.string,
  buttonText: PropTypes.string,
  enableAnalytics: PropTypes.bool,
  error: PropTypes.string,
  header: PropTypes.string,
  hint: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  showDescription: PropTypes.bool,
  success: PropTypes.bool,
};

export default FileUpload;
