import React from 'react';
import PropTypes from 'prop-types';
import TrackedSpinner from '../../components/shared/TrackedSpinner';

export const DownloadSection = ({
  isLoading,
  handleDownload,
  testIdSuffix,
  ddSuffix,
}) => (
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
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        <span className="vads-u-margin-bottom--2">
          <va-link
            download
            href="#"
            onClick={e => handleDownload(e, 'xml')}
            text="Download XML (best for sharing with your provider)"
            data-testid={`generateCcdButtonXml${testIdSuffix}`}
            data-dd-action-name={`Download CCD XML ${ddSuffix}`}
          />
        </span>
        <span className="vads-u-margin-bottom--2">
          <va-link
            download
            href="#"
            onClick={e => handleDownload(e, 'pdf')}
            text="Download PDF (best for printing)"
            data-testid={`generateCcdButtonPdf${testIdSuffix}`}
            data-dd-action-name={`Download CCD PDF ${ddSuffix}`}
          />
        </span>
        <va-link
          download
          href="#"
          onClick={e => handleDownload(e, 'html')}
          text="Download HTML (best for screen readers, enlargers, and refreshable Braille displays)"
          data-testid={`generateCcdButtonHtml${testIdSuffix}`}
          data-dd-action-name={`Download CCD HTML ${ddSuffix}`}
        />
      </div>
    )}
  </>
);

DownloadSection.propTypes = {
  ddSuffix: PropTypes.string,
  handleDownload: PropTypes.func,
  isLoading: PropTypes.bool,
  testIdSuffix: PropTypes.string,
};

const CCDAccordionItemVista = ({ generatingCCD, handleDownloadCCD }) => (
  <va-accordion-item bordered data-testid="ccdAccordionItem">
    <h3 slot="headline">Continuity of Care Document</h3>
    <p className="vads-u-margin-bottom--3">
      This Continuity of Care Document (CCD) is a summary of your VA medical
      records that you can share with non-VA providers in your community. It
      includes your allergies, medications, recent lab results, and more. We
      used to call this report your VA Health Summary.
    </p>

    <div className="vads-u-margin-bottom--4">
      <DownloadSection
        isLoading={generatingCCD}
        handleDownload={handleDownloadCCD}
        testIdSuffix="Vista"
        ddSuffix="VistA"
      />
    </div>
  </va-accordion-item>
);

CCDAccordionItemVista.propTypes = {
  generatingCCD: PropTypes.bool,
  handleDownloadCCD: PropTypes.func,
};

export default CCDAccordionItemVista;
