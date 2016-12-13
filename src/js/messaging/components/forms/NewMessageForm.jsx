import React from 'react';

import {
  allowedMimeTypes,
  composeMessage,
  messageCategories
} from '../../config';

import * as validations from '../../utils/validations';
import MessageRecipient from '../compose/MessageRecipient';
import MessageSubjectGroup from '../compose/MessageSubjectGroup';
import MessageWriteGroup from '../compose/MessageWriteGroup';

export class NewMessageForm extends React.Component {
  render() {
    const message = this.props.message;
    let recipientsField;

    // Tests the subject group for errors
    const subjectError = validations.isValidSubjectLine(message.category, message.subject);

    if (this.props.recipients && this.props.recipients.length) {
      recipientsField = (
        <MessageRecipient
            errorMessage={validations.isValidRecipient(message.recipient) ? undefined : composeMessage.errors.recipient}
            cssClass="msg-recipient msg-field"
            onValueChange={this.props.onRecipientChange}
            options={this.props.recipients}
            recipient={message.recipient}/>
      );
    } else {
      // When there is no recipients list, it means the request has failed,
      // so allow the user to retry. If the request returned an empty list
      // for some reason, it could indicate a server-side issue.
      const retryLink = !this.props.recipients && (
        <a onClick={this.props.onFetchRecipients}>
          Click here to retry loading recipients.
        </a>
      );

      recipientsField = (
        <p>
          No recipients could be found.&nbsp;
          {retryLink}
        </p>
      );
    }

    return (
      <form
          id="msg-compose"
          onSubmit={(domEvent) => { domEvent.preventDefault(); }}>
        {recipientsField}
        <MessageSubjectGroup
            categories={messageCategories}
            category={message.category}
            cssErrorClass={subjectError.type ? `msg-compose-error--${subjectError.type}` : undefined}
            errorMessage={subjectError.hasError ? composeMessage.errors.subjectLine[subjectError.type] : undefined}
            onCategoryChange={this.props.onCategoryChange}
            onSubjectChange={this.props.onSubjectChange}
            subject={message.subject}
            subjectPlaceholder={composeMessage.placeholders.subject}/>
        <MessageWriteGroup
            allowedMimeTypes={allowedMimeTypes}
            errorMessage={validations.isValidMessageBody(message.body) ? undefined : composeMessage.errors.message}
            files={this.props.message.attachments}
            maxFiles={composeMessage.attachments.maxNum}
            maxFileSize={composeMessage.attachments.maxSingleFile}
            maxTotalFileSize={composeMessage.attachments.maxTotalFiles}
            onAttachmentsClose={this.props.onAttachmentsClose}
            onAttachmentUpload={this.props.onAttachmentUpload}
            onAttachmentsError={this.props.onAttachmentsError}
            onDelete={this.props.toggleConfirmDelete}
            onTextChange={this.props.onBodyChange}
            onSave={this.props.onSaveMessage}
            onSend={this.props.onSendMessage}
            messageText={message.body}
            placeholder={composeMessage.placeholders.message}/>
      </form>
    );
  }
}

NewMessageForm.propTypes = {
  message: React.PropTypes.shape({
    recipient: React.PropTypes.shape({
      value: React.PropTypes.string,
      dirty: React.PropTypes.bool
    }),
    category: React.PropTypes.shape({
      value: React.PropTypes.string,
      dirty: React.PropTypes.bool
    }),
    subject: React.PropTypes.shape({
      value: React.PropTypes.string,
      dirty: React.PropTypes.bool
    }),
    body: React.PropTypes.shape({
      value: React.PropTypes.string,
      dirty: React.PropTypes.bool
    }),
    attachments: React.PropTypes.array
  }).isRequired,

  recipients: React.PropTypes.arrayOf(
    React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.shape({
        label: React.PropTypes.string,
        value: React.PropTypes.number }),
      React.PropTypes.shape({
        label: React.PropTypes.string,
        value: React.PropTypes.string })
    ])),

  onAttachmentsClose: React.PropTypes.func,
  onAttachmentUpload: React.PropTypes.func,
  onAttachmentsError: React.PropTypes.func,
  onBodyChange: React.PropTypes.func,
  onCategoryChange: React.PropTypes.func,
  onFetchRecipients: React.PropTypes.func,
  onRecipientChange: React.PropTypes.func,
  onSaveMessage: React.PropTypes.func.isRequired,
  onSendMessage: React.PropTypes.func.isRequired,
  onSubjectChange: React.PropTypes.func,
  toggleConfirmDelete: React.PropTypes.func.isRequired,
};

export default NewMessageForm;
