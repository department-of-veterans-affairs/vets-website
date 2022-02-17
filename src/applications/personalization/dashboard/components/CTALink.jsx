import React from 'react';

const CTALink = ({
  ariaLabel,
  className,
  href,
  text,
  onClick,
  newTab,
  // optional data-testid attribute-value
  testId,
}) => {
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
      data-testid={testId || ''}
    >
      {text}
    </a>
  );
};

export default CTALink;
