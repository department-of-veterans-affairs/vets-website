import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import {
  allowedMimeTypes,
  composeMessage,
  messageCategories,
  paths
} from '../config';

import MessageCategory from '../components/compose/MessageCategory';
import MessageFrom from '../components/compose/MessageFrom';
import MessageAttachments from '../components/compose/MessageAttachments';
import MessageSubject from '../components/compose/MessageSubject';
import MessageRecipient from '../components/compose/MessageRecipient';
import MessageSend from '../components/compose/MessageSend';
import MessageWrite from '../components/compose/MessageWrite';
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
      category: message.category.value,
      subject: message.subject.value,
      body: message.text.value,
      recipientId: +message.recipient.value
    };
  }

  sendMessage() {
    this.props.sendMessage(this.apiFormattedMessage());
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
    this.props.updateComposeCharacterCount(valueObj, composeMessage.maxChars.message);
  }

  render() {
    const message = this.props.message;
    const subjectRequired = message.category &&
                            message.category.value === 'OTHER';

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
            id="messaging-compose"
            onSubmit={(domEvent) => { domEvent.preventDefault(); }}>
          <MessageFrom
              cssClass="messaging-from"
              lastName={message.sender.lastName}
              firstName={message.sender.firstName}
              middleName={message.sender.middleName}/>
          <MessageRecipient
              errorMessage={composeMessage.errors.recipient}
              cssClass="messaging-recipient"
              onValueChange={this.props.setMessageField}
              options={this.props.recipients}
              recipient={message.recipient}/>
          <fieldset className="messaging-subject-field">
            <legend>Subject line:</legend>
            <div className="messaging-subject-group">
              <div>
                <MessageCategory
                    categories={messageCategories}
                    cssClass="messaging-category"
                    errorMessage={composeMessage.errors.category}
                    onValueChange={this.props.setMessageField}
                    category={message.category}/>
                <MessageSubject
                    charMax={composeMessage.maxChars.subject}
                    cssClass="messaging-subject"
                    errorMessage={composeMessage.errors.subject}
                    onValueChange={this.props.setMessageField}
                    placeholder={composeMessage.placeholders.subject}
                    required={subjectRequired}
                    subject={message.subject}/>
              </div>
            </div>
          </fieldset>
          <div className="messaging-write-group">
            <MessageWrite
                cssClass="messaging-write"
                onValueChange={this.handleMessageChange}
                placeholder={composeMessage.placeholders.message}
                text={message.text}/>
            <MessageAttachments
                hidden={!this.props.message.attachments.length}
                files={this.props.message.attachments}
                onClose={this.props.deleteComposeAttachment}/>
          </div>
          <MessageSend
              allowedMimeTypes={allowedMimeTypes}
              charCount={message.charsRemaining}
              cssClass="messaging-send-group"
              maxFiles={composeMessage.attachments.maxNum}
              maxFileSize={composeMessage.attachments.maxSingleFile}
              maxTotalFileSize={composeMessage.attachments.maxTotalFiles}
              onAttachmentUpload={this.props.addComposeAttachments}
              onAttachmentsError={this.props.openAttachmentsModal}
              onSave={this.saveDraft}
              onSend={this.sendMessage}
              onDelete={this.props.toggleConfirmDelete}/>
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
