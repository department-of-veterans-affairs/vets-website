import React from 'react';
import { connect } from 'react-redux';

import { messageCategories, composeMessageErrors, composeMessagePlaceholders } from '../config';
import MessageCategory from '../components/compose/MessageCategory';
import MessageFrom from '../components/compose/MessageFrom';
import MessageSubject from '../components/compose/MessageSubject';
import MessageRecipient from '../components/compose/MessageRecipient';
import {
  setCategory,
  setRecipient,
  setSubject,
  setSubjectRequired,
  fetchRecipients
} from '../actions/compose';

class Compose extends React.Component {
  constructor() {
    super();
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.handleRecipientChange = this.handleRecipientChange.bind(this);
  }

  componentWillMount() {
    this.props.fetchRecipients();
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
    return (
      <form id="messaging-compose">
        <h2>New message</h2>
        <p>
          <strong>Note:</strong> Messages may be saved to your health record at
          your team's discretion.
        </p>
        <MessageFrom
            cssClass="messaging-from"
            lastName="Veteran"
            firstName="Jane"
            middleName="Q."/>
        <MessageRecipient
            categories={messageCategories}
            errorMessage={composeMessageErrors.recipient}
            cssClass="messaging-recipient"
            onValueChange={this.handleRecipientChange}
            options={this.props.compose.recipients}
            value={this.props.compose.recipient}/>

        <fieldset className="messaging-subject-group">
          <legend>Subject line:</legend>
          <div>
            <MessageCategory
                categories={messageCategories}
                cssClass="messaging-category"
                errorMessage={composeMessageErrors.category}
                onValueChange={this.handleCategoryChange}
                value={this.props.compose.category}/>
            <MessageSubject
                cssClass="messaging-subject"
                errorMessage={composeMessageErrors.subjet}
                onValueChange={this.handleSubjectChange}
                placeholder={composeMessagePlaceholders.subject}
                required={this.props.compose.subject.required}/>
          </div>
        </fieldset>
      </form>
    );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = {
  setCategory,
  setSubject,
  setSubjectRequired,
  setRecipient,
  fetchRecipients
};

export default connect(mapStateToProps, mapDispatchToProps)(Compose);
