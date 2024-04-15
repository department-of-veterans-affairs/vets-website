import React from 'react';
import PropTypes from 'prop-types';

/**
 * Download link
 * @param {string} url - URL to downloadable file
 * @param {string|element} content - Link content
 * @param {string|number} size - PDF size in MB
 * @returns {element}
 */
const DownloadLink = ({ url = '', content, size }) => {
  const fileName = url.split('/').slice(-1);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      type="application/pdf"
      download={fileName}
    >
      <i
        aria-hidden="true"
        className="fas fa-download vads-u-padding-right--1"
        role="img"
      />
      {content}{' '}
      <dfn>
        <abbr title="Portable Document Format">PDF</abbr> ({size}
        <abbr title="Megabytes">MB</abbr>)
      </dfn>
    </a>
  );
};

DownloadLink.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  size: PropTypes.string,
  url: PropTypes.string,
};

export default DownloadLink;
