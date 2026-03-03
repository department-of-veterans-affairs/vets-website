import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import recordEvent from 'platform/monitoring/record-event';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  fetchPdfApi,
  downloadBlob,
  formatPdfFilename,
} from '../../utils/pdfDownload';

/**
 * DownloadFormPDF Component
 * Provides functionality to download the completed VA Form 21-2680 as a PDF
 *
 * @param {Object} props - Component props
 * @param {string} props.guid - The submission GUID
 * @param {Object} props.veteranName - The veteran's name for the filename
 */
export const DownloadFormPDF = ({ guid, veteranName }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.user?.login?.currentlyLoggedIn);
  // Track prior auth state so we only clear the session-expired UI after an
  // actual re-auth transition (logged-out -> logged-in), not just because the
  // user is currently logged in.
  const previousIsLoggedIn = useRef(isLoggedIn);
  const sessionExpiredAlertRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Clear session-expired state when the user signs back in
  useEffect(
    () => {
      // Reactive 401 can occur while `isLoggedIn` is still true. Clearing only
      // on transition preserves the warning UI until the user actually re-signs in.
      if (!previousIsLoggedIn.current && isLoggedIn && sessionExpired) {
        setSessionExpired(false);
      }

      previousIsLoggedIn.current = isLoggedIn;
    },
    [isLoggedIn, sessionExpired],
  );

  // Move screen reader focus to the session-expired alert heading
  useEffect(
    () => {
      if (sessionExpired && sessionExpiredAlertRef.current) {
        waitForRenderThenFocus('h3', sessionExpiredAlertRef.current);
      }
    },
    [sessionExpired],
  );

  // Generate filename for the download
  const filename = useMemo(
    () => {
      return formatPdfFilename(veteranName);
    },
    [veteranName],
  );

  const handleSignIn = useCallback(
    () => {
      dispatch(toggleLoginModal(true, '21-2680-pdf-download'));
    },
    [dispatch],
  );

  // Handle PDF download
  const handleDownload = useCallback(
    async () => {
      if (!guid) {
        setError('No submission ID available. Please submit the form first.');
        return;
      }

      // Proactively check session before hitting the server so an expired
      // session never produces a 401 in our metrics.
      if (!isLoggedIn) {
        setSessionExpired(true);
        recordEvent({ event: 'form-21-2680--pdf-download-session-expired' });
        return;
      }

      setIsLoading(true);
      setError(null);
      setSessionExpired(false);

      try {
        // Fetch the PDF blob from the API
        const blob = await fetchPdfApi(guid);

        // Trigger browser download
        downloadBlob(blob, filename);
      } catch (err) {
        if (err.sessionExpired) {
          setSessionExpired(true);
        } else {
          setError(
            "We're sorry. Something went wrong when downloading your form. Please try again later.",
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [guid, filename, isLoggedIn],
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

  // Render session expired state
  if (sessionExpired) {
    return (
      <va-alert
        status="warning"
        class="vads-u-margin-y--4"
        ref={sessionExpiredAlertRef}
        uswds
      >
        <h3 slot="headline">Your session has expired</h3>
        <p>
          Please sign in again to download your form. After signing in, select
          the download link below.
        </p>
        <va-button
          text="Sign in"
          onClick={handleSignIn}
          class="vads-u-margin-top--2"
        />
      </va-alert>
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
      <p>
        <va-link
          text="Download a copy of your VA Form 21-2680 (PDF)"
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
