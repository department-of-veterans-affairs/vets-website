import React from 'react';

import TrackedSpinner from '../shared/TrackedSpinner';
import AlertSection from './AlertSection';
import CCDDescription from './CCDDescription';
import CCDDownloadSection from './CCDDownloadSection';
import useSelfEnteredPdf from '../../hooks/useSelfEnteredPdf';
import { useDownloadReport } from '../../context/DownloadReportContext';

const VistaOnlyContent = () => {
  const {
    ccdExtendedFileTypeFlag,
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

      <AlertSection
        failedSeiDomains={failedSeiDomains}
        seiPdfGenerationError={seiPdfGenerationError}
        successfulSeiDownload={successfulSeiDownload}
      />
      <va-accordion bordered>
        <va-accordion-item bordered data-testid="ccdAccordionItem">
          <h3 slot="headline">
            Continuity of Care Document for non-VA providers
          </h3>
          <CCDDescription showXmlFormatText={!ccdExtendedFileTypeFlag} />
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
