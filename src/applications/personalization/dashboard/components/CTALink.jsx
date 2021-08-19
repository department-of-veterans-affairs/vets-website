import React from 'react';

const CTALink = ({ ariaLabel, className, href, text, onClick, newTab }) => {
  const relProp = newTab ? 'noreferrer noopener' : undefined;
  const targetProp = newTab ? '_blank' : undefined;

  const classNames = `vads-u-display--inline-block ${className}`;

  return (
    <a
      aria-label={ariaLabel ? `${ariaLabel}` : ''}
      href={href}
      rel={relProp}
      target={targetProp}
      onClick={onClick || undefined}
      className={classNames}
    >
      {text}
    </a>
  );
};

export default CTALink;
