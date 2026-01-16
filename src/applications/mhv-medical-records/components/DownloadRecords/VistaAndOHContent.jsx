import React from 'react';
import AlertSection from './AlertSection';
import CCDDownloadSection from './CCDDownloadSection';
import TrackedSpinner from '../shared/TrackedSpinner';
import useSelfEnteredPdf from '../../hooks/useSelfEnteredPdf';
import { formatFacilityList } from '../../util/facilityHelpers';
import { useDownloadReport } from '../../context/DownloadReportContext';
import CCDDescription from './CCDDescription';

const VistaAndOHContent = () => {
  const {
    ccdExtendedFileTypeFlag,
    ohFacilityNames,
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
      <AlertSection
        showSeiAlerts={false}
        failedSeiDomains={failedSeiDomains}
        seiPdfGenerationError={seiPdfGenerationError}
        successfulSeiDownload={successfulSeiDownload}
      />
      <CCDDescription showXmlFormatText={!ccdExtendedFileTypeFlag} />
      <div className="vads-u-margin-top--3 vads-u-margin-bottom--4">
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
        )}
      </div>
      <h2>Download your self-entered health information</h2>
      <AlertSection
        showCcdAlerts={false}
        failedSeiDomains={failedSeiDomains}
        seiPdfGenerationError={seiPdfGenerationError}
        successfulSeiDownload={successfulSeiDownload}
      />
      <p>
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
