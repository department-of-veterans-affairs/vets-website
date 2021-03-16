import React from 'react';

const NotificationCTA = ({ CTA }) => {
  const { ariaLabel, href, text, icon } = CTA;

  return (
    <a
      aria-label={ariaLabel ? `${ariaLabel} (opens in new tab)` : ''}
      className="vads-u-font-weight--bold vads-u-background-color--primary-alt-lightest vads-u-padding--1 vads-u-margin-top--2"
      href={href}
      rel="noreferrer noopener"
      target="_blank"
    >
      <i aria-hidden="true" className={`fas fa-${icon} vads-u-margin-x--1`} />
      {text}
      <i
        aria-hidden="true"
        className="fas fa-chevron-right vads-u-margin-x--1"
      />
    </a>
  );
};

export default NotificationCTA;
