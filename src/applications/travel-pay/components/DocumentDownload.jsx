import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const DocumentDownload = ({ claimId, documentId, filename, text }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const downloadLinkHandler = async (e, docId) => {
    setError('');
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    e.preventDefault();

    try {
      const response = await apiRequest(
        `${
          environment.API_URL
        }/travel_pay/v0/claims/${claimId}/documents/${docId}`,
      );

      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], {
        type: response.headers.get('Content-Type'),
      });

      const objUrl = URL.createObjectURL(blob);
      if (objUrl) {
        const link = document.createElement('a');
        link.href = objUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(objUrl);
      }
    } catch (_) {
      setError(
        'We were unable to get your file to download. Please try again later.',
      );
    }
    setIsLoading(false);
  };

  return (
    <span aria-live="polite">
      {isLoading && (
        <va-icon
          srtext={`Downloading ${filename}`}
          class="travel-pay-download-loading-icon"
          icon="autorenew"
        />
      )}
      <va-link
        download={!isLoading}
        text={text}
        onClick={e => downloadLinkHandler(e, documentId)}
        href=""
      />
      {error && (
        <div className="travel-pay-download-error">
          <va-icon srtext={error} icon="error" />
          {error}
        </div>
      )}
    </span>
  );
};

DocumentDownload.propTypes = {
  claimId: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default DocumentDownload;
