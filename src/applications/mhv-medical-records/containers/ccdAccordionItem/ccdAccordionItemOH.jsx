import React from 'react';
import PropTypes from 'prop-types';
import TrackedSpinner from '../../components/shared/TrackedSpinner';

const CCDAccordionItemOH = ({ generatingCCD, handleDownloadCCDV2 }) => (
  <va-accordion-item bordered data-testid="ccdAccordionItem">
    <h3 slot="headline">Continuity of Care Document for non-VA providers</h3>
    <p className="vads-u-margin-bottom--3">
      This Continuity of Care Document (CCD) is a summary of your VA medical
      records that you can share with non-VA providers in your community. It
      includes your allergies, medications, recent lab results, and more. We
      used to call this report your VA Health Summary.
    </p>

    {generatingCCD ? (
      <div
        id="generating-ccd-oh-indicator"
        data-testid="generating-ccd-oh-indicator"
      >
        <TrackedSpinner
          id="download-ccd-oh-spinner"
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
            onClick={e => handleDownloadCCDV2(e, 'xml')}
            text="Download XML (best for sharing with your provider)"
            data-testid="generateCcdButtonXmlOH"
            data-dd-action-name="Download CCD XML OH"
          />
        </span>
        <span className="vads-u-margin-bottom--2">
          <va-link
            download
            href="#"
            onClick={e => handleDownloadCCDV2(e, 'pdf')}
            text="Download PDF (best for printing)"
            data-testid="generateCcdButtonPdfOH"
            data-dd-action-name="Download CCD PDF OH"
          />
        </span>
        <va-link
          download
          href="#"
          onClick={e => handleDownloadCCDV2(e, 'html')}
          text="Download HTML (best for screen readers, enlargers, and refreshable Braille displays)"
          data-testid="generateCcdButtonHtmlOH"
          data-dd-action-name="Download CCD HTML OH"
        />
      </div>
    )}
  </va-accordion-item>
);

CCDAccordionItemOH.propTypes = {
  generatingCCD: PropTypes.bool,
  handleDownloadCCDV2: PropTypes.func,
};

export default CCDAccordionItemOH;
