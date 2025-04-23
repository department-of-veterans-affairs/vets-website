import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { apiRequest } from 'platform/utilities/api';
import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';
import { API_ENDPOINTS } from '../utils/constants';
import { submitTransformer } from '../config/submit-transformer';
import { ensureValidCSRFToken } from '../utils/actions/ensureValidCSRFToken';
import content from '../locales/en/content.json';

const ApplicationDownloadLink = ({ formConfig }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // define local use variables
  const form = useSelector(state => state.form);
  const formData = useMemo(() => submitTransformer(formConfig, form), [
    formConfig,
    form,
  ]);

  // Default name to Applicant Submission if view:veteranInformation is empty for some reason
  const { veteranFullName: name = { first: 'Applicant', last: 'Submission' } } =
    form.data?.['view:veteranInformation'] ?? {};

  const handlePdfDownload = useCallback(
    blob => {
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');

      downloadLink.href = downloadUrl;
      downloadLink.download = `10-10EZ_${name.first}_${name.last}.pdf`;
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

        // Handle request errors
        if (!response.ok) {
          // Attempt to parse a JSON error response
          const errorData = await response.json();
          recordEvent({ event: 'hca-pdf-download--failure' });

          const code = errorData?.errors?.[0]?.status?.[0];
          const message =
            code === '5'
              ? content['alert-download-message--500']
              : content['alert-download-message--generic'];
          setErrorMessage(message);
          return;
        }
        const blob = await response.blob();
        // Generate pdf from blob
        handlePdfDownload(blob);
        recordEvent({ event: 'hca-pdf-download--success' });

        // Handle any unexpected errors
      } catch {
        setErrorMessage(content['alert-download-message--generic']);
        recordEvent({ event: 'hca-pdf-download--failure' });
      } finally {
        setLoading(false);
      }
    },
    [formData, handlePdfDownload],
  );

  // apply focus to the error alert if we have errors set
  useEffect(
    () => {
      if (errorMessage) focusElement('.hca-download-error');
    },
    [errorMessage],
  );

  // render loading indicator while application download is processing
  if (loading) {
    return (
      <va-loading-indicator
        label={content['app-loading-text']}
        message={content['app-download--loading-text']}
      />
    );
  }

  // render error alert if file cannot download
  if (errorMessage) {
    return (
      <div className="hca-download-error">
        <va-alert status="error">
          <h4 slot="headline">{content['alert-heading--generic']}</h4>
          {errorMessage}
        </va-alert>
      </div>
    );
  }

  return (
    <va-link
      text={content['button-download']}
      onClick={fetchPdf}
      filetype="PDF"
      href="#"
      download
    />
  );
};

ApplicationDownloadLink.propTypes = {
  formConfig: PropTypes.object,
};

export default ApplicationDownloadLink;
