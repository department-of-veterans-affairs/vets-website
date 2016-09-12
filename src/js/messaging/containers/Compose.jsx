import React from 'react';
import { connect } from 'react-redux';

import { messageCategories, composeMessageErrors } from '../config.js';
import MessageCategory from '../components/compose/MessageCategory';
import MessageSubject from '../components/compose/MessageSubject';
import { setCategory, setSubject } from '../actions/compose.js';

class Compose extends React.Component {
  constructor() {
    super();
    this.dispatchCategoryChange = this.dispatchCategoryChange.bind(this);
    this.dispatchSubjectChange = this.dispatchSubjectChange.bind(this);
  }

  dispatchCategoryChange(valueObj) {
    this.props.setCategory(valueObj);
    this.props.setSubject(valueObj);
  }

  dispatchSubjectChange(valueObj) {
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
  setSubject
};

export default connect(mapStateToProps, mapDispatchToProps)(Compose);
