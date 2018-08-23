import React from 'react';
import messagingManifest from '../manifest.json';

class MessageProviderLink extends React.Component {
  render() {
    return (
      <a
        className="usa-button rx-message-provider-link"
        href={`${messagingManifest.rootUrl}/compose`}>
        Message my provider
      </a>
    );
  }
}

export default MessageProviderLink;
