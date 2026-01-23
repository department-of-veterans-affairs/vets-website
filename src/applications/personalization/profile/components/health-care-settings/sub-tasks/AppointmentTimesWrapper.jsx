import React from 'react';
import { FIELD_NAMES } from 'platform/user/exportsFile';
import { FIELD_OPTION_IDS } from 'platform/user/profile/vap-svc/constants/schedulingPreferencesConstants';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import SelectTimesContainer from './select-times/SelectTimesContainer';
import PreferenceSelection from './select-times/pages/PreferenceSelection';
import TimesSelection from './select-times/pages/TimesSelection';

const AppointmentTimesWrapper = () => {
  const getContentComponent = step =>
    step === 'select' ? PreferenceSelection : TimesSelection;

  const getButtons = (step, quickExit, handlers) => {
    const buttonParams = {
      leftButtonText: 'Continue',
      onPrimaryClick: handlers.continue,
      rightButtonText: 'Cancel',
      onSecondaryClick: handlers.breadCrumbClick,
      'data-testid': 'continue-cancel-buttons',
    };
    if (quickExit || step === 'choose-times') {
      buttonParams.leftButtonText = 'Save to profile';
      buttonParams.onPrimaryClick = handlers.save;
      buttonParams['data-testid'] = 'save-cancel-buttons';
    }

    return <VaButtonPair {...buttonParams} />;
  };

  return (
    <SelectTimesContainer
      getContentComponent={getContentComponent}
      getButtons={getButtons}
      fieldName={FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES}
      noPreferenceValue={
        FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES]
          .NO_PREFERENCE
      }
    />
  );
};

export default AppointmentTimesWrapper;
