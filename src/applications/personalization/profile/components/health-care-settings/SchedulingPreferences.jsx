import React from 'react';
import { PROFILE_PATH_NAMES } from '../../constants';
import Headline from '../ProfileSectionHeadline';

const SchedulingPreferences = () => {
  return (
    <>
      <Headline level="2" className="vads-u-margin-bottom--2">
        {PROFILE_PATH_NAMES.SCHEDULING_PREFERENCES}
      </Headline>
      <p>Empty page, for now.</p>
    </>
  );
};

SchedulingPreferences.propTypes = {};

export default SchedulingPreferences;
