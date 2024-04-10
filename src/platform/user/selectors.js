import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const selectUser = state => state.user;
export const isLoggedIn = state => selectUser(state).login.currentlyLoggedIn;
export const selectProfile = state => selectUser(state)?.profile || {};
export const isVAPatient = state => selectProfile(state).vaPatient === true;
export const selectVeteranStatus = state => selectProfile(state).veteranStatus;
export const isInMPI = state => selectProfile(state)?.status === 'OK';
export const isNotInMPI = state => selectProfile(state)?.status === 'NOT_FOUND';
export const hasMPIConnectionError = state =>
  selectProfile(state)?.status === 'SERVER_ERROR';
export const isProfileLoading = state => selectProfile(state).loading;
export const isLOA3 = state => selectProfile(state).loa.current === 3;
export const isLOA1 = state => selectProfile(state).loa.current === 1;
export const isMultifactorEnabled = state => selectProfile(state).multifactor;
export const selectAvailableServices = state => selectProfile(state)?.services;

export const selectVAPContactInfo = state =>
  selectProfile(state).vapContactInfo;
export const hasVAPServiceConnectionError = state =>
  selectVAPContactInfo(state)?.status === 'SERVER_ERROR';
export const selectVAPEmailAddress = state =>
  selectVAPContactInfo(state)?.email?.emailAddress;
const createPhoneNumberStringFromData = phoneNumberData => {
  const data = phoneNumberData || {};
  const areaCode = data.areaCode || '';
  const phoneNumber = data.phoneNumber || '';
  // in some test data the extension is set to '0000' and we want to treat that
  // as a null extension
  const extension = data.extension === '0000' ? undefined : data.extension;
  return `${areaCode}${phoneNumber}${extension ? `x${extension}` : ''}`;
};
export const selectVAPMobilePhone = state =>
  selectVAPContactInfo(state)?.mobilePhone;
export const selectVAPMobilePhoneString = state =>
  createPhoneNumberStringFromData(selectVAPMobilePhone(state));
export const selectVAPHomePhone = state =>
  selectVAPContactInfo(state)?.homePhone;
export const selectVAPHomePhoneString = state =>
  createPhoneNumberStringFromData(selectVAPHomePhone(state));
export const selectVAPResidentialAddress = state =>
  selectVAPContactInfo(state)?.residentialAddress;
export const selectVAPMailingAddress = state =>
  selectVAPContactInfo(state)?.mailingAddress;

export function createIsServiceAvailableSelector(service) {
  return state => selectAvailableServices(state).includes(service);
}

export const mhvTransitionModalEnabled = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.mhvToLogingovAccountTransitionModal];
