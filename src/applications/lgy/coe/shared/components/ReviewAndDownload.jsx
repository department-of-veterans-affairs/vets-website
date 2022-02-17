import React from 'react';
import PropTypes from 'prop-types';

const ReviewAndDownload = ({ downloadUrl }) => (
  <>
    <div>
      <h2>Review and download your COE</h2>
      <p>
        You can download your COE right now. If you need help, go to our
        instructions for how to download and open a VA.gov PDF form.
        <br />
        <a href="/resources/how-to-download-and-open-a-vagov-pdf-form/">
          Get instructions for downloading a VA.gov PDF
        </a>
      </p>
    </div>
    <div className="vads-u-margin-top--4">
      <a href={downloadUrl}>
        <i
          className="fas fa-download vads-u-padding-right--1"
          aria-hidden="true"
        />
        Download your COE (PDF) 0.20MB
      </a>
    </div>
  </>
);

ReviewAndDownload.propTypes = {
  downloadUrl: PropTypes.string.isRequired,
};

export default ReviewAndDownload;
