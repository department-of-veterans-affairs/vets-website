import React from 'react';

import {
  validateFileSize,
  validateNumAttachments,
  validateTotalFileSize
} from '../../utils/validations.js';

import ButtonDelete from '../buttons/ButtonDelete';
import MessageAddAttachment from './MessageAddAttachment';

class MessageSend extends React.Component {
  constructor(props) {
    super(props);
    this.handleAttachmentsChange = this.handleAttachmentsChange.bind(this);
  }

  handleAttachmentsChange(domEvent) {
    const input = domEvent.target;
    let hasError = null;

    if (window.File && window.FileList) {
      if (input.files.length) {
        const files = Array.from(input.files);

        if (validateNumAttachments(files, this.props.maxFiles)) {
          hasError = { type: 'tooMany' };
        } else if (validateFileSize(files, this.props.maxFileSize) || validateTotalFileSize(files, this.props.maxTotalFileSize)) {
          hasError = { type: 'tooLarge' };
        }

        if (hasError) {
          this.props.onAttachmentsError(hasError);
        } else {
          this.props.onAttachmentUpload(files);
        }
      }
    }
  }

  render() {
    const isDisabled = this.props.disabled;

    return (
      <div className="msg-send-group">
        <div className="msg-send-buttons">
          <button
              disabled={isDisabled}
              type="button"
              onClick={this.props.onSend}>Send</button>
          <button
              disabled={isDisabled}
              className="usa-button-outline msg-btn-save"
              type="button"
              value="save"
              onClick={this.props.onSave}>Save As Draft</button>
        </div>
        <MessageAddAttachment
            cssClass="msg-attach"
            allowedMimeTypes={this.props.allowedMimeTypes}
            id="msg-attachments-input"
            label="Attach a file"
            name="messageAttachments"
            onChange={this.handleAttachmentsChange}/>
        <ButtonDelete
            className="va-icon-link"
            onClick={this.props.onDelete}/>
      </div>
    );
  }
}

MessageSend.propTypes = {
  allowedMimeTypes: React.PropTypes.arrayOf(React.PropTypes.string),
  disabled: React.PropTypes.bool,
  maxFiles: React.PropTypes.number,
  maxFileSize: React.PropTypes.number,
  maxTotalFileSize: React.PropTypes.number,
  onAttachmentUpload: React.PropTypes.func.isRequired,
  onAttachmentsError: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  onSend: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired,
};

export default MessageSend;
