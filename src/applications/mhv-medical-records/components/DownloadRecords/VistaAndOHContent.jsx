import React from 'react';
import {
  SEI_DOMAINS,
  ALERT_TYPE_SEI_ERROR,
  MissingRecordsError,
} from '@department-of-veterans-affairs/mhv/exports';
import { AccessErrors } from './AccessErrors';
import CCDDownloadSection from './CCDDownloadSection';
import AccessTroubleAlertBox from '../shared/AccessTroubleAlertBox';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import TrackedSpinner from '../shared/TrackedSpinner';
import useSelfEnteredPdf from '../../hooks/useSelfEnteredPdf';
import {
  accessAlertTypes,
  ALERT_TYPE_CCD_ERROR,
  documentTypes,
} from '../../util/constants';
import { formatFacilityList } from '../../util/facilityHelpers';
import { useDownloadReport } from '../../context/DownloadReportContext';
import CCDDescription from './CCDDescription';

const VistaAndOHContent = () => {
  const {
    activeAlert,
    ccdError,
    ccdExtendedFileTypeFlag,
    CCDRetryTimestamp,
    ohFacilityNames,
    ccdDownloadSuccess,
    generatingCCD,
    handleDownloadCCD,
    handleDownloadCCDV2,
    vistaFacilityNames,
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
      <h2>Download your Continuity of Care Document</h2>
      {ccdDownloadSuccess &&
        (!ccdError && !CCDRetryTimestamp) && (
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
      <CCDDescription showXmlFormatText={!ccdExtendedFileTypeFlag} />
      <div className="vads-u-margin-top--3, vads-u-margin-bottom--4">
        {ccdExtendedFileTypeFlag ? (
          <>
            <p className="vads-u-font-weight--bold">
              CCD: medical records from {formatFacilityList(vistaFacilityNames)}
            </p>

            <div className="vads-u-margin-bottom--4">
              <CCDDownloadSection
                isExtendedFileType={ccdExtendedFileTypeFlag}
                isLoading={generatingCCD}
                handleDownload={handleDownloadCCD}
                testIdSuffix="VistA"
                ddSuffix="VistA"
              />
            </div>

            <p className="vads-u-font-weight--bold">
              CCD: medical records from {formatFacilityList(ohFacilityNames)}
            </p>

            <CCDDownloadSection
              isExtendedFileType={ccdExtendedFileTypeFlag}
              isLoading={generatingCCD}
              handleDownload={handleDownloadCCDV2}
              testIdSuffix="OH"
              ddSuffix="OH"
            />
          </>
        ) : (
          <CCDDownloadSection
            isExtendedFileType={ccdExtendedFileTypeFlag}
            isLoading={generatingCCD}
            handleDownload={handleDownloadCCD}
            testIdSuffix=""
            ddSuffix=""
          />
          // <>
          //   {generatingCCD ? (
          //     <div
          //       id="generating-ccd-indicator"
          //       data-testid="generating-ccd-indicator"
          //     >
          //       <TrackedSpinner
          //         id="download-ccd-spinner"
          //         label="Loading"
          //         message="Preparing your download..."
          //       />
          //     </div>
          //   ) : (
          //     <div className="vads-u-display--flex vads-u-flex-direction--column">
          //       <va-link
          //         download
          //         href="#"
          //         onClick={e => handleDownloadCCD(e, 'xml')}
          //         text="Download Continuity of Care Document (XML)"
          //         data-testid="generateCcdButtonXml"
          //         data-dd-action-name="Download CCD XML"
          //       />
          //     </div>
          //   )}
          // </>
        )}
      </div>
      <h2>Download your self-entered health information</h2>
      {/* redux action/server errors */}
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

export default VistaAndOHContent;
