import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable component that displays the CCD description text.
 * Used in VistaOnlyContent, OHOnlyContent, and VistaAndOHContent.
 *
 * @param {boolean} showXmlFormatText - Whether to show the XML format description
 */
const CCDDescription = ({ showXmlFormatText = true }) => {
  return (
    <>
      <p>
        This Continuity of Care Document (CCD) is a summary of your VA medical
        records that you can share with non-VA providers in your community. It
        includes your allergies, medications, recent lab results, and more. We
        used to call this report your VA Health Summary.
      </p>
      {showXmlFormatText && (
        <p>
          You can download this report in .xml format, a standard file format
          that works with other providers' medical records systems.
        </p>
      )}
    </>
  );
};

CCDDescription.propTypes = {
  showXmlFormatText: PropTypes.bool,
};

export default CCDDescription;
