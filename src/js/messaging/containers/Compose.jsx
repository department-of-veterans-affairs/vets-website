import React from 'react';
import { connect } from 'react-redux';

import { messageCategories, composeMessageErrors } from '../config.js';
import MessageCategory from '../components/compose/MessageCategory';
import MessageSubject from '../components/compose/MessageSubject';
import MessageRecipient from '../components/compose/MessageRecipient';
import {
  setCategory,
  setRecipient,
  setSubject,
  fetchRecipients
} from '../actions/compose.js';

class Compose extends React.Component {
  constructor() {
    super();
    this.dispatchCategoryChange = this.dispatchCategoryChange.bind(this);
    this.dispatchSubjectChange = this.dispatchSubjectChange.bind(this);
    this.dispatchRecipientChange = this.dispatchRecipientChange.bind(this);
  }

  componentWillMount() {
    this.props.fetchRecipients();
  }

  dispatchCategoryChange(valueObj) {
    this.props.setCategory(valueObj);
    this.props.setSubject(valueObj);
  }

  dispatchSubjectChange(valueObj) {
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
  setRecipient,
  fetchRecipients
};

export default connect(mapStateToProps, mapDispatchToProps)(Compose);
