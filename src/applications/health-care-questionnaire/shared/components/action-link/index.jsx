import React from 'react';
import { isBrowser } from '../../../shared/components/print/utils';

const BaseLink = ({ children, onClick, ariaLabel, usePrimary, testId }) => {
  const className = `vads-c-action-link--${usePrimary ? 'green' : 'blue'} ${
    isBrowser(window).isIE ? 'action-link-ie' : ''
  }`;
  return (
    <a
      href="#"
      data-testid={testId}
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
