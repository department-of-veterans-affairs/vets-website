import React from 'react';
import PropTypes from 'prop-types';
import { AccessErrors } from './AccessErrors';
import CCDAlertSection from './CCDAlertSection';
import CCDDownloadSection from './CCDDownloadSection';

const OHOnlyContent = ({
  activeAlert,
  ccdDownloadSuccess,
  ccdError,
  ccdExtendedFileTypeFlag,
  CCDRetryTimestamp,
  generatingCCD,
  handleDownloadCCD,
  handleDownloadCCDV2,
}) => {
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

      <p>
        This Continuity of Care Document (CCD) is a summary of your VA medical
        records that you can share with non-VA providers in your community. It
        includes your allergies, medications, recent lab results, and more. We
        used to call this report your VA Health Summary.
      </p>
      {!ccdExtendedFileTypeFlag && (
        <p>
          You can download this report in .xml format, a standard file format
          that works with other providers' medical records systems.
        </p>
      )}

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

OHOnlyContent.propTypes = {
  ccdExtendedFileTypeFlag: PropTypes.bool.isRequired,
  generatingCCD: PropTypes.bool.isRequired,
  handleDownloadCCD: PropTypes.func.isRequired,
  handleDownloadCCDV2: PropTypes.func.isRequired,
  CCDRetryTimestamp: PropTypes.string,
  activeAlert: PropTypes.object,
  ccdDownloadSuccess: PropTypes.bool,
  ccdError: PropTypes.bool,
};

export default OHOnlyContent;
