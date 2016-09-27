import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';

import {
  allowedMimeTypes,
  composeMessage,
  messageCategories,
  paths
} from '../config';

import MessageCategory from '../components/compose/MessageCategory';
import MessageFrom from '../components/compose/MessageFrom';
import MessageSubject from '../components/compose/MessageSubject';
import MessageRecipient from '../components/compose/MessageRecipient';
import MessageSend from '../components/compose/MessageSend';
import MessageWrite from '../components/compose/MessageWrite';
import ModalConfirmDelete from '../components/compose/ModalConfirmDelete';
import ModalAttachmentsTooBig from '../components/compose/ModalAttachmentsTooBig';

import {
  deleteComposeMessage,
  saveMessage,
  setMessageField,
  fetchRecipients,
  fetchSenderName,
  updateComposeCharacterCount
} from '../actions/compose';

import { sendMessage } from '../actions/messages';

import {
  toggleConfirmDelete,
  toggleAttachmentsModal
} from '../actions/modals';

class Compose extends React.Component {
  constructor() {
    super();
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleRecipientChange = this.handleRecipientChange.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.sendNewMessage = this.sendNewMessage.bind(this);
  }

  componentDidMount() {
    this.props.fetchSenderName();
    this.props.fetchRecipients();
  }

  sendNewMessage() {
    this.props.sendMessage(this.props.message);
  }

  handleCategoryChange(valueObj) {
    this.props.setMessageField('message.category', valueObj);
  }

  handleSubjectChange(valueObj) {
    this.props.setMessageField('message.subject', valueObj);
  }

  handleMessageChange(valueObj) {
    this.props.setMessageField('message.text', valueObj);
    this.props.updateComposeCharacterCount(valueObj, composeMessage.maxChars.message);
  }

  handleRecipientChange(valueObj) {
    this.props.setMessageField('message.recipient', valueObj);
  }

  handleConfirmDelete(domEvent) {
    // TODO: Dispatch an action that makes this API call
    domEvent.preventDefault();
    // Send back to Inbox
    const returnUrl = `${paths.FOLDERS_URL}/0`;

    browserHistory.push(returnUrl);
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
              onValueChange={this.handleRecipientChange}
              options={this.props.recipients}
              recipient={message.recipient}/>
          <fieldset className="messaging-subject-group">
            <legend>Subject line:</legend>
            <div>
              <MessageCategory
                  categories={messageCategories}
                  cssClass="messaging-category"
                  errorMessage={composeMessage.errors.category}
                  onValueChange={this.handleCategoryChange}
                  category={message.category}/>
              <MessageSubject
                  charMax={composeMessage.maxChars.subject}
                  cssClass="messaging-subject"
                  errorMessage={composeMessage.errors.subject}
                  onValueChange={this.handleSubjectChange}
                  placeholder={composeMessage.placeholders.subject}
                  required={subjectRequired}
                  subject={message.subject}/>
            </div>
          </fieldset>
          <MessageWrite
              cssClass="messaging-write"
              onValueChange={this.handleMessageChange}
              placeholder={composeMessage.placeholders.message}
              text={message.text}/>
          <MessageSend
              allowedMimeTypes={allowedMimeTypes}
              charCount={message.charsRemaining}
              cssClass="messaging-send-group"
              onSave={this.props.saveMessage}
              onSend={this.sendNewMessage}
              onDelete={this.props.toggleConfirmDelete}/>
        </form>
        <ModalConfirmDelete
            cssClass="messaging-modal"
            onClose={this.props.toggleConfirmDelete}
            onDelete={this.handleConfirmDelete}
            visible={this.props.modals.deleteConfirm.visible}/>
        <ModalAttachmentsTooBig
            cssClass="messaging-modal"
            id="messaging-add-attachments"
            onClose={this.props.toggleAttachmentsModal}
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
        visible: state.modals.attachments.visible
      }
    }
  };
};

const mapDispatchToProps = {
  deleteComposeMessage,
  saveMessage,
  sendMessage,
  setMessageField,
  fetchRecipients,
  fetchSenderName,
  toggleConfirmDelete,
  toggleAttachmentsModal,
  updateComposeCharacterCount
};

export default connect(mapStateToProps, mapDispatchToProps)(Compose);
