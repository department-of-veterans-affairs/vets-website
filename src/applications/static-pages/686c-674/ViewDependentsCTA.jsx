import React, { Component } from 'react';

class ViewDependentsCTA extends Component {
  state = {
    isIncludedInFlipper: false,
  };

  render() {
    let content;
    if (this.state.isIncludedInFlipper === false) {
      content = <div>We did a thing</div>;
    } else {
      content = '';
    }
    return <div>{content}</div>;
  }
}

export default ViewDependentsCTA;
