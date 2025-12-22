import React from 'react';
import PropTypes from 'prop-types';
import { formatFacilityUnorderedList } from '../../util/facilityHelpers';

const VistaAndOHIntroText = ({ ohFacilityNames, vistaFacilityNames }) => (
  <>
    <h1>Download your medical records reports</h1>
    <p>
      You can download your VA medical records as a single report (called your
      VA Blue Button report) or download your self-entered health information
      for these facilities:
    </p>
    {formatFacilityUnorderedList(vistaFacilityNames)}
    <p>
      VA medical records for these facilities aren’t available in your Blue
      Button report right now. Download your Continuity of Care Document (CCD)
      to access medical records for these facilities:
    </p>
    {formatFacilityUnorderedList(ohFacilityNames)}
  </>
);

VistaAndOHIntroText.propTypes = {
  ohFacilityNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  vistaFacilityNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default VistaAndOHIntroText;
