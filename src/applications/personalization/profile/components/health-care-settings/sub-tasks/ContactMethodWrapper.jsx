import React from 'react';
import { FIELD_NAMES } from 'platform/user/exportsFile';
import { FIELD_OPTION_IDS } from 'platform/user/profile/vap-svc/constants/schedulingPreferencesConstants';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ContactMethodSelect from './contact-method/pages/ContactMethodSelect';
import ContactMethodConfirm from './contact-method/pages/ContactMethodConfirm';
import PreferenceSelectionContainer from './PreferenceSelectionContainer';

const ContactMethodWrapper = () => {
  const getContentComponent = step =>
    step === 'select' ? ContactMethodSelect : ContactMethodConfirm;

  const getButtons = (step, quickExit, handlers) => {
    const buttonParams = {
      leftButtonText: 'Continue',
      onPrimaryClick: handlers.continue,
      rightButtonText: 'Cancel',
      onSecondaryClick: handlers.breadCrumbClick,
      'data-testid': 'continue-cancel-buttons',
    };
    if (quickExit || step === 'confirm') {
      buttonParams.leftButtonText = 'Save to profile';
      buttonParams.onPrimaryClick = handlers.save;
      buttonParams['data-testid'] = 'quick-exit-cancel-buttons';
    }
    if (step === 'confirm') {
      buttonParams.rightButtonText = 'Update information';
      buttonParams.onSecondaryClick = handlers.updateContactInfo;
      buttonParams['data-testid'] = 'save-update-buttons';
    }

    return <VaButtonPair {...buttonParams} />;
  };

  return (
    <PreferenceSelectionContainer
      emptyValue=""
      getContentComponent={getContentComponent}
      getButtons={getButtons}
      fieldName={FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD}
      noPreferenceValue={
        FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
          .NO_PREFERENCE
      }
    />
  );
};

export default ContactMethodWrapper;
