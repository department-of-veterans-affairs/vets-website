import React from 'react';

import environment from 'platform/utilities/environment';

import DownloadLink from './DownloadLink';

const downloadLinkLabel = 'Download your COE (PDF) 0.20MB';

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
      <DownloadLink href={downloadUrl} label={downloadLinkLabel} />
    </div>
  </>
);

export default ReviewAndDownload;
