import React from 'react';

const IconCTALink = ({ CTA }) => {
  const { ariaLabel, href, text, icon, onClick, boldText } = CTA;

  const linkClass = `vads-u-text-decoration--none vads-u-padding-y--2p5 vads-u-padding-x--1 cta-link vads-u-font-weight--${
    boldText ? 'bold' : 'normal'
  }`;

  return (
    <a
      aria-label={ariaLabel ? `${ariaLabel} (opens in new tab)` : ''}
      href={href}
      rel="noreferrer noopener"
      target="_blank"
      onClick={onClick || undefined}
      className={linkClass}
    >
      <span className="fa-stack fa-sm vads-u-margin-right--1">
        <i
          aria-hidden="true"
          className="fas fa-circle fa-stack-2x vads-u-color--primary-alt-lightest"
        />
        <i aria-hidden="true" className={`fas fa-${icon} fa-stack-1x`} />
      </span>
      {text}
      <i
        aria-hidden="true"
        className="fas fa-xs fa-chevron-right vads-u-margin-x--1"
      />
    </a>
  );
};

export default IconCTALink;
