import React from 'react';

class ComposeButton extends React.Component {
  constructor(props) {
    super(props);
    this.goToComposeMessage = this.goToComposeMessage.bind(this);
  }

  goToComposeMessage() {
    this.context.router.push('/compose');
  }

  render() {
    return (
      <button
          onClick={this.goToComposeMessage}
          className="va-button-primary messaging-compose-button">
        Compose a message
      </button>
    );
  }
}

ComposeButton.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default ComposeButton;
