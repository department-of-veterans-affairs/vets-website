import PropTypes from 'prop-types';
import React from 'react';

/**
 * @typedef {Object} ChatboxContainerProps
 * @property {React.ReactNode} children
 * @property {string} [title]
 * @property {function(): void} [onDeleteConversation]
 */

/**
 * Chatbox container with header and body.
 * @component
 * @param {ChatboxContainerProps} props
 * @returns {JSX.Element}
 */
export default function ChatboxContainer({
  children,
  title = 'VA chatbot (beta)',
  onDeleteConversation,
}) {
  return (
    <div
      className="vads-u-padding--1p5 vads-u-background-color--gray-lightest"
      data-testid="chatbox-container"
    >
      <div className="vads-u-background-color--primary-darker vads-u-padding--1p5 vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center">
        <h2
          className="vads-u-font-size--lg vads-u-color--white vads-u-margin--0"
          id="chatbot-header"
          tabIndex="-1"
        >
          {title}
        </h2>
        {onDeleteConversation ? (
          // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
          <button
            type="button"
            aria-label="Clear conversation"
            className="vads-u-background-color--transparent vads-u-border--0 vads-u-padding--0 vads-u-color--white"
            data-testid="chat-delete-button"
            onClick={onDeleteConversation}
          >
            <va-icon icon="delete" size={3} />
          </button>
        ) : null}
      </div>
      <div className="vads-u-background-color--white va-chatbot-chatbox-container">
        {children}
      </div>
    </div>
  );
}

ChatboxContainer.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  onDeleteConversation: PropTypes.func,
};
