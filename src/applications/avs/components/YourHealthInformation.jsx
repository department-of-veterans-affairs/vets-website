import React from 'react';
import PropTypes from 'prop-types';

import { getFormattedAppointmentDate } from '../utils';

const YourHealthInformation = props => {
  const { avs } = props;
  const appointmentDate = getFormattedAppointmentDate(avs);

  return (
    <p>
      Note: the health information in this summary is from {appointmentDate}.{' '}
      <a href="/my-health/">
        Go to the MyHealtheVet website for your current VA medical records.
      </a>
    </p>
  );
};

export default YourHealthInformation;

YourHealthInformation.propTypes = {
  avs: PropTypes.object,
};
