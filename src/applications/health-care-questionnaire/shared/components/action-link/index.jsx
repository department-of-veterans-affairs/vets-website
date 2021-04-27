import React from 'react';
import './style.scss';

export default function index({
  children,
  onClick,
  ariaLabel,
  usePrimary,
  testId,
}) {
  const className = `vads-c-action-link--${usePrimary ? 'green' : 'blue'}`;
  return (
    <a
      href="#"
      date-testId={testId}
      className={`${className} vads-u-padding-left--0`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
