import React from 'react';

class ChatboxDisclaimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { accepted: false };
    this.handleDisclaimerAcceptedOnClick = this.handleDisclaimerAcceptedOnClick.bind(
      this,
    );
  }

  handleDisclaimerAcceptedOnClick() {
    return false;
  }

  render() {
    return (
      <div
        data-testid={'disclaimer'}
        style={{ height: '550px', width: '100%' }}
      >
        >
        <ul>
          <li>
            This virtual agent is still in development and cannot help with
            personal, medical or mental health emergencies. Thank you for your
            understanding.
          </li>
          <li>
            We keep a record of all virtual agent conversations, so we ask that
            you do not enter personal information that can be used to identify
            you.
          </li>
        </ul>
        <a href="#" onClick={this.handleDisclaimerAcceptedOnClick()}>
          Accept
        </a>
      </div>
    );
  }
}

export default ChatboxDisclaimer;
