import React from 'react';

const BaseLink = ({ children, onClick, ariaLabel, usePrimary, testId }) => {
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
};

const PrimaryActionLink = props => <BaseLink usePrimary {...props} />;
const SecondaryActionLink = props => <BaseLink usePrimary={false} {...props} />;

export { PrimaryActionLink, SecondaryActionLink };
