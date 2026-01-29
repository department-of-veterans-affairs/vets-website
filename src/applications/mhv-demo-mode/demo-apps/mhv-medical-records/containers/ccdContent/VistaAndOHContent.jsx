import React from 'react';
import PropTypes from 'prop-types';
import {
  ALERT_TYPE_SEI_ERROR,
  SEI_DOMAINS,
  MissingRecordsError,
} from '@department-of-veterans-affairs/mhv/exports';

import TrackedSpinner from '../../components/shared/TrackedSpinner';
import { DownloadSection } from '../ccdAccordionItem/CCDAccordionItemVista';
import DownloadSuccessAlert from '../../components/shared/DownloadSuccessAlert';
import {
  accessAlertTypes,
  ALERT_TYPE_BB_ERROR,
  ALERT_TYPE_CCD_ERROR,
  BB_DOMAIN_DISPLAY_MAP,
  documentTypes,
} from '../../util/constants';

import AccessTroubleAlertBox from '../../components/shared/AccessTroubleAlertBox';
import { sendDataDogAction } from '../../util/helpers';
import { formatFacilityList } from '../../util/facilityHelpers';

const VistaAndOHContent = ({
  accessErrors,
  activeAlert,
  ccdError,
  ccdExtendedFileTypeFlag,
  CCDRetryTimestamp,
  handleDownloadCCDV2,
  ohFacilityNames,
  ccdDownloadSuccess,
  failedBBDomains,
  failedSeiDomains,
  getFailedDomainList,
  generatingCCD,
  handleDownloadCCD,
  handleDownloadSelfEnteredPdf,
  lastSuccessfulUpdate,
  selfEnteredPdfLoading,
  successfulSeiDownload,
  successfulBBDownload,
  vistaFacilityNames,
}) => {
  return (
    <div className="vads-u-margin-y--2">
      {lastSuccessfulUpdate && (
        <va-card
          className="vads-u-margin-y--2"
          background
          aria-live="polite"
          data-testid="new-records-last-updated"
        >
          Records in these reports last updated at {lastSuccessfulUpdate.time}{' '}
          on {lastSuccessfulUpdate.date}
        </va-card>
      )}
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
      <h2>Download your Continuity of Care Document</h2>
      {accessErrors()}
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
      <p className="vads-u-margin-bottom--3">
        This Continuity of Care Document (CCD) is a summary of your VA medical
        records that you can share with non-VA providers in your community. It
        includes your allergies, medications, recent lab results, and more. We
        used to call this report your VA Health Summary.
      </p>
      <div className="vads-u-margin-bottom--4">
        {ccdExtendedFileTypeFlag ? (
          <>
            <p className="vads-u-font-weight--bold">
              CCD: medical records from {formatFacilityList(vistaFacilityNames)}
            </p>

            <div className="vads-u-margin-bottom--4">
              <DownloadSection
                isLoading={generatingCCD}
                handleDownload={handleDownloadCCD}
                testIdSuffix="Vista"
                ddSuffix="VistA"
              />
            </div>

            <p className="vads-u-font-weight--bold">
              CCD: medical records from {formatFacilityList(ohFacilityNames)}
            </p>

            <DownloadSection
              isLoading={generatingCCD}
              handleDownload={handleDownloadCCDV2}
              testIdSuffix="OH"
              ddSuffix="OH"
            />
          </>
        ) : (
          <>
            {generatingCCD ? (
              <div
                id="generating-ccd-indicator"
                data-testid="generating-ccd-indicator"
              >
                <TrackedSpinner
                  id="download-ccd-spinner"
                  label="Loading"
                  message="Preparing your download..."
                />
              </div>
            ) : (
              <div className="vads-u-display--flex vads-u-flex-direction--column">
                <va-link
                  download
                  href="#"
                  onClick={e => handleDownloadCCD(e, 'xml')}
                  text="Download Continuity of Care Document (XML)"
                  data-testid="generateCcdButtonXml"
                  data-dd-action-name="Download CCD XML"
                />
              </div>
            )}
          </>
        )}
      </div>
      <h2>Download your self-entered health information</h2>
      <p className="vads-u-margin--0">
        This report includes all the health information you entered yourself in
        the previous version of My HealtheVet.
      </p>
      <p>
        Your VA health care team can’t access this self-entered information
        directly. If you want to share this information with your care team,
        print this report and bring it to your next appointment.
      </p>
      {selfEnteredPdfLoading ? (
        <div id="generating-sei-indicator">
          <TrackedSpinner
            id="download-self-entered-spinner"
            label="Loading"
            message="Preparing your download..."
            data-testid="sei-loading-indicator"
          />
        </div>
      ) : (
        <va-link
          download
          href="#"
          onClick={handleDownloadSelfEnteredPdf}
          text="Download self-entered health information report (PDF)"
          data-testid="downloadSelfEnteredButton"
        />
      )}
      <p className="vads-u-margin--0 vads-u-margin-top--2">
        <strong>Note:</strong> Blue Button and the Blue Button logo are
        registered service marks owned by the U.S. Department of Health and
        Human Services.
      </p>
    </div>
  );
};

VistaAndOHContent.propTypes = {
  accessErrors: PropTypes.func.isRequired,
  ccdError: PropTypes.bool.isRequired,
  ccdExtendedFileTypeFlag: PropTypes.bool.isRequired,
  failedBBDomains: PropTypes.arrayOf(PropTypes.string).isRequired,
  failedSeiDomains: PropTypes.arrayOf(PropTypes.string).isRequired,
  generatingCCD: PropTypes.bool.isRequired,
  getFailedDomainList: PropTypes.func.isRequired,
  handleDownloadCCD: PropTypes.func.isRequired,
  handleDownloadCCDV2: PropTypes.func.isRequired,
  handleDownloadSelfEnteredPdf: PropTypes.func.isRequired,
  ohFacilityNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  selfEnteredPdfLoading: PropTypes.bool.isRequired,
  successfulSeiDownload: PropTypes.bool.isRequired,
  vistaFacilityNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  CCDRetryTimestamp: PropTypes.string,
  activeAlert: PropTypes.object,
  ccdDownloadSuccess: PropTypes.bool,
  lastSuccessfulUpdate: PropTypes.object,
  successfulBBDownload: PropTypes.bool,
};

export default VistaAndOHContent;
