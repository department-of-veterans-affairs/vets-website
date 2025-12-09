import React from 'react';
import PropTypes from 'prop-types';
import {
  ALERT_TYPE_SEI_ERROR,
  SEI_DOMAINS,
  MissingRecordsError,
} from '@department-of-veterans-affairs/mhv/exports';

import TrackedSpinner from '../../components/shared/TrackedSpinner';
import CCDAccordionItemDual from '../ccdAccordionItem/ccdAccordionItemDual';
import CCDAccordionItemOH from '../ccdAccordionItem/ccdAccordionItemOH';
import CCDAccordionItemV2 from '../ccdAccordionItem/ccdAccordionItemV2';
import CCDAccordionItemV1 from '../ccdAccordionItem/ccdAccordionItemV1';
import DownloadSuccessAlert from '../../components/shared/DownloadSuccessAlert';
import AcceleratedCernerFacilityAlert from '../../components/shared/AcceleratedCernerFacilityAlert';
import {
  accessAlertTypes,
  ALERT_TYPE_BB_ERROR,
  ALERT_TYPE_CCD_ERROR,
  BB_DOMAIN_DISPLAY_MAP,
  CernerAlertContent,
  documentTypes,
} from '../../util/constants';

import AccessTroubleAlertBox from '../../components/shared/AccessTroubleAlertBox';
import { sendDataDogAction } from '../../util/helpers';

const VistaOnlyContent = ({
  accessErrors,
  activeAlert,
  ccdError,
  CCDRetryTimestamp,
  isLoading,
  testIdSuffix,
  ccdExtendedFileTypeFlag,
  ccdDownloadSuccess,
  failedBBDomains,
  failedSeiDomains,
  getFailedDomainList,
  hasBothDataSources,
  hasOHOnly,
  generatingCCD,
  handleDownloadCCD,
  handleDownloadCCDV2,
  expandSelfEntered,
  selfEnteredAccordionRef,
  selfEnteredPdfLoading,
  handleDownloadSelfEnteredPdf,
  lastSuccessfulUpdate,
  successfulSeiDownload,
  successfulBBDownload,
}) => {
  return (
    <>
      {isLoading ? (
        <div
          id={`generating-ccd-${testIdSuffix}-indicator`}
          data-testid={`generating-ccd-${testIdSuffix}-indicator`}
        >
          <TrackedSpinner
            id={`download-ccd-${testIdSuffix}-spinner`}
            label="Loading"
            message="Preparing your download..."
          />
        </div>
      ) : (
        <div>
          <h1>Download your medical records reports</h1>
          <p className="vads-u-margin--0">
            Download your VA medical records as a single report (called your VA
            Blue Button® report). Or find other reports to download.
          </p>

          <AcceleratedCernerFacilityAlert {...CernerAlertContent.DOWNLOAD} />

          {lastSuccessfulUpdate && (
            <va-card
              className="vads-u-margin-y--2"
              background
              aria-live="polite"
              data-testid="new-records-last-updated"
            >
              Records in these reports last updated at{' '}
              {lastSuccessfulUpdate.time} on {lastSuccessfulUpdate.date}
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

          <h2>Other reports you can download</h2>

          {(generatingCCD || ccdDownloadSuccess) &&
            (!ccdError && !CCDRetryTimestamp) && (
              <DownloadSuccessAlert
                type="Continuity of Care Document download"
                className="vads-u-margin-bottom--1"
                focusId="ccd-download-success"
              />
            )}

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
          <va-accordion bordered>
            {(() => {
              if (ccdExtendedFileTypeFlag) {
                if (hasBothDataSources) {
                  return (
                    <CCDAccordionItemDual
                      generatingCCD={generatingCCD}
                      handleDownloadCCD={handleDownloadCCD}
                    />
                  );
                }
                if (hasOHOnly) {
                  return (
                    <CCDAccordionItemOH
                      generatingCCD={generatingCCD}
                      handleDownloadCCDV2={handleDownloadCCDV2}
                    />
                  );
                }
                return (
                  <CCDAccordionItemV2
                    generatingCCD={generatingCCD}
                    handleDownloadCCD={handleDownloadCCD}
                  />
                );
              }
              return (
                <CCDAccordionItemV1
                  generatingCCD={generatingCCD}
                  handleDownloadCCD={handleDownloadCCD}
                />
              );
            })()}
            <va-accordion-item
              bordered
              data-testid="selfEnteredAccordionItem"
              open={expandSelfEntered ? 'true' : undefined}
              ref={selfEnteredAccordionRef}
            >
              <h3 id="self-entered-header" slot="headline" tabIndex="-1">
                Self-entered health information
              </h3>
              <p className="vads-u-margin--0">
                This report includes all the health information you entered
                yourself in the previous version of My HealtheVet.
              </p>
              <p>
                Your VA health care team can’t access this self-entered
                information directly. If you want to share this information with
                your care team, print this report and bring it to your next
                appointment.
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
            </va-accordion-item>
          </va-accordion>
          <p className="vads-u-margin--0 vads-u-margin-top--2">
            <strong>Note:</strong> Blue Button and the Blue Button logo are
            registered service marks owned by the U.S. Department of Health and
            Human Services.
          </p>
        </div>
      )}
    </>
  );
};

VistaOnlyContent.propTypes = {
  accessErrors: PropTypes.func.isRequired,
  ccdDownloadSuccess: PropTypes.bool.isRequired,
  ccdError: PropTypes.bool.isRequired,
  ccdExtendedFileTypeFlag: PropTypes.bool.isRequired,
  expandSelfEntered: PropTypes.bool.isRequired,
  failedBBDomains: PropTypes.array.isRequired,
  failedSeiDomains: PropTypes.array.isRequired,
  generatingCCD: PropTypes.bool.isRequired,
  getFailedDomainList: PropTypes.func.isRequired,
  handleDownloadCCD: PropTypes.func.isRequired,
  handleDownloadCCDV2: PropTypes.func.isRequired,
  handleDownloadSelfEnteredPdf: PropTypes.func.isRequired,
  hasBothDataSources: PropTypes.bool.isRequired,
  hasOHOnly: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  selfEnteredAccordionRef: PropTypes.object.isRequired,
  selfEnteredPdfLoading: PropTypes.bool.isRequired,
  successfulBBDownload: PropTypes.bool.isRequired,
  successfulSeiDownload: PropTypes.bool.isRequired,
  testIdSuffix: PropTypes.string.isRequired,
  CCDRetryTimestamp: PropTypes.string,
  activeAlert: PropTypes.object,
  lastSuccessfulUpdate: PropTypes.object,
};

export default VistaOnlyContent;
