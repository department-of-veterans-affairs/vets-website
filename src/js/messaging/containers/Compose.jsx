import React from 'react';
import { connect } from 'react-redux';

import { messageCategories, composeMessageErrors, composeMessagePlaceholders } from '../config';
import MessageCategory from '../components/compose/MessageCategory';
import MessageSend from '../components/compose/MessageSend';
import MessageSubject from '../components/compose/MessageSubject';
import MessageRecipient from '../components/compose/MessageRecipient';
import {
  saveMessage,
  sendMessage,
  setCategory,
  setRecipient,
  setSubject,
  setSubjectRequired,
  fetchRecipients,
} from '../actions/compose';

class Compose extends React.Component {
  constructor() {
    super();
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleRecipientChange = this.handleRecipientChange.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.props.fetchRecipients();
  }

  handleSubmit(domEvent) {
    domEvent.preventDefault();
    console.log('handle submit!');
  }

  handleChange(domEvent) {
    domEvent.preventDefault();
    console.log('change event!');
  }

  handleCategoryChange(valueObj) {
    this.props.setCategory(valueObj);
    this.props.setSubjectRequired(valueObj);
  }

  handleSubjectChange(valueObj) {
    this.props.setSubject(valueObj);
  }

  handleRecipientChange(valueObj) {
    this.props.setRecipient(valueObj);
  }

  render() {
    const message = this.props.compose.message;

    return (
      <form
          id="messaging-compose"
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}>
        <h2>New message</h2>
        <p>
          <strong>Note:</strong> Messages may be saved to your health record at
          your team's discretion.
        </p>

        <MessageRecipient
            categories={messageCategories}
            errorMessage={composeMessageErrors.recipient}
            cssClass="messaging-recipient"
            onValueChange={this.handleRecipientChange}
            options={this.props.compose.recipients}
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
                errorMessage={composeMessageErrors.subjet}
                onValueChange={this.handleSubjectChange}
                placeholder={composeMessagePlaceholders.subject}
                required={message.subject.required}/>
          </div>
        </fieldset>
        <MessageSend
            onSave={this.props.saveMessage}
            onSend={this.props.sendMessage}
            onDelete={() => {console.log('ondelete');}}
            cssClass="messaging-send-group"/>
      </form>
    );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = {
  saveMessage,
  sendMessage,
  setCategory,
  setSubject,
  setSubjectRequired,
  setRecipient,
  fetchRecipients
};

export default connect(mapStateToProps, mapDispatchToProps)(Compose);
