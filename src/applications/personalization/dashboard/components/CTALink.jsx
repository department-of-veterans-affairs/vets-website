import React from 'react';
import PropTypes from 'prop-types';

const CTALink = ({
  ariaLabel,
  className,
  href,
  text,
  onClick,
  newTab,
  // optional data-testid attribute-value
  testId,
  showArrow,
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
      {showArrow && (
        <va-icon
          icon="chevron_right"
          size={3}
          className="vads-u-margin-left--1"
          aria-hidden="true"
        />
      )}
    </a>
  );
};

CTALink.propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  href: PropTypes.string,
  newTab: PropTypes.bool,
  showArrow: PropTypes.bool,
  testId: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func,
};

export default CTALink;
