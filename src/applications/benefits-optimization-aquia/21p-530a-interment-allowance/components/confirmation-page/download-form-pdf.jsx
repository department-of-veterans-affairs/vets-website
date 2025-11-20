import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { apiRequest } from 'platform/utilities/api';
import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';
import * as Sentry from '@sentry/browser';
import { API_ENDPOINTS } from '../../constants/constants';
import { ensureValidCSRFToken } from '../../utils/actions/ensure-valid-csrf-token';

const DownloadFormPDF = ({ formData, veteranName }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const name = useMemo(
    () => {
      const { first = 'Veteran', last = 'Submission' } = veteranName || {};
      return { first, last };
    },
    [veteranName],
  );

  const handlePdfDownload = useCallback(
    blob => {
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');

      downloadLink.href = downloadUrl;
      downloadLink.download = `21P-530A_${name.first}_${name.last}.pdf`;
      document.body.appendChild(downloadLink);

      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);
    },
    [name],
  );

  const fetchPdf = useCallback(
    async event => {
      event.preventDefault();
      setLoading(true);
      setErrorMessage(null);

      try {
        await ensureValidCSRFToken('fetchPdf');
        const response = await apiRequest(API_ENDPOINTS.downloadPdf, {
          method: 'POST',
          body: formData,
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error();
        }

        const blob = await response.blob();
        handlePdfDownload(blob);
        recordEvent({ event: '21p-530a-pdf-download--success' });
      } catch (error) {
        setErrorMessage(
          "We're sorry. Something went wrong when downloading your form. Please try again later.",
        );
        recordEvent({ event: '21p-530a-pdf-download--failure' });
        Sentry.withScope(scope => {
          scope.setExtra('error', error);
          Sentry.captureMessage('21p-530a-pdf-download-fail');
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, handlePdfDownload],
  );

  // apply focus to the error alert if we have errors set
  useEffect(
    () => {
      if (errorMessage) focusElement('.form-download-error');
    },
    [errorMessage],
  );

  // render loading indicator while application download is processing
  if (loading) {
    return (
      <va-loading-indicator
        label="Loading your form"
        message="Downloading your completed form..."
      />
    );
  }

  return (
    <>
      {errorMessage && (
        <div className="form-download-error vads-u-margin-y--1">
          <va-alert status="error">{errorMessage}</va-alert>
        </div>
      )}
      <va-link
        text="Download a copy of your VA Form form 21P-530a"
        onClick={fetchPdf}
        filetype="PDF"
        href="#"
        download
      />
    </>
  );
};

DownloadFormPDF.propTypes = {
  formData: PropTypes.string,
  veteranName: PropTypes.shape({
    first: PropTypes.string,
    last: PropTypes.string,
  }),
};

export default DownloadFormPDF;
