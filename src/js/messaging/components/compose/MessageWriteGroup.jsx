import React from 'react';
import classNames from 'classnames';
import MessageWrite from './MessageWrite';
import MessageSend from './MessageSend';
import MessageAttachments from './MessageAttachments';

class MessageWriteGroup extends React.Component {
  constructor(props) {
    super(props);
    this.handleAttachmentsClose = this.handleAttachmentsClose.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
  }

  handleAttachmentsClose() {
    this.props.onAttachmentsClose();
  }

  handleMessageChange(valueObj) {
    this.props.onTextChange('message.text', valueObj);
    this.props.onCharCountChange(valueObj, this.props.maxChars);
  }

  handleSubjectChange(valueObj) {
    this.props.onSubjectChange('message.subject', valueObj);
  }


  // TODO: Add errorMessage property to ErrorableTextInput conditionally
  // when the fields are validated.
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
            maxChars={this.props.maxChars}
            onCharCountChange={this.props.onCharCountChange}
            onValueChange={this.handleMessageChange}
            placeholder={this.props.placeholder}
            text={this.props.messageText}/>
        <MessageAttachments
            hidden={this.props.attachmentsVisible}
            files={this.props.files}
            onClose={this.handleAttachmentsClose}/>
        <MessageSend
            allowedMimeTypes={this.props.allowedMimeTypes}
            attachedFiles={this.props.files}
            charCount={this.props.charCount}
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
  attachmentsVisible: React.PropTypes.bool,
  charCount: React.PropTypes.number,
  errorMessage: React.PropTypes.string,
  files: React.PropTypes.array,
  maxChars: React.PropTypes.number,
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
  onCharCountChange: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  onSave: React.PropTypes.func,
  onSend: React.PropTypes.func,
  onTextChange: React.PropTypes.func,
  placeholder: React.PropTypes.string,
  subjectPlaceholder: React.PropTypes.string
};

export default MessageWriteGroup;
