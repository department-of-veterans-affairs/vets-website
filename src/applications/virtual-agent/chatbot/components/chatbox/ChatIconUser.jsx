import React from 'react';

const baseIconStyle = {
  alignItems: 'center',
  borderRadius: '999px',
  display: 'inline-flex',
  flexShrink: 0,
  height: '2rem',
  justifyContent: 'center',
  width: '2rem',
};

/**
 * User icon for message list items.
 * @component
 * @returns {JSX.Element}
 */
export default function ChatIconUser() {
  return (
    <span
      aria-label="You"
      className="vads-u-background-color--gray-dark vads-u-color--white vads-u-font-weight--bold vads-u-font-size--xs"
      data-testid="chat-icon-user"
      role="img"
      style={baseIconStyle}
    >
      You
    </span>
  );
}
