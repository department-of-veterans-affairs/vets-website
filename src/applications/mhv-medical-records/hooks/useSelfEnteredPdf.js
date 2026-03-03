import { useState } from 'react';
import { useSelector } from 'react-redux';
import { generateSEIPdf } from '@department-of-veterans-affairs/mhv/exports';
import { sendDataDogAction } from '../util/helpers';
import { statsdFrontEndActions } from '../util/constants';
import { postRecordDatadogAction } from '../api/MrApi';

/**
 * Custom hook for managing Self-Entered Information (SEI) PDF download state and logic.
 *
 * @param {boolean} runningUnitTest - Flag to indicate if running in unit test mode
 * @returns {Object} SEI PDF download state and handler
 * @returns {boolean} returns.loading - Whether the PDF is currently being generated
 * @returns {boolean} returns.success - Whether the download was successful
 * @returns {Array<string>} returns.failedDomains - List of domains that failed to load
 * @returns {boolean|Error|null} returns.error - Error state if generation failed
 * @returns {Function} returns.handleDownload - Click handler for download link
 */
const useSelfEnteredPdf = (runningUnitTest = false) => {
  const userProfile = useSelector(state => state.user?.profile);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failedDomains, setFailedDomains] = useState([]);
  const [error, setError] = useState(null);

  const handleDownload = e => {
    e.preventDefault();
    // Reset state before new attempt to prevent conflicting alerts
    setError(null);
    setSuccess(false);
    setFailedDomains([]);
    setLoading(true);
    generateSEIPdf(userProfile, runningUnitTest)
      .then(res => {
        if (res.success) {
          const { failedDomains: domains } = res;
          setFailedDomains(domains);
          setSuccess(true);
        } else {
          setError(true);
        }
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
    postRecordDatadogAction(statsdFrontEndActions.DOWNLOAD_SEI);
    sendDataDogAction('Download self-entered health information PDF link');
  };

  return {
    loading,
    success,
    failedDomains,
    error,
    handleDownload,
  };
};

export default useSelfEnteredPdf;
