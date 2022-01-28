import React from 'react';

const DownloadLink = ({ href, text }) => (
  <a className="vads-u-margin--0" href={href}>
    <i aria-hidden="true" className="fas fa-download vads-u-padding-right--1" />
    {text}
  </a>
);

export default DownloadLink;
