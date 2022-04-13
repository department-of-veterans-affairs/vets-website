import React from 'react';
import PropTypes from 'prop-types';

const DownloadLink = ({ href, label }) => (
  <a href={href}>
    <i aria-hidden="true" className="fas fa-download vads-u-padding-right--1" />
    {label}
  </a>
);

DownloadLink.propTypes = {
  href: PropTypes.string,
  label: PropTypes.string,
};

export default DownloadLink;
