import PropTypes from 'prop-types';
import React from 'react';

import ChatMessageError from './ChatMessageError';
import ChatMessageItem from './ChatMessageItem';

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {'user'|'va'} sender
 * @property {string} text
 * @property {{ text: string, payload: string }[]} [quickReplies]
 */

/**
 * @typedef {Object} ChatMessageListProps
 * @property {ChatMessage[]} messages
 * @property {string} [errorMessage]
 * @property {function(string): void} [onQuickReply]
 */

/**
 * Chat message list (message thread).
 * @component
 * @param {ChatMessageListProps} props
 * @returns {JSX.Element}
 */
export default function ChatMessageList({
  messages,
  errorMessage,
  onQuickReply,
}) {
  const lastMessage = messages[messages.length - 1];
  const quickReplies =
    lastMessage && Array.isArray(lastMessage.quickReplies)
      ? lastMessage.quickReplies
      : [];

  return (
    <ul
      aria-live="polite"
      className="vads-u-margin--0 vads-u-padding--1p5"
      data-testid="chat-message-list"
      style={{ listStyle: 'none' }}
    >
      {messages.map(message => (
        <ChatMessageItem key={message.id} message={message} />
      ))}
      {quickReplies.length > 0 && onQuickReply ? (
        <li
          className="vads-u-margin-bottom--1p5"
          data-testid="chat-quick-replies"
        >
          <div className="vads-u-display--flex vads-u-flex-wrap--wrap vads-u-gap--1 vads-u-justify-content--flex-end">
            {quickReplies.map(reply => (
              <va-button
                key={`${reply.text}-${reply.payload}`}
                data-testid="chat-quick-reply-button"
                secondary
                text={reply.text}
                onClick={() => onQuickReply(reply.payload)}
              />
            ))}
          </div>
        </li>
      ) : null}
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
      quickReplies: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string.isRequired,
          payload: PropTypes.string.isRequired,
        }),
      ),
    }),
  ).isRequired,
  errorMessage: PropTypes.string,
  onQuickReply: PropTypes.func,
};
