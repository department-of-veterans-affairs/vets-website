import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  fetchPdfApi,
  downloadBlob,
  formatPdfFilename,
} from '../../utils/pdfDownload';

/**
 * DownloadFormPDF Component
 * Provides functionality to download the completed VA Form 21-0779 as a PDF
 *
 * @param {Object} props - Component props
 * @param {string} props.guid - The submission GUID
 * @param {Object} props.veteranName - The veteran's name for the filename
 */
export const DownloadFormPDF = ({ guid, veteranName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate filename for the download
  const filename = useMemo(
    () => {
      return formatPdfFilename(veteranName);
    },
    [veteranName],
  );

  // Handle PDF download
  const handleDownload = useCallback(
    async () => {
      if (!guid) {
        setError('No submission ID available. Please submit the form first.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch the PDF blob from the API
        const blob = await fetchPdfApi(guid);

        // Trigger browser download
        downloadBlob(blob, filename);
      } catch (err) {
        setError(
          "We're sorry. Something went wrong when downloading your form. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [guid, filename],
  );

  // Render loading state
  if (isLoading) {
    return (
      <VaLoadingIndicator
        label="Downloading"
        message="Downloading your completed form..."
        class="vads-u-margin-y--4"
      />
    );
  }

  // Render error state
  if (error) {
    return (
      <va-alert status="error" class="vads-u-margin-y--4" role="alert" uswds>
        <h3 slot="headline">Download failed</h3>
        <p>{error}</p>
        <va-button
          text="Try again"
          onClick={handleDownload}
          secondary
          class="vads-u-margin-top--2"
        />
      </va-alert>
    );
  }

  // Render download link
  return (
    <div className="vads-u-margin-y--4">
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--2">
        Download your form
      </h2>
      <p className="vads-u-margin-bottom--3">
        Download a PDF copy of your completed VA Form 21-0779 for your records.
      </p>
      <p>
        <va-link
          text="Download a copy of your VA Form 21-0779 (PDF)"
          onClick={handleDownload}
          download
        />
      </p>
    </div>
  );
};

DownloadFormPDF.propTypes = {
  guid: PropTypes.string.isRequired,
  veteranName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
  }),
};

DownloadFormPDF.defaultProps = {
  veteranName: {
    first: 'Veteran',
    last: 'Submission',
  },
};

export default DownloadFormPDF;
