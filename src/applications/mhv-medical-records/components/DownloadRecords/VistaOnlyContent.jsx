import React from 'react';
import {
  ALERT_TYPE_SEI_ERROR,
  SEI_DOMAINS,
  MissingRecordsError,
} from '@department-of-veterans-affairs/mhv/exports';

import TrackedSpinner from '../shared/TrackedSpinner';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import {
  accessAlertTypes,
  ALERT_TYPE_CCD_ERROR,
  documentTypes,
} from '../../util/constants';

import AccessTroubleAlertBox from '../shared/AccessTroubleAlertBox';
import { AccessErrors } from './AccessErrors';
import CCDDownloadSection from './CCDDownloadSection';
import useSelfEnteredPdf from '../../hooks/useSelfEnteredPdf';
import { useDownloadReport } from '../../context/DownloadReportContext';

const VistaOnlyContent = () => {
  const {
    activeAlert,
    ccdError,
    CCDRetryTimestamp,
    ccdExtendedFileTypeFlag,
    ccdDownloadSuccess,
    generatingCCD,
    handleDownloadCCD,
    expandSelfEntered,
    selfEnteredAccordionRef,
    runningUnitTest,
  } = useDownloadReport();
  const {
    loading: selfEnteredPdfLoading,
    success: successfulSeiDownload,
    failedDomains: failedSeiDomains,
    error: seiPdfGenerationError,
    handleDownload: handleDownloadSelfEnteredPdf,
  } = useSelfEnteredPdf(runningUnitTest);

  return (
    <div className="vads-u-margin-y--2">
      <h2>Other reports you can download</h2>

      {ccdDownloadSuccess &&
        !ccdError &&
        !CCDRetryTimestamp && (
          <DownloadSuccessAlert
            type="Continuity of Care Document download"
            className="vads-u-margin-bottom--1"
            focusId="ccd-download-success"
          />
        )}

      <AccessErrors
        CCDRetryTimestamp={CCDRetryTimestamp}
        failedSeiDomains={failedSeiDomains}
        seiPdfGenerationError={seiPdfGenerationError}
      />

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
        <va-accordion-item bordered data-testid="ccdAccordionItem">
          <h3 slot="headline">
            Continuity of Care Document for non-VA providers
          </h3>
          <p>
            This Continuity of Care Document (CCD) is a summary of your VA
            medical records that you can share with non-VA providers in your
            community. It includes your allergies, medications, recent lab
            results, and more. We used to call this report your VA Health
            Summary.
          </p>
          {!ccdExtendedFileTypeFlag && (
            <p>
              You can download this report in .xml format, a standard file
              format that works with other providers’ medical records systems.
            </p>
          )}
          <CCDDownloadSection
            isExtendedFileType={ccdExtendedFileTypeFlag}
            isLoading={generatingCCD}
            handleDownload={handleDownloadCCD}
            testIdSuffix="VistA"
            ddSuffix="VistA"
          />
        </va-accordion-item>
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
            This report includes all the health information you entered yourself
            in the previous version of My HealtheVet.
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
        </va-accordion-item>
      </va-accordion>
      <p className="vads-u-margin--0 vads-u-margin-top--2">
        <strong>Note:</strong> Blue Button and the Blue Button logo are
        registered service marks owned by the U.S. Department of Health and
        Human Services.
      </p>
    </div>
  );
};

export default VistaOnlyContent;
