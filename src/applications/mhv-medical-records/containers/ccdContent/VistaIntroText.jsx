import React from 'react';
import PropTypes from 'prop-types';
import HoldTimeInfo from '../../components/shared/HoldTimeInfo';

const VistaIntroText = ({ holdTimeMessagingUpdate }) => (
  <>
    <h1>Download your medical records reports</h1>
    <p>
      Download your VA medical records as a single report (called your VA Blue
      Button® report). Or find other reports to download.
    </p>
    {holdTimeMessagingUpdate && (
      <HoldTimeInfo locationPhrase="in your reports" />
    )}
  </>
);

VistaIntroText.propTypes = {
  holdTimeMessagingUpdate: PropTypes.bool,
};

export default VistaIntroText;
