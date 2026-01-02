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

const CCDAlertSection = ({
  activeAlert = {},
  CCDRetryTimestamp,
  ccdDownloadSuccess = false,
  ccdError = false,
  failedSeiDomains = [],
  successfulSeiDownload = false,
}) => (
  <>
    {/* redux action/server errors */}
    {activeAlert?.type === ALERT_TYPE_CCD_ERROR && (
      <AccessTroubleAlertBox
        alertType={accessAlertTypes.DOCUMENT}
        documentType={documentTypes.CCD}
        className="vads-u-margin-bottom--1"
      />
    )}
    {activeAlert?.type === ALERT_TYPE_SEI_ERROR && (
      <AccessTroubleAlertBox
        alertType={accessAlertTypes.DOCUMENT}
        documentType={documentTypes.SEI}
        className="vads-u-margin-bottom--1"
      />
    )}
    {successfulSeiDownload === true &&
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
    {ccdDownloadSuccess &&
      !ccdError &&
      !CCDRetryTimestamp && (
        <DownloadSuccessAlert
          type="Continuity of Care Document download"
          className="vads-u-margin-bottom--1"
          focusId="ccd-download-success"
        />
      )}
  </>
);

CCDAlertSection.propTypes = {
  CCDRetryTimestamp: PropTypes.string,
  activeAlert: PropTypes.object,
  ccdDownloadSuccess: PropTypes.bool,
  ccdError: PropTypes.bool,
  failedSeiDomains: PropTypes.arrayOf(PropTypes.string),
  successfulSeiDownload: PropTypes.bool,
};

export default CCDAlertSection;
