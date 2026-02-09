import React from 'react';
import PropTypes from 'prop-types';
import TrackedSpinner from '../shared/TrackedSpinner';

export const CCDDownloadLinksExtended = ({
  ddSuffix,
  handleDownload,
  testIdSuffix,
}) => (
  <div className="vads-u-display--flex vads-u-flex-direction--column">
    <span className="vads-u-margin-bottom--2">
      <va-link
        download
        href="#"
        onClick={e => handleDownload(e, 'xml')}
        text="Download XML (best for sharing with your provider)"
        data-testid={`generateCcdButtonXml${testIdSuffix}`}
        data-dd-action-name={`Download CCD XML${
          ddSuffix ? ` ${ddSuffix}` : ''
        }`}
      />
    </span>
    <span className="vads-u-margin-bottom--2">
      <va-link
        download
        href="#"
        onClick={e => handleDownload(e, 'pdf')}
        text="Download PDF (best for printing)"
        data-testid={`generateCcdButtonPdf${testIdSuffix}`}
        data-dd-action-name={`Download CCD PDF${
          ddSuffix ? ` ${ddSuffix}` : ''
        }`}
      />
    </span>
    <va-link
      download
      href="#"
      onClick={e => handleDownload(e, 'html')}
      text="Download HTML (best for screen readers, enlargers, and refreshable Braille displays)"
      data-testid={`generateCcdButtonHtml${testIdSuffix}`}
      data-dd-action-name={`Download CCD HTML${ddSuffix ? ` ${ddSuffix}` : ''}`}
    />
  </div>
);

CCDDownloadLinksExtended.propTypes = {
  handleDownload: PropTypes.func.isRequired,
  ddSuffix: PropTypes.string,
  testIdSuffix: PropTypes.string,
};

export const CCDDownloadLinksBasic = ({
  ddSuffix,
  handleDownload,
  testIdSuffix,
}) => (
  <div className="vads-u-display--flex vads-u-flex-direction--column">
    <va-link
      download
      href="#"
      onClick={e => handleDownload(e, 'xml')}
      text="Download Continuity of Care Document (XML)"
      data-testid={`generateCcdButtonXml${testIdSuffix}`}
      data-dd-action-name={`Download CCD XML${ddSuffix ? ` ${ddSuffix}` : ''}`}
    />
  </div>
);

CCDDownloadLinksBasic.propTypes = {
  handleDownload: PropTypes.func.isRequired,
  ddSuffix: PropTypes.string,
  testIdSuffix: PropTypes.string,
};

const CCDDownloadSection = ({
  isLoading,
  isExtendedFileType = false,
  handleDownload,
  testIdSuffix,
  ddSuffix,
}) => {
  // When testIdSuffix is empty, don't add the hyphen separator
  const indicatorSuffix = testIdSuffix ? `-${testIdSuffix}` : '';

  if (isLoading)
    return (
      <div
        id={`generating-ccd${indicatorSuffix}-indicator`}
        data-testid={`generating-ccd${indicatorSuffix}-indicator`}
      >
        <TrackedSpinner
          id={`download-ccd${indicatorSuffix}-spinner`}
          label="Loading"
          message="Preparing your download..."
        />
      </div>
    );

  return (
    <>
      {isExtendedFileType ? (
        <CCDDownloadLinksExtended
          handleDownload={handleDownload}
          testIdSuffix={testIdSuffix}
          ddSuffix={ddSuffix}
        />
      ) : (
        <CCDDownloadLinksBasic
          handleDownload={handleDownload}
          testIdSuffix={testIdSuffix}
          ddSuffix={ddSuffix}
        />
      )}
    </>
  );
};

CCDDownloadSection.propTypes = {
  handleDownload: PropTypes.func.isRequired,
  ddSuffix: PropTypes.string,
  isExtendedFileType: PropTypes.bool,
  isLoading: PropTypes.bool,
  testIdSuffix: PropTypes.string,
};

export default CCDDownloadSection;
