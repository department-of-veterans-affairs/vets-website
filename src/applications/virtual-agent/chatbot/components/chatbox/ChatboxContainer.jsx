import PropTypes from 'prop-types';
import React from 'react';

/**
 * @typedef {Object} ChatboxContainerProps
 * @property {React.ReactNode} children
 * @property {string} [title]
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
}) {
  return (
    <div
      className="vads-u-padding--1p5 vads-u-background-color--gray-lightest"
      data-testid="chatbox-container"
    >
      <div className="vads-u-background-color--primary-darker vads-u-padding--1p5">
        <h2
          className="vads-u-font-size--lg vads-u-color--white vads-u-margin--0"
          id="chatbot-header"
          tabIndex="-1"
        >
          {title}
        </h2>
      </div>
      <div className="vads-u-padding--1p5">{children}</div>
    </div>
  );
}

ChatboxContainer.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};
