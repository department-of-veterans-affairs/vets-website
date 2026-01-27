import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import ChatMessageIcon from './ChatMessageIcon';

const SENDER_TYPES = {
  USER: 'user',
  VA: 'va',
};

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {string} sender
 * @property {string} text
 */

/**
 * @typedef {Object} ChatMessageItemProps
 * @property {ChatMessage} message
 */

const buildBubbleClassNames = isUser => {
  return classNames(
    'va-chatbot-message-bubble vads-u-padding-y--1 vads-u-padding-x--1p5',
    {
      'va-chatbot-message-bubble--va vads-u-background-color--primary-alt-lightest vads-u-border-color--primary': !isUser,
      'va-chatbot-message-bubble--user vads-u-background-color--gray-lightest vads-u-margin-left--auto': isUser,
    },
  );
};

const buildNubClassNames = isUser => {
  return classNames('va-chatbot-message-nub', {
    'va-chatbot-message-nub--user': isUser,
    'va-chatbot-message-nub--va': !isUser,
  });
};

/**
 * Chat message entry item.
 * @component
 * @param {ChatMessageItemProps} props
 * @returns {JSX.Element}
 */
export default function ChatMessageItem({ message }) {
  const isUser = message.sender === SENDER_TYPES.USER;

  return (
    <li
      className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--1p5"
      data-testid="chat-message-item"
    >
      {!isUser && (
        <div className="vads-u-margin-right--1">
          <ChatMessageIcon user={isUser} />
        </div>
      )}

      <div className={buildBubbleClassNames(isUser)}>
        <svg
          aria-hidden="true"
          className={buildNubClassNames(isUser)}
          focusable="false"
          viewBox="0 0 10 10"
        >
          <path
            className="va-chatbot-message-nub__path"
            d="M10 0 L0 0 L10 10"
          />
        </svg>
        <p className="vads-u-margin--0">{message.text}</p>
      </div>

      {isUser && (
        <div className="vads-u-margin-left--1">
          <ChatMessageIcon user={isUser} />
        </div>
      )}
    </li>
  );
}

ChatMessageItem.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    sender: PropTypes.oneOf([SENDER_TYPES.USER, SENDER_TYPES.VA]).isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
};
