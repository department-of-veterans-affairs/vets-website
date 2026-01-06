import React from 'react';
import { AccessErrors } from './AccessErrors';
import CCDAlertSection from './CCDAlertSection';
import CCDDescription from './CCDDescription';
import CCDDownloadSection from './CCDDownloadSection';
import { useDownloadReport } from '../../context/DownloadReportContext';

const OHOnlyContent = () => {
  const {
    activeAlert,
    ccdDownloadSuccess,
    ccdError,
    ccdExtendedFileTypeFlag,
    CCDRetryTimestamp,
    generatingCCD,
    handleDownloadCCD,
    handleDownloadCCDV2,
  } = useDownloadReport();
  return (
    <div className="vads-u-margin-y--2">
      <h2>Download your Continuity of Care Document</h2>

      <AccessErrors CCDRetryTimestamp={CCDRetryTimestamp} />

      <CCDAlertSection
        activeAlert={activeAlert}
        ccdDownloadSuccess={ccdDownloadSuccess}
        ccdError={ccdError}
        CCDRetryTimestamp={CCDRetryTimestamp}
      />

      <CCDDescription showXmlFormatText={!ccdExtendedFileTypeFlag} />

      <CCDDownloadSection
        isExtendedFileType={ccdExtendedFileTypeFlag}
        isLoading={generatingCCD}
        handleDownload={
          ccdExtendedFileTypeFlag ? handleDownloadCCDV2 : handleDownloadCCD
        }
        testIdSuffix="OH"
        ddSuffix="OH"
      />
    </div>
  );
};

export default OHOnlyContent;
