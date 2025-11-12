import React from 'react';
import { PROFILE_PATH_NAMES } from '../../constants';
import Headline from '../ProfileSectionHeadline';
import LoadFail from '../alerts/LoadFail';

const SchedulingPreferences = () => {
  const error = false; // TODO: get error state from redux when implemented

  return (
    <>
      <Headline
        dataTestId="scheduling-preferences-page-headline"
        classes={error ? 'vads-u-margin-bottom--4' : 'vads-u-margin-bottom--1'}
      >
        {PROFILE_PATH_NAMES.SCHEDULING_PREFERENCES}
      </Headline>
      {error && <LoadFail />}
      {!error && (
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--4">
          Manage your scheduling preferences for health care appointments.
          Whenever possible, schedulers will consider your preferences when
          making appointments.
        </p>
      )}
    </>
  );
};

SchedulingPreferences.propTypes = {};

export default SchedulingPreferences;
