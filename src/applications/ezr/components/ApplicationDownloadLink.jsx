import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { apiRequest } from 'platform/utilities/api';
import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';
import { API_ENDPOINTS } from '../utils/constants';
import { submitTransformer } from '../utils/helpers/submit-transformer';
import { ensureValidCSRFToken } from '../utils/actions/ensureValidCSRFToken';
import content from '../locales/en/content.json';

const ApplicationDownloadLink = ({ formConfig, linkText, profile }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // define local use variables
  const form = useSelector(state => state.form);
  const formData = useMemo(() => submitTransformer(formConfig, form), [
    formConfig,
    form,
  ]);

  const { userFullName = { first: 'Applicant', last: 'Submission' } } =
    profile || {};

  const handlePdfDownload = useCallback(
    blob => {
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');

      downloadLink.href = downloadUrl;
      downloadLink.download = `10-10EZR_${userFullName.first}_${
        userFullName.last
      }.pdf`;
      document.body.appendChild(downloadLink);

      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);
    },
    [userFullName],
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
        // Generate pdf from blob
        handlePdfDownload(blob);
        recordEvent({ event: 'ezr-pdf-download--success' });
      } catch {
        setErrorMessage(content['alert-download-message--generic']);
        recordEvent({ event: 'ezr-pdf-download--failure' });
      } finally {
        setLoading(false);
      }
    },
    [formData, handlePdfDownload],
  );

  // apply focus to the error alert if we have errors set
  useEffect(
    () => {
      if (errorMessage) focusElement('.ezr-download-error');
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

  return (
    <>
      {errorMessage && (
        <div className="ezr-download-error vads-u-margin-y--2">
          <va-alert status="error">{errorMessage}</va-alert>
        </div>
      )}
      <va-link
        text={linkText}
        onClick={fetchPdf}
        filetype="PDF"
        href="#"
        download
      />
    </>
  );
};

ApplicationDownloadLink.propTypes = {
  formConfig: PropTypes.object,
  linkText: PropTypes.string,
  profile: PropTypes.object,
};

const mapStateToProps = state => ({
  profile: state.user.profile,
});

export default connect(mapStateToProps)(ApplicationDownloadLink);
