import React from 'react';

const CTALink = ({ ariaLabel, href, text, onClick, newTab }) => {
  const relProp = newTab ? 'noreferrer noopener' : undefined;
  const targetProp = newTab ? '_blank' : undefined;

  return (
    <a
      aria-label={ariaLabel ? `${ariaLabel}` : ''}
      href={href}
      rel={relProp}
      target={targetProp}
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
