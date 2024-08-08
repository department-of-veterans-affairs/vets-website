import React from 'react';

const PageLink = ({ href, text, target, isEmail }) => {
  return (
    <a href={isEmail ? `mailto:${href}` : href} target={target}>
      {text}
    </a>
  );
};

export default PageLink;
