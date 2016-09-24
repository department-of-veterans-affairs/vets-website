import React from 'react';
import { browserHistory } from 'react-router';

class ComposeButton extends React.Component {
  constructor(props) {
    super(props);
    this.goToComposeMessage = this.goToComposeMessage.bind(this);
  }

  goToComposeMessage() {
    browserHistory.push('/messaging/compose');
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

export default ComposeButton;
