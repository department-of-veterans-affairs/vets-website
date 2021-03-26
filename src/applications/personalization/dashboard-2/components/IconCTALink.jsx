import React from 'react';

const IconCTALink = ({
  ariaLabel,
  href,
  text,
  // icon should be a valid Font Awesome 5 icon name
  icon,
  onClick,
  boldText,
  newTab,
}) => {
  const linkClass = `vads-u-text-decoration--none vads-u-padding-y--2p5 cta-link vads-u-font-weight--${
    boldText ? 'bold' : 'normal'
  }`;

  const relProp = newTab ? 'noreferrer noopener' : undefined;
  const targetProp = newTab ? '_blank' : undefined;

  return (
    <a
      aria-label={ariaLabel ? `${ariaLabel}` : ''}
      href={href}
      rel={relProp}
      target={targetProp}
      onClick={onClick || undefined}
      className={linkClass}
    >
      <span className="vads-u-display--flex">
        <span className="fa-stack fa-sm vads-u-height--full vads-u-margin-right--1">
          <i
            aria-hidden="true"
            className="fas fa-circle fa-stack-2x vads-u-color--primary-alt-lightest"
          />
          <i aria-hidden="true" className={`fas fa-${icon} fa-stack-1x`} />
        </span>
        <span>
          {text}
          <i
            aria-hidden="true"
            className="fas fa-xs fa-chevron-right vads-u-margin-left--1"
          />
        </span>
      </span>
    </a>
  );
};

export default IconCTALink;
