import React from 'react';
import { connect } from 'react-redux';

import { messageCategories, composeMessageErrors, composeMessagePlaceholders } from '../config';
import MessageCategory from '../components/compose/MessageCategory';
import MessageSubject from '../components/compose/MessageSubject';
import MessageRecipient from '../components/compose/MessageRecipient';
import {
  setCategory,
  setRecipient,
  setSubject,
  fetchRecipients
} from '../actions/compose';

class Compose extends React.Component {
  constructor() {
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

  dispatchRecipientChange(event) {
    this.props.setRecipient(event);
  }

  render() {
    return (
      <div>
        <h2>New message</h2>
        <p>
          <strong>Note:</strong> Messages may be saved to your health record at
          your team's discretion.
        </p>
<<<<<<< 28c8e780f1b738c0fbcb50c64fbc43aeb8accd35
        <fieldset className="messaging-subject-group">
          <legend>Subject line:</legend>
          <div>
            <MessageCategory
                categories={messageCategories}
                errorMessage={composeMessageErrors.category}
                onValueChange={this.handleCategoryChange}
                value={this.props.compose.category}/>
            <MessageSubject
                additionalClass="messaging-subject-subject"
                errorMessage={composeMessageErrors.subjet}
                onValueChange={this.handleSubjectChange}
                placeholder={composeMessagePlaceholders.subject}
                required={this.props.compose.subject.required}
                value={this.props.compose.subject.value}/>
          </div>
        </fieldset>
=======

        <MessageRecipient
            categories={messageCategories}
            errorMessage={composeMessageErrors.recipient}
            onValueChange={this.dispatchRecipientChange}
            options={this.props.compose.recipients}
            value={this.props.compose.recipient}/>
        <MessageCategory
            categories={messageCategories}
            errorMessage={composeMessageErrors.category}
            onValueChange={this.dispatchCategoryChange}
            value={this.props.compose.category}/>
        <MessageSubject
            errorMessage={composeMessageErrors.subjet}
            onValueChange={this.dispatchSubjectChange}
            value={this.props.compose.subject}/>
>>>>>>> Adds MessageRecipient component
      </div>
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
<<<<<<< 28c8e780f1b738c0fbcb50c64fbc43aeb8accd35
  setSubjectRequired
=======
  setRecipient,
  fetchRecipients
>>>>>>> Adds MessageRecipient component
};

export default connect(mapStateToProps, mapDispatchToProps)(Compose);
