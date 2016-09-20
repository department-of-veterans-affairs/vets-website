import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import {
  allowedMimeTypes,
  composeMessageErrors,
  composeMessagePlaceholders,
  composeMessageMaxChars,
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
  saveMessage,
  sendMessage,
  setMessageField,
  setSubjectRequired,
  fetchRecipients,
  fetchSenderName,
  updateComposeCharacterCount
} from '../actions/compose';

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
  }

  componentDidMount() {
    this.props.fetchSenderName();
    this.props.fetchRecipients();
  }

  handleCategoryChange(valueObj) {
    this.props.setMessageField('message.category', valueObj);
    this.props.setSubjectRequired(valueObj);
  }

  handleSubjectChange(valueObj) {
    this.props.setMessageField('message.subject', valueObj);
  }

  handleMessageChange(valueObj) {
    this.props.setMessageField('message.text', valueObj);
    this.props.updateComposeCharacterCount(valueObj, composeMessageMaxChars);
  }

  handleRecipientChange(valueObj) {
    this.props.setMessageField('message.recipient', valueObj);
  }

  handleConfirmDelete(domEvent) {
    // TODO: Dispatch an action that makes this API call
    domEvent.preventDefault();
    browserHistory.push(paths.DRAFTS_URL);
    this.props.toggleConfirmDelete();
  }

  render() {
    const message = this.props.compose.message;
    const recipients = this.props.compose.recipients;

    return (
      <div>
        <form
            id="messaging-compose"
            onSubmit={(domEvent) => { domEvent.preventDefault(); }}>
          <h2>New message</h2>
          <p>
            <strong>Note:</strong> Messages may be saved to your health record at
            your team's discretion.
          </p>
          <MessageFrom
              cssClass="messaging-from"
              lastName={message.sender.lastName}
              firstName={message.sender.firstName}
              middleName={message.sender.middleName}/>
          <MessageRecipient
              categories={messageCategories}
              errorMessage={composeMessageErrors.recipient}
              cssClass="messaging-recipient"
              onValueChange={this.handleRecipientChange}
              options={recipients}
              value={message.recipient}/>
          <fieldset className="messaging-subject-group">
            <legend>Subject line:</legend>
            <div>
              <MessageCategory
                  categories={messageCategories}
                  cssClass="messaging-category"
                  errorMessage={composeMessageErrors.category}
                  onValueChange={this.handleCategoryChange}
                  value={message.category}/>
              <MessageSubject
                  cssClass="messaging-subject"
                  errorMessage={composeMessageErrors.subject}
                  onValueChange={this.handleSubjectChange}
                  placeholder={composeMessagePlaceholders.subject}
                  required={message.subject.required}/>
            </div>
          </fieldset>
          <MessageWrite
              cssClass="messaging-write"
              onValueChange={this.handleMessageChange}
              placeholder={composeMessagePlaceholders.message}/>
          <MessageSend
              allowedMimeTypes={allowedMimeTypes}
              charCount={this.props.compose.message.charsRemaining}
              cssClass="messaging-send-group"
              onSave={this.props.saveMessage}
              onSend={this.props.sendMessage}
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
    compose: {
      message: state.compose.message,
      recipients: state.compose.recipients
    },
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
  saveMessage,
  sendMessage,
  setMessageField,
  setSubjectRequired,
  fetchRecipients,
  fetchSenderName,
  toggleConfirmDelete,
  toggleAttachmentsModal,
  updateComposeCharacterCount
};

export default connect(mapStateToProps, mapDispatchToProps)(Compose);
