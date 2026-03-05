/**
 * Adapter implementation for vets-website.
 *
 * This file wires up the concrete platform dependencies that the
 * extracted va-forms-system package needs. It is imported once
 * at application startup (e.g. in startApp or the form's entry file)
 * and passed to configureAdapter().
 *
 * Usage:
 *   import { configureAdapter } from '@department-of-veterans-affairs/va-forms-system';
 *   import adapterImpl from 'platform/forms-system/adapter-impl';
 *   configureAdapter(adapterImpl);
 */

// --- data helpers ---
export { default as get } from 'platform/utilities/data/get';
export { default as set } from 'platform/utilities/data/set';
export { default as omit } from 'platform/utilities/data/omit';
export { default as unset } from 'platform/utilities/data/unset';
export { default as debounce } from 'platform/utilities/data/debounce';
export { default as dataUtils } from 'platform/utilities/data';

// --- constants ---
export {
  ERROR_ELEMENTS,
  SCROLL_ELEMENT_SUFFIX,
  FOCUSABLE_ELEMENTS,
} from 'platform/utilities/constants';

// --- environment ---
export { default as environment } from 'platform/utilities/environment';

// --- storage ---
export { default as localStorage } from 'platform/utilities/storage/localStorage';

// --- ui helpers ---
export {
  isReactComponent,
  displayFileSize,
  formatSSN,
  formatARN,
} from 'platform/utilities/ui';
export {
  focusElement,
  focusByOrder,
  defaultFocusSelector,
  waitForRenderThenFocus,
} from 'platform/utilities/ui/focus';

// --- scroll helpers ---
export {
  Element as ScrollElement,
  scrollTo,
  scrollAndFocus,
  scrollToTop,
  scrollToFirstError,
  customScrollAndFocus,
  getScrollOptions,
  watchErrorUpdates,
} from 'platform/utilities/scroll';

// --- OAuth ---
export {
  infoTokenExists,
  refresh as refreshOAuth,
} from 'platform/utilities/oauth/utilities';

// --- React hooks ---
export { usePrevious } from 'platform/utilities/react-hooks';

// --- date ---
export { timeFromNow, dateFieldToDate } from 'platform/utilities/date';

// --- api ---
export { handleSessionUpdates, apiRequest, fetchAndUpdateSessionExpiration } from 'platform/utilities/api';

// --- registry ---
export { getAppUrl } from 'platform/utilities/registry-helpers';

// --- monitoring ---
export { default as recordEvent } from 'platform/monitoring/record-event';
export { dataDogLogger } from 'platform/monitoring/Datadog/utilities';
export {
  default as DowntimeNotification,
  externalServiceStatus,
} from 'platform/monitoring/DowntimeNotification';
export { default as DowntimeMessage } from 'platform/monitoring/DowntimeNotification/components/Down';

// --- user ---
export { selectProfile, isLoggedIn } from 'platform/user/selectors';
export { logOut } from 'platform/user/authentication/actions';
export { removeSavedForm, REMOVING_SAVED_FORM_SUCCESS } from 'platform/user/profile/actions';
export { default as AddressView } from 'platform/user/profile/vap-svc/components/AddressField/AddressView';
export { isFieldEmpty } from 'platform/user/profile/vap-svc/util';
export { FIELD_NAMES } from 'platform/user/profile/vap-svc/constants';
export { default as InitializeVAPServiceID } from 'platform/user/profile/vap-svc/containers/InitializeVAPServiceID';
export { default as ProfileInformationFieldController } from 'platform/user/profile/vap-svc/components/ProfileInformationFieldController';
export { refreshProfile, sanitizeUrl } from 'platform/user/exportsFile';
export {
  ContactInfoFormAppConfigProvider,
  useContactInfoFormAppConfig,
} from '@@vap-svc/components/ContactInfoFormAppConfigContext';

// --- static data ---
export { genderLabels } from 'platform/static-data/labels';
export { default as CallHRC } from 'platform/static-data/CallHRC';
export { default as countries } from 'platform/user/profile/vap-svc/constants/countries.json';

// --- site-wide ---
export { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
export {
  restartShouldRedirect,
  WIZARD_STATUS,
  WIZARD_STATUS_RESTARTING,
  WIZARD_STATUS_COMPLETE,
} from 'platform/site-wide/wizard';
export { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
export { generateMockUser } from 'platform/site-wide/user-nav/tests/mocks/user';
