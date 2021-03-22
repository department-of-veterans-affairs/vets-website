import React from 'react';

const CTALink = ({ CTA }) => {
  const { ariaLabel, href, text, onClick } = CTA;

  return (
    <a
      aria-label={ariaLabel ? `${ariaLabel} (opens in new tab)` : ''}
      href={href}
      rel="noreferrer noopener"
      target="_blank"
      onClick={onClick || undefined}
      className="vads-u-margin-top--2"
    >
      {text}
      <i
        aria-hidden="true"
        className="fas fa-xs fa-chevron-right vads-u-margin-x--1"
      />
    </a>
  );
};

export default CTALink;
