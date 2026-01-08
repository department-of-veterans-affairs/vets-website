import React from 'react';
import PropTypes from 'prop-types';
import {
  ALERT_TYPE_SEI_ERROR,
  MissingRecordsError,
  SEI_DOMAINS,
} from '@department-of-veterans-affairs/mhv/exports';
import {
  accessAlertTypes,
  ALERT_TYPE_CCD_ERROR,
  documentTypes,
} from '../../util/constants';
import AccessTroubleAlertBox from '../shared/AccessTroubleAlertBox';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import { useDownloadReport } from '../../context/DownloadReportContext';

/**
 * Consolidated alert section component that handles all CCD and SEI alerts.
 * Uses context for CCD-related state, with SEI values passed as props from the
 * useSelfEnteredPdf hook (which is local to components that support SEI).
 *
 * This component handles:
 * - CCD retry errors (localStorage-based)
 * - CCD action/server errors (redux-based)
 * - CCD download success
 * - SEI access errors (when SEI props are provided)
 * - SEI action/server errors (when SEI props are provided)
 * - SEI download success with partial failures (when SEI props are provided)
 *
 * @param {Object} props
 * @param {string[]} props.failedSeiDomains - Array of failed SEI domain names
 * @param {boolean} props.seiPdfGenerationError - Whether SEI PDF generation failed
 * @param {boolean} props.showCcdAlerts - Whether to show CCD-related alerts (default true)
 * @param {boolean} props.showSeiAlerts - Whether to show SEI-related alerts (default true)
 * @param {boolean} props.successfulSeiDownload - Whether SEI download succeeded
 */
const AlertSection = ({
  failedSeiDomains = [],
  seiPdfGenerationError = false,
  showCcdAlerts = true,
  showSeiAlerts = true,
  successfulSeiDownload = false,
}) => {
  const {
    activeAlert,
    ccdDownloadSuccess,
    ccdError,
    CCDRetryTimestamp,
  } = useDownloadReport();

  // SEI Access Error: If all SEI domains failed or PDF generation error
  const allSeiDomainsFailed =
    (failedSeiDomains?.length ?? 0) === SEI_DOMAINS.length;
  const hasSeiAccessError = allSeiDomainsFailed || seiPdfGenerationError;

  // CCD retry error from localStorage (blocking error - takes priority)
  if (showCcdAlerts && CCDRetryTimestamp) {
    return (
      <AccessTroubleAlertBox
        alertType={accessAlertTypes.DOCUMENT}
        documentType={documentTypes.CCD}
        className="vads-u-margin-bottom--1"
      />
    );
  }

  // SEI Access Error: blocking error for SEI
  if (showSeiAlerts && hasSeiAccessError) {
    return (
      <AccessTroubleAlertBox
        alertType={accessAlertTypes.DOCUMENT}
        documentType={documentTypes.SEI}
        className="vads-u-margin-bottom--1"
      />
    );
  }

  return (
    <>
      {/* CCD download success alert */}
      {showCcdAlerts &&
        ccdDownloadSuccess &&
        !ccdError && (
          <DownloadSuccessAlert
            type="Continuity of Care Document download"
            className="vads-u-margin-bottom--1"
            focusId="ccd-download-success"
          />
        )}

      {/* Redux action/server error: CCD */}
      {showCcdAlerts &&
        activeAlert?.type === ALERT_TYPE_CCD_ERROR && (
          <AccessTroubleAlertBox
            alertType={accessAlertTypes.DOCUMENT}
            documentType={documentTypes.CCD}
            className="vads-u-margin-bottom--1"
          />
        )}

      {/* Redux action/server error: SEI */}
      {showSeiAlerts &&
        activeAlert?.type === ALERT_TYPE_SEI_ERROR && (
          <AccessTroubleAlertBox
            alertType={accessAlertTypes.DOCUMENT}
            documentType={documentTypes.SEI}
            className="vads-u-margin-bottom--1"
          />
        )}

      {/* SEI partial success: some domains failed but download succeeded */}
      {showSeiAlerts &&
        successfulSeiDownload === true &&
        failedSeiDomains.length > 0 &&
        failedSeiDomains.length !== SEI_DOMAINS.length && (
          <>
            <MissingRecordsError
              documentType="Self-entered health information report"
              recordTypes={failedSeiDomains}
            />
            <DownloadSuccessAlert
              type="Self-entered health information report download"
              className="vads-u-margin-bottom--1"
            />
          </>
        )}
    </>
  );
};

AlertSection.propTypes = {
  failedSeiDomains: PropTypes.arrayOf(PropTypes.string),
  seiPdfGenerationError: PropTypes.bool,
  showCcdAlerts: PropTypes.bool,
  showSeiAlerts: PropTypes.bool,
  successfulSeiDownload: PropTypes.bool,
};

export default AlertSection;
