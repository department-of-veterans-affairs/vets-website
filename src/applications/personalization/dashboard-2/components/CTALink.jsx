import React from 'react';

import useLastWord from '../useLastWord';

const CTALink = ({ ariaLabel, href, text, onClick, newTab }) => {
  const relProp = newTab ? 'noreferrer noopener' : undefined;
  const targetProp = newTab ? '_blank' : undefined;

  const [lastWord, firstWords] = useLastWord(text);

  return (
    <a
      aria-label={ariaLabel ? `${ariaLabel}` : ''}
      href={href}
      rel={relProp}
      target={targetProp}
      onClick={onClick || undefined}
      className="vads-u-margin-top--2 vads-u-display--inline-block"
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
