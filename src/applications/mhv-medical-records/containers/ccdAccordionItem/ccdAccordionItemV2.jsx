import React from 'react';
import PropType from 'prop-types';
import TrackedSpinner from '../../components/shared/TrackedSpinner';

//  {ccdExtendedFileTypeFlag ?}
const CCDAccordionItemV2 = ({ generatingCCD, handleDownloadCCD }) => (
  <va-accordion-item bordered data-testid="ccdAccordionItem">
    <h3 slot="headline">Continuity of Care Document for non-VA providers</h3>
    <p className="vads-u-margin-bottom--3">
      This Continuity of Care Document (CCD) is a summary of your VA medical
      records that you can share with non-VA providers in your community. It
      includes your allergies, medications, recent lab results, and more. We
      used to call this report your VA Health Summary.
    </p>

    {generatingCCD ? (
      <div id="generating-ccd-indicator" data-testid="generating-ccd-indicator">
        <TrackedSpinner
          id="download-ccd-spinner"
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
            onClick={e => handleDownloadCCD(e, 'xml')}
            text="Download XML (best for sharing with your provider)"
            data-testid="generateCcdButtonXml"
            data-dd-action-name="Download CCD XML"
          />
        </span>
        <span className="vads-u-margin-bottom--2">
          <va-link
            download
            href="#"
            onClick={e => handleDownloadCCD(e, 'pdf')}
            text="Download PDF (best for printing)"
            data-testid="generateCcdButtonPdf"
            data-dd-action-name="Download CCD PDF"
          />
        </span>
        <va-link
          download
          href="#"
          onClick={e => handleDownloadCCD(e, 'html')}
          text="Download HTML (best for screen readers, enlargers, and refreshable Braille displays)"
          data-testid="generateCcdButtonHtml"
          data-dd-action-name="Download CCD HTML"
          className="vads-u-margin-top--2"
        />
      </div>
    )}
  </va-accordion-item>
);

CCDAccordionItemV2.propTypes = {
  generatingCCD: PropType.bool,
  handleDownloadCCD: PropType.func,
};

export default CCDAccordionItemV2;
