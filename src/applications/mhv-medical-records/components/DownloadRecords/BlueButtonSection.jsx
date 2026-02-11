import React from 'react';
import PropTypes from 'prop-types';
import { MissingRecordsError } from '@department-of-veterans-affairs/mhv/exports';

import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import AccessTroubleAlertBox from '../shared/AccessTroubleAlertBox';
import { sendDataDogAction, getFailedDomainList } from '../../util/helpers';
import {
  accessAlertTypes,
  ALERT_TYPE_BB_ERROR,
  BB_DOMAIN_DISPLAY_MAP,
  documentTypes,
} from '../../util/constants';

const BlueButtonSection = ({
  activeAlert,
  failedBBDomains,
  successfulBBDownload,
}) => {
  return (
    <>
      <h2>Download your VA Blue Button report</h2>
      {activeAlert?.type === ALERT_TYPE_BB_ERROR && (
        <AccessTroubleAlertBox
          alertType={accessAlertTypes.DOCUMENT}
          documentType={documentTypes.BB}
          className="vads-u-margin-bottom--1"
        />
      )}
      {successfulBBDownload === true && (
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

BlueButtonSection.propTypes = {
  activeAlert: PropTypes.object,
  failedBBDomains: PropTypes.arrayOf(PropTypes.string),
  successfulBBDownload: PropTypes.bool,
};

export default BlueButtonSection;
