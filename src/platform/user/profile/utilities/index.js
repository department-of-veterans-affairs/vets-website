import camelCaseKeysRecursive from 'camelcase-keys-recursive';

import {
  setSentryLoginType,
  clearSentryLoginType,
} from '../../authentication/utilities';
import localStorage from 'platform/utilities/storage/localStorage';

import { ssoKeepAliveSession } from 'platform/utilities/sso';

import {
  ADDRESS_VALIDATION_TYPES,
  BAD_UNIT_NUMBER,
  MISSING_UNIT_NUMBER,
  CONFIRMED,
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
    if (vaProfile.facilities) {
      userState.facilities = vaProfile.facilities;
    }
    userState.vaPatient = vaProfile.vaPatient;
    userState.mhvAccountState = vaProfile.mhvAccountState;
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

// hasSessionSSO will only ever be true or false.
// Wrapping in JSON.parse enables making boolean checks with this function call.
export const hasSessionSSO = () =>
  JSON.parse(localStorage.getItem('hasSessionSSO'));

export function setupProfileSession(userProfile) {
  const { firstName, signIn } = userProfile;
  const loginType = signIn?.serviceName || null;
  localStorage.setItem('hasSession', true);
  if (signIn?.ssoe) {
    ssoKeepAliveSession();
  }

  // Since localStorage coerces everything into String,
  // this avoids setting the first name to the string 'null'.
  if (firstName) localStorage.setItem('userFirstName', firstName);

  // Set Sentry Tag so we can associate errors with the login policy
  setSentryLoginType(loginType);
}

export function teardownProfileSession() {
  // Legacy keys (entryTime, userToken) can be removed
  // after session cookie is fully in place.
  const sessionKeys = [
    'hasSession',
    'userFirstName',
    'sessionExpiration',
    'hasSessionSSO',
    'sessionExpirationSSO',
  ];
  for (const key of sessionKeys) localStorage.removeItem(key);
  sessionStorage.removeItem('shouldRedirectExpiredSession');
  clearSentryLoginType();
}

export const getValidationMessageKey = (
  suggestedAddresses,
  validationKey,
  addressValidationError,
  confirmedSuggestions,
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
    return ADDRESS_VALIDATION_TYPES.VALIDATION_ERROR;
  }

  if (singleSuggestion && containsBadUnitNumber) {
    return validationKey
      ? ADDRESS_VALIDATION_TYPES.BAD_UNIT_OVERRIDE
      : ADDRESS_VALIDATION_TYPES.BAD_UNIT;
  }

  if (singleSuggestion && containsMissingUnitNumber) {
    return validationKey
      ? ADDRESS_VALIDATION_TYPES.MISSING_UNIT_OVERRIDE
      : ADDRESS_VALIDATION_TYPES.MISSING_UNIT;
  }

  if (
    !confirmedSuggestions.length &&
    singleSuggestion &&
    !containsMissingUnitNumber &&
    !containsBadUnitNumber
  ) {
    return validationKey
      ? ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE
      : ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS_NO_CONFIRMED;
  }

  if (
    confirmedSuggestions.length &&
    singleSuggestion &&
    !containsMissingUnitNumber &&
    !containsBadUnitNumber
  ) {
    return validationKey
      ? ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS_OVERRIDE
      : ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS;
  }

  if (multipleSuggestions) {
    return validationKey
      ? ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS_OVERRIDE
      : ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS;
  }

  return ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS; // defaulting here so the modal will show but not allow override
};

// Determines if we need to prompt the user to pick from a list of suggested
// addresses and/or edit the address that they had entered. The only time the
// address validation modal will _not_ be shown to the user is if the validation
// API came back with one valid address suggestion that it is very confident is
// the address the user entered.
export const showAddressValidationModal = suggestedAddresses => {
  // pull the addressMetaData prop off the first suggestedAddresses element
  const [{ addressMetaData } = {}] = suggestedAddresses;

  if (
    suggestedAddresses.length === 1 &&
    addressMetaData.confidenceScore > 90 &&
    addressMetaData.deliveryPointValidation === CONFIRMED
  ) {
    return false;
  }

  return true;
};
