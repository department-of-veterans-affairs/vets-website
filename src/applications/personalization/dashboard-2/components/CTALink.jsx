import React from 'react';

import useLastWord from '../useLastWord';

const CTALink = ({ ariaLabel, className, href, text, onClick, newTab }) => {
  const relProp = newTab ? 'noreferrer noopener' : undefined;
  const targetProp = newTab ? '_blank' : undefined;

  const [lastWord, firstWords] = useLastWord(text);
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
      {`${firstWords} `}
      <span style={{ whiteSpace: 'nowrap' }}>
        {lastWord}
        <i
          aria-hidden="true"
          className="fas fa-xs fa-chevron-right vads-u-margin-left--1"
        />
      </span>
    </a>
  );
};

export default CTALink;
