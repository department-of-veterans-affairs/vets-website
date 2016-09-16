import React from 'react';
import { connect } from 'react-redux';

import {
  composeMessageErrors,
  composeMessagePlaceholders,
  messageCategories
} from '../config';

import MessageCategory from '../components/compose/MessageCategory';
import MessageFrom from '../components/compose/MessageFrom';
import MessageSubject from '../components/compose/MessageSubject';
import MessageRecipient from '../components/compose/MessageRecipient';
import MessageSend from '../components/compose/MessageSend';
import MessageWrite from '../components/compose/MessageWrite';

import {
  confirmDelete,
  saveMessage,
  sendMessage,
  setMessageField,
  setSubjectRequired,
  fetchRecipients,
  fetchSenderName
} from '../actions/compose';

class Compose extends React.Component {
  constructor() {
    super();
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleRecipientChange = this.handleRecipientChange.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
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
    this.props.setMessageField('message.subject.value', valueObj);
  }

  handleMessageChange(valueObj) {
    this.props.setMessageField('message.text', valueObj);
  }

  handleRecipientChange(valueObj) {
    this.props.setMessageField('message.recipient', valueObj);
  }

  render() {
    const message = this.props.compose.message;
    const recipients = this.props.compose.recipients;

    return (
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
            onSave={this.props.saveMessage}
            onSend={this.props.sendMessage}
            onDelete={this.props.confirmDelete}
            cssClass="messaging-send-group"/>
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    compose: {
      message: state.compose.message,
      recipients: state.compose.recipients
    }
  };
};

const mapDispatchToProps = {
  confirmDelete,
  saveMessage,
  sendMessage,
  setMessageField,
  setSubjectRequired,
  fetchRecipients,
  fetchSenderName
};

export default connect(mapStateToProps, mapDispatchToProps)(Compose);
