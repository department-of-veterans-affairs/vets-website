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
 * VA icon for message list items.
 * @component
 * @returns {JSX.Element}
 */
export default function ChatIconVA() {
  return (
    <span
      aria-label="VA"
      className="vads-u-background-color--primary-darker vads-u-color--white vads-u-font-weight--bold vads-u-font-size--xs"
      data-testid="chat-icon-va"
      role="img"
      style={baseIconStyle}
    >
      VA
    </span>
  );
}
