import React from 'react';

import ButtonDelete from '../buttons/ButtonDelete';
import CharacterCount from '../compose/CharacterCount';
import MessageAddAttachment from './MessageAddAttachment';

class MessageSend extends React.Component {
  constructor(props) {
    super(props);
    this.handleAttachmentsChange = this.handleAttachmentsChange.bind(this);
    this.validateNumAttachments = this.validateNumAttachments.bind(this);
    this.validateFileSize = this.validateFileSize.bind(this);
    this.validateTotalFileSize = this.validateTotalFileSize.bind(this);
  }

  validateNumAttachments(files, maxAttachments) {
    return files.length > maxAttachments;
  }

  validateFileSize(files, max) {
    return !!files.find((file) => { return file.size > max; });
  }

  validateTotalFileSize(files, max) {
    // Get sizes for each file.
    const sizes = files.map((f) => {
      return f.size;
    });

    const total = sizes.reduce((a, b) => {
      return a + b;
    });

    return total > max;
  }

  handleAttachmentsChange(domEvent) {
    const input = domEvent.target;
    let hasError = null;

    if (window.File && window.FileList) {
      if (input.files.length) {
        const files = Array.from(input.files);

        if (this.validateNumAttachments(files, this.props.maxFiles)) {
          hasError = { type: 'tooMany' };
        } else if (this.validateFileSize(files, this.props.maxFileSize) || this.validateTotalFileSize(files, this.props.maxTotalFileSize)) {
          hasError = { type: 'tooLarge' };
        }

        if (hasError) {
          this.props.onAttachmentsError(hasError);
          // Resets the value of the input.
          input.value = '';
        } else {
          this.props.onAttachmentUpload(files);
        }
      }
    }
  }

  render() {
    const isDisabled = this.props.charCount < 0;

    return (
      <div className={this.props.cssClass}>
        <button
            disabled={isDisabled}
            type="button"
            onClick={this.props.onSend}>Send</button>
        <button
            disabled={isDisabled}
            className="usa-button-outline messaging-btn-save"
            type="button"
            value="save"
            onClick={this.props.onSave}>Save As Draft</button>
        <MessageAddAttachment
            cssClass="msg-attach"
            allowedMimeTypes={this.props.allowedMimeTypes}
            id="msg-attachments"
            label="Attach a file"
            name="messageAttachments"
            onChange={this.handleAttachmentsChange}/>
        <ButtonDelete
            compact
            onClickHandler={this.props.onDelete}/>
        <CharacterCount
            count={this.props.charCount}
            cssClass="messaging-characters"/>
      </div>
    );
  }
}

MessageSend.propTypes = {
  allowedMimeTypes: React.PropTypes.arrayOf(React.PropTypes.string),
  attachedFiles: React.PropTypes.array,
  charCount: React.PropTypes.number,
  cssClass: React.PropTypes.string,
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
