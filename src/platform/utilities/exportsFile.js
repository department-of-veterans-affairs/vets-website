import { requestStates } from './constants';
import sortListByFuzzyMatch from './fuzzy-matching';
import prefixUtilityClasses from './prefix-utility-classes';
import { usePrevious } from './react-hooks';
import { getAppUrl } from './registry-helpers';

/* accessibilty */
import {
  isWideScreen,
  isEscape,
  isTab,
  isReverseTab,
  getTabbableElements,
  isEnter,
} from './accessibility/index';

/* api */
import { fetchAndUpdateSessionExpiration, apiRequest } from './api/index';

/* cerner */
import {
  CERNER_FACILITY_IDS,
  CERNER_RX_BLOCKLIST,
  CERNER_MESSAGING_BLOCKLIST,
  CERNER_APPOINTMENTS_BLOCKLIST,
  CERNER_MEDICAL_RECORDS_BLOCKLIST,
  CERNER_TEST_RESULTS_BLOCKLIST,
  getCernerURL,
  appointmentsToolLink,
} from './cerner/index';

/* data */
import objectKeysToCamelCase from './data/camelCaseObjectKeys';
import checkValidPath from './data/checkValidPath';
import deconstructPath from './data/deconstructPath';
import deduplicate from './data/deduplicate';
import replacementFunctions from './data/index';
import removeDeeplyEmptyObjects from './data/removeDeeplyEmptyObjects';
import { titleCase } from './data/titleCase';

/* date */
import {
  dateToMoment,
  formatDateLong,
  formatDateParsedZoneLong,
  formatDateShort,
  formatDateParsedZoneShort,
  timeFromNow,
  isValidDateString,
  formatDowntime,
} from './date/index';

/* environments */
import environment from './environment/index';
import {
  replaceWithStagingDomain,
  replaceDomainsInData,
} from './environment/stagingDomains';
import isVATeamSiteSubdomain from './environment/va-subdomain';

/* feature-toggles */
import {
  connectFeatureToggle,
  updateFeatureToggleValue,
  useFeatureToggle,
  Toggler,
} from './feature-toggles/index';
import { getFlipperId, generateToken } from './feature-toggles/helpers';
import makeFlipperClient from './feature-toggles/flipper-client';
import featureFlagNames from './feature-toggles/featureFlagNames';

/* medical-centers */
import {
  medicalCenterLabels,
  getMedicalCenterNameByID,
} from './medical-centers/medical-centers';

/* sso */
import {
  CAUGHT_EXCEPTIONS,
  SSO_KEEP_ALIVE_ENDPOINT,
  AUTHN_HEADERS,
  AUTHN_KEYS,
  CSP_KEYS,
  CSP_AUTHN,
  SKIP_DUPE_QUERY,
  SKIP_DUPE,
  cernerEnvPrefixes,
  eauthEnvironmentPrefixes,
} from './sso/constants';
import {
  checkAndUpdateSSOeSession,
  checkAutoSession,
  ssoKeepAliveSession,
} from './sso/index';
import keepAliveSSO, {
  sanitizeAuthn,
  generateAuthnContext,
  keepAlive,
} from './sso/keepAliveSSO';
import {
  getLoginAttempted,
  setLoginAttempted,
  removeLoginAttempted,
} from './sso/loginAttempted';
import mockKeepAliveSSO from './sso/mockKeepAliveSSO';

/* storage */
import getLocalStorage from './storage/localStorage';

/* ui */
import asyncLoader from './ui/asyncLoader';
import DelayedRender from './ui/DelayedRender';
import {
  displayFileSize,
  focusElement,
  getScrollOptions,
  scrollToFirstError,
  scrollAndFocus,
  isReactComponent,
  displayPercent,
  formatSSN,
} from './ui/index';
import scrollTo from './ui/scrollTo';
import scrollToTop from './ui/scrollToTop';

export {
  requestStates,
  sortListByFuzzyMatch,
  prefixUtilityClasses,
  usePrevious,
  getAppUrl,
  isWideScreen,
  isEscape,
  isTab,
  isReverseTab,
  getTabbableElements,
  isEnter,
  fetchAndUpdateSessionExpiration,
  apiRequest,
  CERNER_FACILITY_IDS,
  CERNER_RX_BLOCKLIST,
  CERNER_MESSAGING_BLOCKLIST,
  CERNER_APPOINTMENTS_BLOCKLIST,
  CERNER_MEDICAL_RECORDS_BLOCKLIST,
  CERNER_TEST_RESULTS_BLOCKLIST,
  getCernerURL,
  appointmentsToolLink,
  objectKeysToCamelCase,
  checkValidPath,
  deconstructPath,
  deduplicate,
  replacementFunctions,
  removeDeeplyEmptyObjects,
  titleCase,
  dateToMoment,
  formatDateLong,
  formatDateParsedZoneLong,
  formatDateShort,
  formatDateParsedZoneShort,
  timeFromNow,
  isValidDateString,
  formatDowntime,
  environment,
  replaceWithStagingDomain,
  replaceDomainsInData,
  isVATeamSiteSubdomain,
  connectFeatureToggle,
  updateFeatureToggleValue,
  useFeatureToggle,
  Toggler,
  getFlipperId,
  generateToken,
  makeFlipperClient,
  featureFlagNames,
  medicalCenterLabels,
  getMedicalCenterNameByID,
  CAUGHT_EXCEPTIONS,
  SSO_KEEP_ALIVE_ENDPOINT,
  AUTHN_HEADERS,
  AUTHN_KEYS,
  CSP_KEYS,
  CSP_AUTHN,
  SKIP_DUPE_QUERY,
  SKIP_DUPE,
  cernerEnvPrefixes,
  eauthEnvironmentPrefixes,
  checkAndUpdateSSOeSession,
  checkAutoSession,
  ssoKeepAliveSession,
  keepAliveSSO,
  sanitizeAuthn,
  generateAuthnContext,
  keepAlive,
  getLoginAttempted,
  setLoginAttempted,
  removeLoginAttempted,
  mockKeepAliveSSO,
  getLocalStorage,
  asyncLoader,
  DelayedRender,
  displayFileSize,
  focusElement,
  getScrollOptions,
  scrollToFirstError,
  scrollAndFocus,
  isReactComponent,
  displayPercent,
  formatSSN,
  scrollTo,
  scrollToTop,
};
