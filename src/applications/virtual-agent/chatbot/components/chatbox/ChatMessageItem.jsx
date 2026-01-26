import PropTypes from 'prop-types';
import React from 'react';

import ChatIconUser from './ChatIconUser';
import ChatIconVA from './ChatIconVA';

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {'user'|'va'} sender
 * @property {string} text
 */

/**
 * @typedef {Object} ChatMessageItemProps
 * @property {ChatMessage} message
 */

const bubbleClassNames =
  'vads-u-background-color--white vads-u-border--1px vads-u-border-color--gray-light vads-u-padding--1p5';

/**
 * Chat message entry item.
 * @component
 * @param {ChatMessageItemProps} props
 * @returns {JSX.Element}
 */
export default function ChatMessageItem({ message }) {
  const isUser = message.sender === 'user';
  const Icon = isUser ? ChatIconUser : ChatIconVA;

  return (
    <li
      className="vads-u-display--flex vads-u-align-items--flex-start vads-u-margin-bottom--1p5"
      data-testid="chat-message-item"
    >
      <div className="vads-u-margin-right--1">
        <Icon />
      </div>
      <div className={bubbleClassNames}>
        <p className="vads-u-margin--0">{message.text}</p>
      </div>
    </li>
  );
}

ChatMessageItem.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    sender: PropTypes.oneOf(['user', 'va']).isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
};
