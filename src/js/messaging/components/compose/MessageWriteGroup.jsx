import React from 'react';
import classNames from 'classnames';
import MessageWrite from './MessageWrite';
import MessageSend from './MessageSend';
import MessageAttachments from './MessageAttachments';

class MessageWriteGroup extends React.Component {
  render() {
    const errItemClass = classNames(
      'msg-write-group',
      'msg-field',
      { 'msg-compose-error': !!this.props.errorMessage },
      { 'usa-input-error': !!this.props.errorMessage }
    );

    return (
      <div className={errItemClass}>
        <MessageWrite
            disabled={this.props.disabled}
            cssClass="msg-write"
            errorMessage={this.props.errorMessage}
            onValueChange={this.props.onTextChange}
            placeholder={this.props.placeholder}
            text={this.props.messageText}/>
        <MessageAttachments
            files={this.props.files}
            onClose={this.props.onAttachmentsClose}/>
        <MessageSend
            disabled={!this.props.messageText.value.length || this.props.disabled}
            allowedMimeTypes={this.props.allowedMimeTypes}
            attachedFiles={this.props.files}
            maxFiles={this.props.maxFiles}
            maxFileSize={this.props.maxFileSize}
            maxTotalFileSize={this.props.maxTotalFileSize}
            onAttachmentUpload={this.props.onAttachmentUpload}
            onAttachmentsError={this.props.onAttachmentsError}
            onSave={this.props.onSave}
            onSend={this.props.onSend}
            onDelete={this.props.onDelete}/>
      </div>
    );
  }
}

MessageWriteGroup.propTypes = {
  disabled: React.PropTypes.bool,
  allowedMimeTypes: React.PropTypes.array,
  errorMessage: React.PropTypes.string,
  files: React.PropTypes.array,
  maxFiles: React.PropTypes.number,
  maxFileSize: React.PropTypes.number,
  maxTotalFileSize: React.PropTypes.number,
  messageText: React.PropTypes.shape({
    value: React.PropTypes.string,
    dirty: React.PropTypes.bool
  }).isRequired,
  onAttachmentsClose: React.PropTypes.func,
  onAttachmentUpload: React.PropTypes.func,
  onAttachmentsError: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  onSave: React.PropTypes.func,
  onSend: React.PropTypes.func,
  onTextChange: React.PropTypes.func,
  placeholder: React.PropTypes.string,
};

export default MessageWriteGroup;
