import React from 'react';
import classNames from 'classnames';
import MessageWrite from './MessageWrite';
import MessageSend from './MessageSend';
import MessageAttachments from './MessageAttachments';

class MessageWriteGroup extends React.Component {
  constructor(props) {
    super(props);
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }

  handleMessageChange(valueObj) {
    this.props.onTextChange('message.text', valueObj);
  }

  render() {
    const errItemClass = classNames(
      this.props.cssClass,
      'msg-write-group',
      'msg-field',
      { 'msg-compose-error': !!this.props.errorMessage },
      { 'usa-input-error': !!this.props.errorMessage }
    );

    return (
      <div className={errItemClass}>
        <MessageWrite
            cssClass="msg-write"
            errorMessage={this.props.errorMessage}
            onValueChange={this.handleMessageChange}
            placeholder={this.props.placeholder}
            text={this.props.messageText}/>
        <MessageAttachments
            files={this.props.files}
            onClose={this.props.onAttachmentsClose}/>
        <MessageSend
            allowedMimeTypes={this.props.allowedMimeTypes}
            attachedFiles={this.props.files}
            cssClass="msg-send-group"
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
  allowedMimeTypes: React.PropTypes.array,
  errorMessage: React.PropTypes.string,
  files: React.PropTypes.array,
  maxFiles: React.PropTypes.number,
  maxFileSize: React.PropTypes.number,
  maxTotalFileSize: React.PropTypes.number,
  messageText: React.PropTypes.shape({
    value: React.PropTypes.string,
    dirty: React.PropTypes.bool
  }),
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
