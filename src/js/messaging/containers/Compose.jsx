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
import ModalAttachments from '../components/compose/ModalAttachments';
import NoticeBox from '../components/NoticeBox';

import {
  closeAttachmentsModal,
  deleteAttachment,
  deleteComposeMessage,
  fetchRecipients,
  fetchSenderName,
  openAttachmentsModal,
  saveDraft,
  sendMessage,
  setAttachments,
  setMessageField,
  toggleConfirmDelete,
  updateComposeCharacterCount
} from '../actions';

class Compose extends React.Component {
  constructor() {
    super();
    this.apiFormattedMessage = this.apiFormattedMessage.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
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
                maxChars={composeMessage.maxChars.message}
                onValueChange={this.props.setMessageField}
                onCharCountChange={this.props.updateComposeCharacterCount}
                placeholder={composeMessage.placeholders.message}
                text={message.text}/>
            <MessageAttachments
                hidden={!this.props.message.attachments.length}
                files={this.props.message.attachments}
                onClose={this.props.deleteAttachment}/>
          </div>
          <MessageSend
              allowedMimeTypes={allowedMimeTypes}
              attachedFiles={this.props.message.attachments}
              charCount={message.charsRemaining}
              cssClass="messaging-send-group"
              maxFiles={composeMessage.attachments.maxNum}
              maxFileSize={composeMessage.attachments.maxSingleFile}
              maxTotalFileSize={composeMessage.attachments.maxTotalFiles}
              onAttachmentUpload={this.props.setAttachments}
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
            visible={this.props.modals.deleteConfirm.visible}/>
        <ModalAttachments
            cssClass="messaging-modal"
            text={this.props.modals.attachments.message.text}
            title={this.props.modals.attachments.message.title}
            id="messaging-add-attachments"
            onClose={this.props.closeAttachmentsModal}
            visible={this.props.modals.attachments.visible}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    message: state.compose.message,
    recipients: state.compose.recipients,
    modals: {
      deleteConfirm: {
        visible: state.modals.deleteConfirm.visible
      },
      attachments: {
        visible: state.modals.attachments.visible,
        message: state.modals.attachments.message
      }
    }
  };
};

const mapDispatchToProps = {
  closeAttachmentsModal,
  deleteAttachment,
  deleteComposeMessage,
  fetchRecipients,
  fetchSenderName,
  openAttachmentsModal,
  saveDraft,
  sendMessage,
  setAttachments,
  setMessageField,
  toggleConfirmDelete,
  updateComposeCharacterCount
};

export default connect(mapStateToProps, mapDispatchToProps)(Compose);
