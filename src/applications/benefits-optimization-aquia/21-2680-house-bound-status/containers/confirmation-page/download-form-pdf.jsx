import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest } from 'platform/utilities/api';
import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { API_ENDPOINTS } from '../../constants/constants';

const DownloadFormPDF = ({ confirmationNumber }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.user?.login?.currentlyLoggedIn);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Clear session-expired state when the user signs back in
  useEffect(
    () => {
      if (isLoggedIn && sessionExpired) {
        setSessionExpired(false);
      }
    },
    [isLoggedIn, sessionExpired],
  );

  const handlePdfDownload = useCallback(blob => {
    const downloadUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');

    downloadLink.href = downloadUrl;
    downloadLink.download = '21-2680_completed.pdf';
    document.body.appendChild(downloadLink);

    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadUrl);
  }, []);

  const handleSignIn = useCallback(
    event => {
      event.preventDefault();
      dispatch(toggleLoginModal(true, '21-2680-pdf-download'));
    },
    [dispatch],
  );

  const fetchPdf = useCallback(
    async event => {
      event.preventDefault();
      setLoading(true);
      setErrorMessage(null);
      setSessionExpired(false);

      // Prevent the platform's default 401 redirect (apiRequest navigates to
      // the homepage on 401 when this flag is set). We handle session expiration
      // in-place via the login modal so the user doesn't lose the confirmation
      // page state.
      const redirectFlag = sessionStorage.getItem(
        'shouldRedirectExpiredSession',
      );
      sessionStorage.removeItem('shouldRedirectExpiredSession');

      try {
        const response = await apiRequest(
          `${API_ENDPOINTS.downloadPdf}${confirmationNumber}`,
        );

        if (!response.ok) {
          throw new Error();
        }

        const blob = await response.blob();
        handlePdfDownload(blob);
        recordEvent({ event: '21-2680-pdf-download--success' });
      } catch (error) {
        const status = error?.errors?.[0]?.status;
        if (status === '401') {
          setSessionExpired(true);
          recordEvent({ event: '21-2680-pdf-download--session-expired' });
        } else {
          setErrorMessage(
            "We're sorry. Something went wrong when downloading your form. Please try again later.",
          );
          recordEvent({ event: '21-2680-pdf-download--failure' });
        }
      } finally {
        if (redirectFlag) {
          sessionStorage.setItem('shouldRedirectExpiredSession', redirectFlag);
        }
        setLoading(false);
      }
    },
    [confirmationNumber, handlePdfDownload],
  );

  // apply focus to the error alert if we have errors set
  useEffect(
    () => {
      if (errorMessage || sessionExpired) focusElement('.form-download-error');
    },
    [errorMessage, sessionExpired],
  );

  if (!confirmationNumber) return null;

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
      {sessionExpired && (
        <div className="form-download-error vads-u-margin-y--1">
          <va-alert status="warning">
            <h3 slot="headline">Your session has expired</h3>
            <p>
              Please sign in again to download your form. After signing in,
              select the download link below.
            </p>
            <va-button text="Sign in" onClick={handleSignIn} />
          </va-alert>
        </div>
      )}
      {errorMessage && (
        <div className="form-download-error vads-u-margin-y--1">
          <va-alert status="error">{errorMessage}</va-alert>
        </div>
      )}
      <p>
        <va-link
          text="Download a copy of your VA Form 21-2680"
          onClick={fetchPdf}
          filetype="PDF"
          href="#"
          download
        />
      </p>
    </>
  );
};

DownloadFormPDF.propTypes = {
  confirmationNumber: PropTypes.string,
};

export default DownloadFormPDF;
