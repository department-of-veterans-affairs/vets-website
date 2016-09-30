import React from 'react';

import ButtonDelete from '../buttons/ButtonDelete';
import CharacterCount from '../compose/CharacterCount';
import MessageAddAttachment from './MessageAddAttachment';

class MessageSend extends React.Component {
  constructor(props) {
    super(props);
    this.handleAttachmentsChange = this.handleAttachmentsChange.bind(this);
  }

  handleAttachmentsChange(domEvent) {
    const input = domEvent.target;
    if (window.File && window.FileList) {
      const files = Array.from(input.files);
      this.props.onAttachmentUpload(files);
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
  attachedFiles: React.PropTypes.array,
  multipleUploads: React.PropTypes.bool,
  charCount: React.PropTypes.number,
  cssClass: React.PropTypes.string,
  onAttachmentUpload: React.PropTypes.func, // TODO: make this required
  onSave: React.PropTypes.func.isRequired,
  onSend: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired,
  allowedMimeTypes: React.PropTypes.arrayOf(React.PropTypes.string)
};

export default MessageSend;
