import React from 'react';

import { PROFILE_PATH_NAMES } from '../../constants';
import Headline from '../ProfileSectionHeadline';
import SchedulingPreferencesContent from './SchedulingPreferencesContent';

const SchedulingPreferences = () => {
  const hasSchedulingPreferencesError = false; // TODO: get error state from redux when implemented

  return (
    <>
      <Headline
        dataTestId="scheduling-preferences-page-headline"
        classes={
          hasSchedulingPreferencesError
            ? 'vads-u-margin-bottom--4'
            : 'vads-u-margin-bottom--1'
        }
      >
        {PROFILE_PATH_NAMES.SCHEDULING_PREFERENCES}
      </Headline>
      <SchedulingPreferencesContent
        hasSchedulingPreferencesError={hasSchedulingPreferencesError}
      />
    </>
  );
};

SchedulingPreferences.propTypes = {};

export default SchedulingPreferences;
