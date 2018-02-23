import PropTypes from 'prop-types';
import React from 'react';

class PlainTextMessage extends React.Component {
  render() {
    return (
      <div className="plaintext-message">
        <h3>{this.props.headline}</h3>
        <div>
          {this.props.content}
        </div>
        <div className="alert-actions">
          {this.props.primaryButton && <button className="usa-button" onClick={this.props.primaryButton.action}>{this.props.primaryButton.text}</button>}
          {this.props.secondaryButton && <button className="usa-button-secondary" onClick={this.props.secondaryButton.action}>{this.props.secondaryButton.text}</button>}
        </div>
      </div>
    );
  }

}

PlainTextMessage.propTypes = {
  headline: PropTypes.string,
  content: PropTypes.node.isRequired,
  primaryButton: PropTypes.shape({
    text: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
  }),
  secondaryButton: PropTypes.shape({
    text: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
  })
};

export default PlainTextMessage;
