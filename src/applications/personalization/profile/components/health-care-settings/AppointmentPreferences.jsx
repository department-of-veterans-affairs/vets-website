import React from 'react';
import { PROFILE_PATH_NAMES } from '../../constants';
import Headline from '../ProfileSectionHeadline';

const AppointmentPreferences = () => {
  return (
    <>
      <Headline level="2" className="vads-u-margin-bottom--2">
        {PROFILE_PATH_NAMES.APPOINTMENT_PREFERENCES}
      </Headline>
      <p>Empty page, for now.</p>
    </>
  );
};

AppointmentPreferences.propTypes = {};

export default AppointmentPreferences;
