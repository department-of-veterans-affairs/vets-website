import React from 'react';
import AlertSection from './AlertSection';
import CCDDescription from './CCDDescription';
import CCDDownloadSection from './CCDDownloadSection';
import { useDownloadReport } from '../../context/DownloadReportContext';

const OHOnlyContent = () => {
  const {
    ccdExtendedFileTypeFlag,
    generatingCCD,
    handleDownloadCCD,
    handleDownloadCCDV2,
  } = useDownloadReport();
  return (
    <div className="vads-u-margin-y--2">
      <h2>Download your Continuity of Care Document</h2>

      <AlertSection showSeiAlerts={false} />

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
