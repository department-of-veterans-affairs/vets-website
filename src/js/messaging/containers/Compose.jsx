import React from 'react';
import { connect } from 'react-redux';

import { messageCategories, messageCategoryError } from '../config.js';
import MessageCategory from '../components/compose/MessageCategory';
import { setCategory } from '../actions/compose.js';

class Compose extends React.Component {
  constructor() {
    super();
    this.dispatchCategoryChange = this.dispatchCategoryChange.bind(this);
  }

  dispatchCategoryChange(event) {
    this.props.dispatch(setCategory(event));
  }

  render() {
    return (
      <div>
        <h2>New message</h2>
        <MessageCategory
            categories={messageCategories}
            errorMessage={messageCategoryError}
            onValueChange={this.dispatchCategoryChange}
            value={this.props.compose.category}/>
      </div>
    );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Compose);

// export default Compose;
