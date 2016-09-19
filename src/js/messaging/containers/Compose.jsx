import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import {
  composeMessageErrors,
  composeMessagePlaceholders,
  messageCategories,
  paths,
} from '../config';

import MessageCategory from '../components/compose/MessageCategory';
import MessageFrom from '../components/compose/MessageFrom';
import MessageSubject from '../components/compose/MessageSubject';
import MessageRecipient from '../components/compose/MessageRecipient';
import MessageSend from '../components/compose/MessageSend';
import MessageWrite from '../components/compose/MessageWrite';
import ModalConfirmDelete from '../components/compose/ModalConfirmDelete';

import {
  saveMessage,
  sendMessage,
  setMessageField,
  setSubjectRequired,
  fetchRecipients,
  fetchSenderName
} from '../actions/compose';

import {
  toggleConfirmDelete
} from '../actions/modals';

class Compose extends React.Component {
  constructor() {
    super();
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleRecipientChange = this.handleRecipientChange.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
  }

  componentDidMount() {
    this.props.fetchSenderName();
    this.props.fetchRecipients();
  }

  handleCategoryChange(valueObj) {
    this.props.setMessageField('message.category', valueObj);
    this.props.setSubjectRequired(valueObj);
  }

  handleMessageChange(valueObj) {
    this.props.setMessageField('message.text', valueObj);
  }

  handleSubjectChange(valueObj) {
    this.props.setMessageField('message.subject.value', valueObj);
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
  toggleConfirmDelete
};

export default connect(mapStateToProps, mapDispatchToProps)(Compose);
