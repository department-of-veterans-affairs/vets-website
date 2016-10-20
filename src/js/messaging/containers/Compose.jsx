import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import {
  allowedMimeTypes,
  composeMessage,
  messageCategories,
  paths
} from '../config';

import {
  dirtyAllFields
} from '../../common/model/fields';

import * as validations from '../utils/validations';

import MessageFrom from '../components/compose/MessageFrom';
import MessageRecipient from '../components/compose/MessageRecipient';
import MessageSubjectGroup from '../components/compose/MessageSubjectGroup';
import MessageWriteGroup from '../components/compose/MessageWriteGroup';
import ModalConfirmDelete from '../components/compose/ModalConfirmDelete';
import NoticeBox from '../components/NoticeBox';

import {
  addComposeAttachments,
  deleteComposeAttachment,
  deleteComposeMessage,
  fetchRecipients,
  fetchSenderName,
  openAttachmentsModal,
  saveDraft,
  sendMessage,
  setMessageField,
  toggleConfirmDelete,
  updateComposeCharacterCount
} from '../actions';

export class Compose extends React.Component {
  constructor() {
    super();
    this.apiFormattedMessage = this.apiFormattedMessage.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.isValidForm = this.isValidForm.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.saveDraft = this.saveDraft.bind(this);
  }

  componentDidMount() {
    this.props.fetchSenderName();
    this.props.fetchRecipients();
  }

  apiFormattedMessage() {
    const message = this.props.message;

    return {
      attachments: message.attachments,
      category: message.category.value,
      subject: message.subject.value,
      body: message.text.value,
      recipientId: +message.recipient.value
    };
  }

  dirtyComposeForm() {
    // Dirty all fields in the form object.
    const message = dirtyAllFields(this.props.message);

    // Resets the fields on submit to trigger error messages if applicable.
    this.props.setMessageField('message.recipient', message.recipient);
    this.props.setMessageField('message.category', message.category);
    this.props.setMessageField('message.subject', message.subject);
    this.props.setMessageField('message.text', message.text);

    // return dirtied fields
    return message;
  }

  isValidForm() {
    const message = this.dirtyComposeForm();
    const valid = validations.isValidRecipient(message.recipient) &&
                  validations.isValidCategory(message.category) &&
                  validations.isValidSubject(message.subject) &&
                  validations.isValidMessageBody(message.text);
    return valid;
  }

  sendMessage() {
    if (this.isValidForm()) {
      this.props.sendMessage(this.apiFormattedMessage());
    }
  }

  saveDraft() {
    this.props.saveDraft(this.apiFormattedMessage());
  }

  handleConfirmDelete(domEvent) {
    domEvent.preventDefault();
    this.props.toggleConfirmDelete();
    this.props.deleteComposeMessage();
  }

  handleMessageChange(valueObj) {
    this.props.setMessageField('message.text', valueObj);
  }

  render() {
    const message = this.props.message;

    // Tests the subject group for errors
    const subjectError = validations.isValidSubjectLine(message.category, message.subject);

    return (
      <div>
        <div id="messaging-content-header">
          <Link
              className="messaging-cancel-link"
              to={paths.DRAFTS_URL}>
            Cancel
          </Link>
          <h2>New message</h2>
          <button
              className="messaging-send-button"
              type="button">
            Send
          </button>
        </div>
        <form
            id="msg-compose"
            onSubmit={(domEvent) => { domEvent.preventDefault(); }}>
          <MessageFrom
              cssClass="msg-from"
              lastName={message.sender.lastName}
              firstName={message.sender.firstName}
              middleName={message.sender.middleName}/>
          <MessageRecipient
              errorMessage={validations.isValidRecipient(message.recipient) ? '' : composeMessage.errors.recipient}
              cssClass="msg-recipient msg-field"
              onValueChange={this.props.setMessageField}
              options={this.props.recipients}
              recipient={message.recipient}/>
          <MessageSubjectGroup
              categories={messageCategories}
              category={message.category}
              cssErrorClass={subjectError.type ? `msg-compose-error--${subjectError.type}` : undefined}
              errorMessage={subjectError.hasError ? composeMessage.errors.subjectLine[subjectError.type] : undefined}
              onCategoryChange={this.props.setMessageField}
              onSubjectChange={this.props.setMessageField}
              subject={message.subject}
              subjectPlaceholder={composeMessage.placeholders.subject}/>
          <MessageWriteGroup
              allowedMimeTypes={allowedMimeTypes}
              errorMessage={validations.isValidMessageBody(message.text) ? undefined : composeMessage.errors.message}
              files={this.props.message.attachments}
              maxFiles={composeMessage.attachments.maxNum}
              maxFileSize={composeMessage.attachments.maxSingleFile}
              maxTotalFileSize={composeMessage.attachments.maxTotalFiles}
              onAttachmentsClose={this.props.deleteComposeAttachment}
              onAttachmentUpload={this.props.addComposeAttachments}
              onAttachmentsError={this.props.openAttachmentsModal}
              onCharCountChange={this.props.updateComposeCharacterCount}
              onDelete={this.props.toggleConfirmDelete}
              onTextChange={this.props.setMessageField}
              onSave={this.saveDraft}
              onSend={this.sendMessage}
              messageText={message.text}
              placeholder={composeMessage.placeholders.message}/>
        </form>
        <NoticeBox/>
        <ModalConfirmDelete
            cssClass="messaging-modal"
            onClose={this.props.toggleConfirmDelete}
            onDelete={this.handleConfirmDelete}
            visible={this.props.deleteConfirmModal.visible}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    message: state.compose.message,
    recipients: state.compose.recipients,
    deleteConfirmModal: state.modals.deleteConfirm
  };
};

const mapDispatchToProps = {
  addComposeAttachments,
  deleteComposeAttachment,
  deleteComposeMessage,
  fetchRecipients,
  fetchSenderName,
  openAttachmentsModal,
  saveDraft,
  sendMessage,
  setMessageField,
  toggleConfirmDelete,
  updateComposeCharacterCount
};

export default connect(mapStateToProps, mapDispatchToProps)(Compose);
