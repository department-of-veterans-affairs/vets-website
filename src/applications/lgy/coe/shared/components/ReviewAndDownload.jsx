import React from 'react';

import environment from 'platform/utilities/environment';

const downloadUrl = `${environment.API_URL}/v0/coe/download_coe`;

const ReviewAndDownload = () => (
  <>
    <h2 className="vads-u-margin-top--0">Review and download your COE</h2>
    <p>
      You can download your COE right now. If you need help, go to our
      instructions for how to download and open a VA.gov PDF form.
      <br />
      <a href="/resources/how-to-download-and-open-a-vagov-pdf-form/">
        Get instructions for downloading a VA.gov PDF
      </a>
    </p>
    <div className="vads-u-margin-top--4">
      <va-link
        download
        filetype="PDF"
        pages="1"
        href={downloadUrl}
        filename={downloadUrl}
        text="Download your COE"
      />
    </div>
  </>
);

export default ReviewAndDownload;
