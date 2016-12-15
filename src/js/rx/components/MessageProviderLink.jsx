import React from 'react';

class MessageProviderLink extends React.Component {
  render() {
    return (
      <a
          className="usa-button rx-message-provider-link"
          href="/healthcare/messaging/compose">
        Message my provider
      </a>
    );
  }
}

export default MessageProviderLink;
