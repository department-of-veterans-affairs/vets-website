import React from 'react';
import PropTypes from 'prop-types';
import { MissingRecordsError } from '@department-of-veterans-affairs/mhv/exports';
import {
  accessAlertTypes,
  ALERT_TYPE_BB_ERROR,
  BB_DOMAIN_DISPLAY_MAP,
  documentTypes,
} from '../../util/constants';
import AccessTroubleAlertBox from '../../components/shared/AccessTroubleAlertBox';
import { getFailedDomainList, sendDataDogAction } from '../../util/helpers';
import DownloadSuccessAlert from '../../components/shared/DownloadSuccessAlert';

/**
 * Add conditional Blue Button section display based on facility types
 */
const VaAlertBlueButtonDualUserSection = ({
  hasBothDataSources,
  vistaFacilityNames,
  ohFacilityNames,
  activeAlert,
  successfulBBDownload,
  failedBBDomains,
}) => {
  return (
    <>
      {/* Explanatory message for users with both facility types */}
      {hasBothDataSources &&
        vistaFacilityNames.length > 0 &&
        ohFacilityNames.length > 0 && (
          <va-alert
            status="info"
            className="vads-u-margin-y--2"
            data-testid="dual-facilities-blue-button-message"
            visible
            aria-live="polite"
          >
            <p className="vads-u-margin--0">
              For {vistaFacilityNames.join(', ')}, you can download your data in
              a Blue Button report.
            </p>
            <p className="vads-u-margin--0 vads-u-margin-top--1">
              Data for {ohFacilityNames.join(', ')} is not yet available in Blue
              Button.
            </p>
            <p className="vads-u-margin--0 vads-u-margin-top--1">
              You can access records for those by downloading a Continuity of
              Care Document, which is shown above.
            </p>
          </va-alert>
        )}
      <h2>Download your VA Blue Button report</h2>
      {activeAlert?.type === ALERT_TYPE_BB_ERROR && (
        <AccessTroubleAlertBox
          alertType={accessAlertTypes.DOCUMENT}
          documentType={documentTypes.BB}
          className="vads-u-margin-bottom--1"
        />
      )}
      {successfulBBDownload && (
        <>
          <MissingRecordsError
            documentType="VA Blue Button report"
            recordTypes={getFailedDomainList(
              failedBBDomains,
              BB_DOMAIN_DISPLAY_MAP,
            )}
          />
          <DownloadSuccessAlert
            type="Your VA Blue Button report download has"
            className="vads-u-margin-bottom--1"
          />
        </>
      )}
      <p className="vads-u-margin--0 vads-u-margin-top--3 vads-u-margin-bottom--1">
        First, select the types of records you want in your report. Then
        download.
      </p>
      <va-link-action
        href="/my-health/medical-records/download/date-range"
        label="Select records and download report"
        text="Select records and download report"
        data-dd-action-name="Select records and download"
        onClick={() => sendDataDogAction('Select records and download')}
        data-testid="go-to-download-all"
      />
    </>
  );
};

VaAlertBlueButtonDualUserSection.propTypes = {
  failedBBDomains: PropTypes.array.isRequired,
  hasBothDataSources: PropTypes.bool.isRequired,
  ohFacilityNames: PropTypes.array.isRequired,
  successfulBBDownload: PropTypes.bool.isRequired,
  vistaFacilityNames: PropTypes.array.isRequired,
  activeAlert: PropTypes.object,
};

export default VaAlertBlueButtonDualUserSection;
