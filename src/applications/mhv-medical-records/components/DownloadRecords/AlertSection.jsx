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
 * Alert display order (matches original DownloadReportPageSupportPdfHtml.jsx):
 * 1. CCD download success (if generating/successful AND no error AND no retry timestamp)
 * 2. Access errors:
 *    - CCD retry error (if CCDRetryTimestamp exists)
 *    - SEI access error (only if NO CCD retry error AND (all SEI domains failed OR PDF generation error))
 * 3. Redux CCD action/server error (can show alongside CCD retry error)
 * 4. Redux SEI action/server error
 * 5. SEI download success with optional MissingRecordsError
 *
 * @param {Object} props
 * @param {string[]} props.failedSeiDomains - Array of failed SEI domain names
 * @param {boolean|Object} props.seiPdfGenerationError - Whether SEI PDF generation failed (can be error object)
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

  return (
    <>
      {/* 1. CCD download success alert (only if no CCD retry error and no ccdError) */}
      {showCcdAlerts &&
        ccdDownloadSuccess &&
        !ccdError &&
        !CCDRetryTimestamp && (
          <DownloadSuccessAlert
            type="Continuity of Care Document download"
            className="vads-u-margin-bottom--1"
            focusId="ccd-download-success"
          />
        )}

      {/* 2. Access errors: CCD retry error takes priority over SEI access error (only one shows) */}
      {showCcdAlerts &&
        CCDRetryTimestamp && (
          <AccessTroubleAlertBox
            alertType={accessAlertTypes.DOCUMENT}
            documentType={documentTypes.CCD}
            className="vads-u-margin-bottom--1"
          />
        )}
      {showSeiAlerts &&
        !CCDRetryTimestamp &&
        hasSeiAccessError && (
          <AccessTroubleAlertBox
            alertType={accessAlertTypes.DOCUMENT}
            documentType={documentTypes.SEI}
            className="vads-u-margin-bottom--1"
          />
        )}

      {/* 3. Redux action/server error: CCD */}
      {showCcdAlerts &&
        activeAlert?.type === ALERT_TYPE_CCD_ERROR && (
          <AccessTroubleAlertBox
            alertType={accessAlertTypes.DOCUMENT}
            documentType={documentTypes.CCD}
            className="vads-u-margin-bottom--1"
          />
        )}

      {/* 4. Redux action/server error: SEI */}
      {showSeiAlerts &&
        activeAlert?.type === ALERT_TYPE_SEI_ERROR && (
          <AccessTroubleAlertBox
            alertType={accessAlertTypes.DOCUMENT}
            documentType={documentTypes.SEI}
            className="vads-u-margin-bottom--1"
          />
        )}

      {/* 5. SEI success: download succeeded */}
      {showSeiAlerts &&
        successfulSeiDownload === true &&
        (failedSeiDomains?.length ?? 0) !== SEI_DOMAINS.length && (
          <>
            {(failedSeiDomains?.length ?? 0) > 0 && (
              <MissingRecordsError
                documentType="Self-entered health information report"
                recordTypes={failedSeiDomains}
              />
            )}
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
  seiPdfGenerationError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
  showCcdAlerts: PropTypes.bool,
  showSeiAlerts: PropTypes.bool,
  successfulSeiDownload: PropTypes.bool,
};

export default AlertSection;
