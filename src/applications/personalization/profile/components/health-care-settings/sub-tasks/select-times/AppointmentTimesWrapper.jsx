import React from 'react';
import { FIELD_NAMES } from 'platform/user/exportsFile';
import { FIELD_OPTION_IDS } from 'platform/user/profile/vap-svc/constants/schedulingPreferencesConstants';
import SelectTimesContainer from './SelectTimesContainer';

const AppointmentTimesWrapper = () => (
  <SelectTimesContainer
    fieldName={FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES}
    noPreferenceValue={
      FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES]
        .NO_PREFERENCE
    }
  />
);

export default AppointmentTimesWrapper;
