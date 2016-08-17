import React from 'react';

class BackLink extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.context.router.goBack();
  }

  render() {
    return (
      <a onClick={this.handleClick}>&lt; Back to list</a>
    );
  }
}

BackLink.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default BackLink;
