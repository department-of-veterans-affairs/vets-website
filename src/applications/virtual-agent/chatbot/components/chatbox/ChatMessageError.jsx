import PropTypes from 'prop-types';
import React from 'react';

/**
 * @typedef {Object} ChatMessageErrorProps
 * @property {string} message
 */

/**
 * Chat error message item.
 * @component
 * @param {ChatMessageErrorProps} props
 * @returns {JSX.Element}
 */
export default function ChatMessageError({ message }) {
  return (
    <li data-testid="chat-message-error">
      <va-alert status="error" visible slim>
        {/* we would only need the headline if using the non-slim version. Leaving for now while we discuss */}
        <h3 slot="headline">We ran into a problem</h3>
        <p className="vads-u-margin--0">{message}</p>
      </va-alert>
    </li>
  );
}

ChatMessageError.propTypes = {
  message: PropTypes.string.isRequired,
};
