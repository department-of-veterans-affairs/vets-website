import PropTypes from 'prop-types';
import React from 'react';

import ChatMessageError from './ChatMessageError';
import ChatMessageItem from './ChatMessageItem';

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {'user'|'va'} sender
 * @property {string} text
 */

/**
 * @typedef {Object} ChatMessageListProps
 * @property {ChatMessage[]} messages
 * @property {string} [errorMessage]
 */

/**
 * Chat message list (message thread).
 * @component
 * @param {ChatMessageListProps} props
 * @returns {JSX.Element}
 */
export default function ChatMessageList({ messages, errorMessage }) {
  return (
    <ul
      aria-live="polite"
      className="vads-u-margin--0 vads-u-padding--0"
      data-testid="chat-message-list"
      style={{ listStyle: 'none' }}
    >
      {messages.map(message => (
        <ChatMessageItem key={message.id} message={message} />
      ))}
      {errorMessage ? <ChatMessageError message={errorMessage} /> : null}
    </ul>
  );
}

ChatMessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      sender: PropTypes.oneOf(['user', 'va']).isRequired,
      text: PropTypes.string.isRequired,
    }),
  ).isRequired,
  errorMessage: PropTypes.string,
};
