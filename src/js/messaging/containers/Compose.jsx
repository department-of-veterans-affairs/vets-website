import React from 'react';
import { connect } from 'react-redux';

import { messageCategories, composeMessageErrors, composeMessagePlaceholders } from '../config';
import MessageCategory from '../components/compose/MessageCategory';
import MessageSubject from '../components/compose/MessageSubject';
import { setCategory, setSubject, setSubjectRequired } from '../actions/compose';

class Compose extends React.Component {
  constructor() {
    super();
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
  }

  handleCategoryChange(valueObj) {
    this.props.setCategory(valueObj);
    this.props.setSubjectRequired(valueObj);
  }

  handleSubjectChange(valueObj) {
    this.props.setSubject(valueObj);
  }

  render() {
    return (
      <div>
        <h2>New message</h2>
        <p>
          <strong>Note:</strong> Messages may be saved to your health record at
          your team's discretion.
        </p>
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
  setSubjectRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Compose);
