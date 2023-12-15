import PropTypes from 'prop-types';
import React from 'react';

// See github.com/department-of-veterans-affairs/va.gov-team/issues/11852
// Updated with lang="en" span from the Find a form download links
const DownloadPDF = ({ formNumber = '', fileName = '', size = '' }) => (
  <a
    href={`https://www.vba.va.gov/pubs/forms/${fileName}.pdf`}
    download={`${fileName}.pdf`}
    type="application/pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="vads-u-text-decoration--none"
  >
    <i
      aria-hidden="true"
      className="fas fa-download fa-lg vads-u-padding-right--1"
      role="img"
    />
    <span lang="en" className="vads-u-text-decoration--underline">
      Download VA Form {formNumber}{' '}
      <dfn>
        <abbr title="Portable Document Format">PDF</abbr> ({size}
        <abbr title="Megabytes">MB</abbr>)
      </dfn>
    </span>
  </a>
);

DownloadPDF.propTypes = {
  fileName: PropTypes.string,
  formNumber: PropTypes.string,
  size: PropTypes.string,
};

export default DownloadPDF;
