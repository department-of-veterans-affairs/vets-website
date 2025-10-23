import React from 'react';
import { PROFILE_PATH_NAMES } from '../../constants';
import Headline from '../ProfileSectionHeadline';

const HealthCareSettingsPage = () => {
  return (
    <>
      <Headline level="2" className="vads-u-margin-bottom--2">
        {PROFILE_PATH_NAMES.HEALTH_CARE_SETTINGS}
      </Headline>
      <p>Empty page, for now.</p>
    </>
  );
};

HealthCareSettingsPage.propTypes = {};

export default HealthCareSettingsPage;
