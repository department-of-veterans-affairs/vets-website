import React from 'react';
import CallToActionAlert from '../../../platform/site-wide/cta-widget/CallToActionAlert';

export default class DocumentStatus extends React.Component {
  translateStatus(status) {
    switch (status) {
      case 'recieved':
        return 'The document has been recieved by central mail';
      case 'processing':
        return '';
      case 'success':
        return '';
      case 'error':
        return '';
      default:
        return 'howd you get here';
    }
  }

  render() {
    return (
      <div className="content">
        <h1> Congratulations! </h1>
        <h2>
          {' '}
          Your submission has been recieved by a downstream system and is being
          handled accordingly.
        </h2>
        <h3>The current status is: {this.props.status}</h3>
        <hr />
        <CallToActionAlert
          heading={`Status info: ${this.translateStatus(this.props.status)}`}
          status="info"
        />
      </div>
    );
  }
}
