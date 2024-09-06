import has from 'lodash/has';
import { createSelector } from 'reselect';

import { toggleValues } from '~/platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';
import { CSP_IDS } from '~/platform/user/authentication/constants';

import { PROFILE_TOGGLES } from './constants';

// used specifically for direct deposit control information
export const getIsBlocked = controlInformation => {
  if (!controlInformation) return false;

  const propertiesToCheck = [
    'isCompetent',
    'hasNoFiduciaryAssigned',
    'isNotDeceased',
  ];

  // if any flag is false, the user is blocked
  // but first we have to determine if that particular flag property exists
  return propertiesToCheck.some(
    flag => has(controlInformation, flag) && !controlInformation[flag],
  );
};

export const personalInformationLoadError = state => {
  return (
    state.vaProfile?.personalInformation?.errors ||
    state.vaProfile?.personalInformation?.error
  );
};

export const militaryInformationLoadError = state => {
  return state.vaProfile?.militaryInformation?.serviceHistory?.error;
};

export const profileShowPronounsAndSexualOrientation = state =>
  toggleValues(state)?.[
    FEATURE_FLAG_NAMES.profileShowPronounsAndSexualOrientation
  ];

export const profileDoNotRequireInternationalZipCode = state =>
  toggleValues(state)?.[
    FEATURE_FLAG_NAMES.profileDoNotRequireInternationalZipCode
  ];

export const togglesAreLoaded = state => {
  return !toggleValues(state)?.loading;
};

export const selectProfileToggles = createSelector(toggleValues, values => {
  const { loading } = values;

  return Object.keys(PROFILE_TOGGLES).reduce(
    (acc, toggle) => {
      const key = FEATURE_FLAG_NAMES[toggle];
      acc[toggle] = values[key];
      return acc;
    },
    { loading, ...PROFILE_TOGGLES },
  );
});

export const selectHideDirectDeposit = state =>
  toggleValues(state)?.[FEATURE_FLAG_NAMES.profileHideDirectDeposit];

export const selectIsBlocked = state => {
  return getIsBlocked(state.directDeposit.controlInformation);
};

export const selectProfileContacts = state => state?.profileContacts || {};

export const selectHasRetiringSignInService = state => {
  const serviceName = state?.user?.profile?.signIn?.serviceName;
  return !serviceName || [CSP_IDS.DS_LOGON, CSP_IDS.MHV].includes(serviceName);
};

export const selectShowCredRetirementMessaging = state => {
  return (
    toggleValues(state)?.[
      FEATURE_FLAG_NAMES.profileShowCredentialRetirementMessaging
    ] && selectHasRetiringSignInService(state)
  );
};
