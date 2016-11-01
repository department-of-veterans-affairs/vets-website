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
      <a onClick={this.handleClick}>&lt; {this.props.text}</a>
    );
  }
}

BackLink.contextTypes = {
  router: React.PropTypes.object.isRequired
};

BackLink.propTypes = {
  text: React.PropTypes.string.isRequired
};

export default BackLink;
