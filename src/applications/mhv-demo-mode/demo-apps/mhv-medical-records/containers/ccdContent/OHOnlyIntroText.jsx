import React from 'react';
import PropTypes from 'prop-types';
import HoldTimeInfo from '../../components/shared/HoldTimeInfo';

const OHOnlyIntroText = ({ holdTimeMessagingUpdate }) => (
  <>
    <h1>Download your medical records report</h1>
    <p>
      Download your Continuity of Care Document (CCD), a summary of your VA
      medical records.
    </p>
    {holdTimeMessagingUpdate && (
      <HoldTimeInfo locationPhrase="in your reports" />
    )}
  </>
);

OHOnlyIntroText.propTypes = {
  holdTimeMessagingUpdate: PropTypes.bool,
};

export default OHOnlyIntroText;
