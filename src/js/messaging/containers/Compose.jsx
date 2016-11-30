import React from 'react';
import { connect } from 'react-redux';

import { dirtyAllFields } from '../../common/model/fields';
import NoticeBox from '../components/NoticeBox';
import ModalConfirmDelete from '../components/compose/ModalConfirmDelete';
import ModalConfirmSave from '../components/compose/ModalConfirmSave';
import NewMessageForm from '../components/forms/NewMessageForm';
import * as validations from '../utils/validations';

import {
  addComposeAttachments,
  deleteComposeAttachment,
  deleteComposeMessage,
  fetchRecipients,
  openAttachmentsModal,
  resetMessage,
  resetRedirect,
  saveDraft,
  sendMessage,
  setMessageField,
  toggleConfirmDelete,
  toggleConfirmSave,
  updateComposeCharacterCount
} from '../actions';

export class Compose extends React.Component {
  constructor() {
    super();
    this.apiFormattedMessage = this.apiFormattedMessage.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
    this.isValidForm = this.isValidForm.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.saveDraft = this.saveDraft.bind(this);
    this.saveDraftIfNoAttachments = this.saveDraftIfNoAttachments.bind(this);
  }

  componentDidMount() {
    this.props.resetMessage();
    this.props.fetchRecipients();
  }

  componentDidUpdate() {
    if (this.props.redirect) {
      this.context.router.replace(this.props.redirect);
    }
  }

  componentWillUnmount() {
    this.props.resetRedirect();
  }

  apiFormattedMessage() {
    const message = this.props.message;

    return {
      attachments: message.attachments,
      category: message.category.value,
      subject: message.subject.value,
      body: message.body.value,
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
    this.props.setMessageField('message.body', message.body);

    // return dirtied fields
    return message;
  }

  isValidForm() {
    const message = this.dirtyComposeForm();
    const valid = validations.isValidRecipient(message.recipient) &&
                  validations.isValidCategory(message.category) &&
                  validations.isValidSubject(message.subject) &&
                  validations.isValidMessageBody(message.body);
    return valid;
  }

  sendMessage() {
    if (this.isValidForm()) {
      this.props.sendMessage(this.apiFormattedMessage());
    }
  }

  saveDraft() {
    if (this.props.saveConfirmModal.visible) {
      this.props.toggleConfirmSave();
    }

    this.props.saveDraft(this.apiFormattedMessage());
  }

  saveDraftIfNoAttachments() {
    if (this.props.message.attachments.length) {
      this.props.toggleConfirmSave();
    } else {
      this.saveDraft();
    }
  }

  handleConfirmDelete(domEvent) {
    domEvent.preventDefault();
    this.props.toggleConfirmDelete();
    this.props.deleteComposeMessage();
  }

  render() {
    return (
      <div>
        <div id="messaging-content-header">
          <a
              className="messaging-cancel-link"
              onClick={this.props.toggleConfirmDelete}>
            Cancel
          </a>
          <h2>New message</h2>
          <button
              className="messaging-send-button"
              type="button"
              onClick={this.sendMessage}
              disabled={!this.props.message.body.value.length}>
            Send
          </button>
        </div>
        <NewMessageForm
            message={this.props.message}
            recipients={this.props.recipients}
            onAttachmentsClose={this.props.deleteComposeAttachment}
            onAttachmentUpload={this.props.addComposeAttachments}
            onAttachmentsError={this.props.openAttachmentsModal}
            onBodyChange={this.props.setMessageField.bind(null, 'message.body')}
            onCategoryChange={this.props.setMessageField.bind(null, 'message.category')}
            onRecipientChange={this.props.setMessageField.bind(null, 'message.recipient')}
            onSaveMessage={this.saveDraftIfNoAttachments}
            onSendMessage={this.sendMessage}
            onSubjectChange={this.props.setMessageField.bind(null, 'message.subject')}
            toggleConfirmDelete={this.props.toggleConfirmDelete}/>
        <NoticeBox/>
        <ModalConfirmDelete
            cssClass="messaging-modal"
            onClose={this.props.toggleConfirmDelete}
            onDelete={this.handleConfirmDelete}
            visible={this.props.deleteConfirmModal.visible}/>
        <ModalConfirmSave
            cssClass="messaging-modal"
            onClose={this.props.toggleConfirmSave}
            onSave={this.saveDraft}
            visible={this.props.saveConfirmModal.visible}/>
      </div>
    );
  }
}

Compose.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    message: state.compose.message,
    recipients: state.compose.recipients,
    redirect: state.folders.ui.redirect,
    deleteConfirmModal: state.modals.deleteConfirm,
    saveConfirmModal: state.modals.saveConfirm
  };
};

const mapDispatchToProps = {
  addComposeAttachments,
  deleteComposeAttachment,
  deleteComposeMessage,
  fetchRecipients,
  openAttachmentsModal,
  resetMessage,
  resetRedirect,
  saveDraft,
  sendMessage,
  setMessageField,
  toggleConfirmDelete,
  toggleConfirmSave,
  updateComposeCharacterCount
};

export default connect(mapStateToProps, mapDispatchToProps)(Compose);
