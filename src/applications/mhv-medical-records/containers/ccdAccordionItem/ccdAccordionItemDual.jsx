import React from 'react';
import PropTypes from 'prop-types';
import TrackedSpinner from '../../components/shared/TrackedSpinner';

/**
 * Dual CCD Accordion Component for Oracle Health Patients
 *
 * TEMPORARY SOLUTION - Awaiting final UX/design from design team
 *
 * Why this component exists:
 * - Oracle Health patients have TWO data sources:
 *   1. Legacy VistA data (historical records before migration)
 *   2. Oracle Health FHIR data (current records)
 *
 * - VistA CCD: Complete historical data, uses V1 generate->download flow
 * - OH CCD: Current FHIR data + partial VistA import, uses V2 direct download
 *
 * Data completeness note:
 * - Patients may need both CCDs for complete medical history
 * - VistA has pre-migration history, OH has post-migration records
 */

const DownloadSection = ({
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

const CCDAccordionItemDual = ({
  generatingCCD,
  generatingCCDV2,
  handleDownloadCCD,
  handleDownloadCCDV2,
}) => (
  <va-accordion-item bordered data-testid="ccdAccordionItem">
    <h3 slot="headline">Continuity of Care Document for non-VA providers</h3>

    <p className="vads-u-margin-bottom--3">
      This Continuity of Care Document (CCD) is a summary of your VA medical
      records that you can share with non-VA providers in your community. It
      includes your allergies, medications, recent lab results, and more. We
      used to call this report your VA Health Summary.
    </p>

    <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
      Your VA Medical Records (Legacy System)
    </h4>
    <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
      Download your complete VistA medical record.
    </p>

    <div className="vads-u-margin-bottom--4">
      <DownloadSection
        isLoading={generatingCCD}
        handleDownload={handleDownloadCCD}
        testIdSuffix="Vista"
        ddSuffix="VistA"
      />
    </div>

    <h4 className="vads-u-margin-top--2 vads-u-margin-bottom--1">
      Your VA Medical Records (Oracle Health)
    </h4>
    <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
      Download your Oracle Health record. This includes partial VistA data.
    </p>

    <DownloadSection
      isLoading={generatingCCDV2}
      handleDownload={handleDownloadCCDV2}
      testIdSuffix="OH"
      ddSuffix="OH"
    />
  </va-accordion-item>
);

CCDAccordionItemDual.propTypes = {
  generatingCCD: PropTypes.bool,
  generatingCCDV2: PropTypes.bool,
  handleDownloadCCD: PropTypes.func,
  handleDownloadCCDV2: PropTypes.func,
};

export default CCDAccordionItemDual;
