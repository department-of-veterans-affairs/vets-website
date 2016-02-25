import React from 'react';

/**
 * An error message to be included conditionally by question components in an error state.
 */
class ErrorMessage extends React.Component {
  render() {
    return (
      <span className="usa-input-error-message"
          id={`input-error-message-${this.props.idPrefix}`}
          role="alert">{this.props.message}</span>
    );
  }
}

export default ErrorMessage;
