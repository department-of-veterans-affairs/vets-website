import camelCaseKeysRecursive from 'camelcase-keys-recursive';

import {
  setSentryLoginType,
  clearSentryLoginType,
} from '../../authentication/utilities';
import localStorage from '../../../utilities/storage/localStorage';

import {
  BAD_UNIT_NUMBER,
  MISSING_UNIT_NUMBER,
} from '../constants/addressValidationMessages';

import {
  isVet360Configured,
  mockContactInformation,
} from 'vet360/util/local-vet360';

const commonServices = {
  EMIS: 'EMIS',
  MVI: 'MVI',
  Vet360: 'Vet360',
};

function getErrorStatusDesc(code) {
  if (code === 404) {
    return 'NOT_FOUND';
  }

  if (code === 401) {
    return 'NOT_AUTHORIZED';
  }

  return 'SERVER_ERROR';
}

export function mapRawUserDataToState(json) {
  const {
    data: {
      attributes: {
        inProgressForms: savedForms,
        prefillsAvailable,
        profile: {
          signIn,
          birthDate: dob,
          email,
          firstName: first,
          gender,
          lastName: last,
          loa,
          middleName: middle,
          multifactor,
          verified,
        },
        services,
        vaProfile,
        vet360ContactInformation,
        veteranStatus,
      },
    },
    meta,
  } = camelCaseKeysRecursive(json);

  const userState = {
    accountType: loa.current,
    signIn,
    dob,
    email,
    gender,
    loa,
    multifactor,
    prefillsAvailable,
    savedForms,
    services,
    userFullName: {
      first,
      middle,
      last,
    },
    verified,
    vet360: isVet360Configured()
      ? vet360ContactInformation
      : mockContactInformation,
  };

  if (meta && veteranStatus === null) {
    const errorStatus = meta.errors.find(
      error => error.externalService === commonServices.EMIS,
    ).status;
    userState.veteranStatus = getErrorStatusDesc(errorStatus);
  } else {
    userState.isVeteran = veteranStatus.isVeteran;
    userState.veteranStatus = {
      isVeteran: veteranStatus.isVeteran,
      veteranStatus,
      servedInMilitary: veteranStatus.servedInMilitary,
    };
  }

  if (meta && vaProfile === null) {
    const errorStatus = meta.errors.find(
      error => error.externalService === commonServices.MVI,
    ).status;
    userState.status = getErrorStatusDesc(errorStatus);
  } else {
    userState.status = vaProfile.status;
  }

  // This one is checking userState because there's no extra mapping and it's
  // easier to leave the mocking code the way it is
  if (meta && userState.vet360 === null) {
    const errorStatus = meta.errors.find(
      error => error.externalService === commonServices.Vet360,
    ).status;
    userState.vet360 = { status: getErrorStatusDesc(errorStatus) };
  }

  return userState;
}

// Flag to indicate an active session for initial page loads.
// It's distinct from the currentlyLoggedIn state, which
// serves as confirmation that the user is logged in and
// as a trigger to properly update any components that subscribe to it.
export const hasSession = () => localStorage.getItem('hasSession');

export function setupProfileSession(userProfile) {
  const { firstName, signIn } = userProfile;
  const loginType = (signIn && signIn.serviceName) || null;

  localStorage.setItem('hasSession', true);

  // Since localStorage coerces everything into String,
  // this avoids setting the first name to the string 'null'.
  if (firstName) localStorage.setItem('userFirstName', firstName);

  // Set Sentry Tag so we can associate errors with the login policy
  setSentryLoginType(loginType);
}

export function teardownProfileSession() {
  // Legacy keys (entryTime, userToken) can be removed
  // after session cookie is fully in place.
  const sessionKeys = ['hasSession', 'userFirstName', 'sessionExpiration'];
  for (const key of sessionKeys) localStorage.removeItem(key);
  sessionStorage.removeItem('shouldRedirectExpiredSession');
  clearSentryLoginType();
}

export const getValidationMessageKey = (
  suggestedAddresses,
  validationKey,
  addressValidationError,
) => {
  const singleSuggestion = suggestedAddresses.length === 1;
  const multipleSuggestions = suggestedAddresses.length > 1;
  const containsBadUnitNumber =
    suggestedAddresses.filter(
      address =>
        address.addressMetaData?.deliveryPointValidation === BAD_UNIT_NUMBER,
    ).length > 0;

  const containsMissingUnitNumber =
    suggestedAddresses.filter(
      address =>
        address.addressMetaData?.deliveryPointValidation ===
        MISSING_UNIT_NUMBER,
    ).length > 0;

  if (addressValidationError) {
    return 'validationError';
  }

  if (singleSuggestion && containsBadUnitNumber) {
    return validationKey ? 'badUnitNumberOverride' : 'badUnitNumber';
  }

  if (singleSuggestion && containsMissingUnitNumber) {
    return validationKey ? 'missingUnitNumberOverride' : 'missingUnitNumber';
  }

  if (
    singleSuggestion &&
    !containsMissingUnitNumber &&
    !containsBadUnitNumber
  ) {
    return validationKey ? 'showSuggestionsOverride' : 'showSuggestions';
  }

  if (multipleSuggestions) {
    return validationKey ? 'showSuggestionsOverride' : 'showSuggestions';
  }

  return 'showSuggestions'; // defaulting here so the modal will show but not allow override
};

export const showAddressValidationModal = suggestedAddresses => {
  if (
    suggestedAddresses.length === 1 &&
    (suggestedAddresses[0].addressMetaData?.deliveryPointValidation ===
      BAD_UNIT_NUMBER ||
      suggestedAddresses[0].addressMetaData?.deliveryPointValidation ===
        MISSING_UNIT_NUMBER)
  ) {
    return true;
  }

  if (suggestedAddresses.length > 1) {
    return true;
  }

  return suggestedAddresses[0]?.addressMetaData?.confidenceScore < 80;
};
