import React from 'react';
import PropType from 'prop-types';
import TrackedSpinner from '../../components/shared/TrackedSpinner';

const CCDAccordionItemV1 = ({ generatingCCD, handleDownloadCCD }) => (
  <va-accordion-item bordered data-testid="ccdAccordionItem">
    <h3 slot="headline">Continuity of Care Document for non-VA providers</h3>
    <p className="vads-u-margin--0">
      This Continuity of Care Document (CCD) is a summary of your VA medical
      records that you can share with non-VA providers in your community. It
      includes your allergies, medications, recent lab results, and more. We
      used to call this report your VA Health Summary.
    </p>
    <p>
      You can download this report in .xml format, a standard file format that
      works with other providers’ medical records systems.
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
        <va-link
          download
          href="#"
          onClick={e => handleDownloadCCD(e, 'xml')}
          text="Download Continuity of Care
Document (XML)"
          data-testid="generateCcdButtonXml"
          data-dd-action-name="Download CCD XML"
        />
      </div>
    )}
  </va-accordion-item>
);

CCDAccordionItemV1.propTypes = {
  generatingCCD: PropType.bool,
  handleDownloadCCD: PropType.func,
};

export default CCDAccordionItemV1;
