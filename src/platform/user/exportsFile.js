import {
  selectUser,
  isLoggedIn,
  selectProfile,
  isVAPatient,
  selectVeteranStatus,
  isInMPI,
  isNotInMPI,
  hasMPIConnectionError,
  isProfileLoading,
  isLOA3,
  isLOA1,
  isMultifactorEnabled,
  selectAvailableServices,
  selectPatientFacilities,
  selectCernerFacilitiesDsot,
  selectCernerFacilityIdsDsot,
  selectPatientFacilitiesDsot,
  selectPatientCernerFacilitiesDsot,
  selectVAPContactInfo,
  hasVAPServiceConnectionError,
  selectVAPEmailAddress,
  selectVAPMobilePhone,
  selectVAPMobilePhoneString,
  selectVAPHomePhone,
  selectVAPHomePhoneString,
  selectVAPResidentialAddress,
  selectVAPMailingAddress,
  createIsServiceAvailableSelector,
  selectIsCernerOnlyPatient,
  selectIsCernerOnlyPatientDsot,
  selectIsCernerPatient,
  selectIsCernerPatientDsot,
  selectCernerRxFacilities,
  selectCernerMessagingFacilities,
  selectCernerAppointmentsFacilities,
  selectCernerMedicalRecordsFacilities,
  selectCernerTestResultsFacilities,
  mhvTransitionEnabled,
  mhvTransitionModalEnabled,
  shouldRedirectToMyVA,
} from './selectors';

/* authentication */
import {
  LOG_OUT,
  UPDATE_LOGGEDIN_STATUS,
  CHECK_KEEP_ALIVE,
  updateLoggedInStatus,
  logOut,
  checkKeepAlive,
} from './authentication/actions';

import AccountTransitionModal from './authentication/components/account-transition/TransitionModal';
import TransitionSuccessModal from './authentication/components/account-transition/TransitionSuccessModal';

import AccountLink from './authentication/components/AccountLink';
import {
  downtimeBannersConfig,
  DowntimeBanner,
} from './authentication/components/DowntimeBanner';
import FedWarning from './authentication/components/FedWarning';
import IDMeSVG from './authentication/components/IDMeSVG';
import LoginActions from './authentication/components/LoginActions';
import LoginButton, {
  loginHandler,
} from './authentication/components/LoginButton';
import {
  logoSrc,
  LoginContainer,
} from './authentication/components/LoginContainer';
import LoginGovSVG from './authentication/components/LoginGovSVG';
import LoginHeader from './authentication/components/LoginHeader';
import LoginInfo from './authentication/components/LoginInfo';
import LogoutAlert from './authentication/components/LogoutAlert';
import ServiceProvidersList from './authentication/components/ServiceProvidersList';
import ServiceProviders, {
  ServiceProvidersTextCreateAcct,
} from './authentication/components/ServiceProvidersText';
import SessionTimeoutModal from './authentication/components/SessionTimeoutModal';
import SignInModal from './authentication/components/SignInModal';

import {
  defaultSignInProviders,
  defaultSignUpProviders,
  defaultMobileQueryParams,
  defaultMobileOAuthOptions,
  defaultWebOAuthOptions,
} from './authentication/config/constants';
import DEV from './authentication/config/dev.config';
import STAGING from './authentication/config/staging.config';
import PROD from './authentication/config/prod.config';

import loginStuff from './authentication/reducers/index';

import {
  API_VERSION,
  SIS_API_VERSION,
  API_SESSION_URL,
  API_SIGN_IN_SERVICE_URL,
  AUTH_EVENTS,
  SERVICE_PROVIDERS,
  CSP_IDS,
  AUTHN_SETTINGS,
  EXTERNAL_APPS,
  EBENEFITS_DEFAULT_PATH,
  eAuthURL,
  EXTERNAL_REDIRECTS,
  GA,
  IDME_TYPES,
  POLICY_TYPES,
  SIGNUP_TYPES,
  CSP_CONTENT,
  AUTH_LEVEL,
  AUTH_ERROR,
  MHV_TRANSITION_DATE,
  MHV_TRANSITION_TIME,
  ACCOUNT_TRANSITION_DISMISSED,
  LINK_TYPES,
  AUTH_PARAMS,
} from './authentication/constants';
import {
  hasCheckedKeepAlive,
  signInServiceName,
  isAuthenticatedWithSSOe,
  ssoeTransactionId,
  transitionMHVAccount,
} from './authentication/selectors';
import { externalApplicationsConfig } from './authentication/usip-config';
import {
  loginAppUrlRE,
  getQueryParams,
  reduceAllowedProviders,
  isExternalRedirect,
  sanitizeUrl,
  sanitizePath,
  generateReturnURL,
  createExternalApplicationUrl,
  getGAClientId,
  createAndStoreReturnUrl,
  sessionTypeUrl,
  setSentryLoginType,
  clearSentryLoginType,
  redirect,
  login,
  mfa,
  verify,
  logout,
  signup,
  signupUrl,
  logoutUrl,
} from './authentication/utilities';

/* authorization */

import AcceptTermsPrompt from './authorization/components/AcceptTermsPrompt';
import RequiredLoginView, {
  RequiredLoginLoader,
} from './authorization/components/RequiredLoginView';
import { MHVApp } from './authorization/containers/MHVApp';
import { RequiredTermsAcceptanceView } from './authorization/containers/RequiredTermsAcceptanceView';

/* profile */

import {
  UPDATE_PROFILE_FIELDS,
  PROFILE_LOADING_FINISHED,
  REMOVING_SAVED_FORM,
  REMOVING_SAVED_FORM_SUCCESS,
  REMOVING_SAVED_FORM_FAILURE,
  updateProfileFields,
  profileLoadingFinished,
  refreshProfile,
  initializeProfile,
  removingSavedForm,
  removingSavedFormSuccess,
  removingSavedFormFailure,
  removeSavedForm,
} from './profile/actions/index';
import {
  FETCHING_MHV_ACCOUNT,
  FETCH_MHV_ACCOUNT_FAILURE,
  FETCH_MHV_ACCOUNT_SUCCESS,
  CREATING_MHV_ACCOUNT,
  CREATE_MHV_ACCOUNT_FAILURE,
  CREATE_MHV_ACCOUNT_SUCCESS,
  UPGRADING_MHV_ACCOUNT,
  UPGRADE_MHV_ACCOUNT_FAILURE,
  UPGRADE_MHV_ACCOUNT_SUCCESS,
  fetchMHVAccount,
  createMHVAccount,
  upgradeMHVAccount,
  createAndUpgradeMHVAccount,
} from './profile/actions/mhv';

import backendServices from './profile/constants/backendServices';
import profileInformation from './profile/reducers/index';
import {
  mapRawUserDataToState,
  hasSession,
  hasSessionSSO,
  setupProfileSession,
  teardownProfileSession,
} from './profile/utilities/index';

/* vap-svc */

import {
  selectIsVAProfileServiceAvailableForUser,
  selectVAPContactInfoField,
  selectVAPServiceTransaction,
  selectVAPServiceFailedTransactions,
  selectMostRecentlyUpdatedField,
  selectVAPServicePendingCategoryTransactions,
  selectEditedFormField,
  selectCurrentlyOpenEditModal,
  selectEditViewData,
  selectAddressValidation,
  selectAddressValidationType,
  selectVAPServiceInitializationStatus,
  selectCopyAddressModal,
} from './profile/vap-svc/selectors';

import {
  VAP_SERVICE_CLEAR_LAST_SAVED,
  VAP_SERVICE_TRANSACTIONS_FETCH_SUCCESS,
  VAP_SERVICE_TRANSACTION_REQUESTED,
  VAP_SERVICE_TRANSACTION_REQUEST_FAILED,
  VAP_SERVICE_TRANSACTION_REQUEST_SUCCEEDED,
  VAP_SERVICE_TRANSACTION_REQUEST_CLEARED,
  VAP_SERVICE_TRANSACTION_UPDATE_REQUESTED,
  VAP_SERVICE_TRANSACTION_UPDATED,
  VAP_SERVICE_TRANSACTION_UPDATE_FAILED,
  VAP_SERVICE_TRANSACTION_CLEARED,
  ADDRESS_VALIDATION_CONFIRM,
  ADDRESS_VALIDATION_ERROR,
  ADDRESS_VALIDATION_RESET,
  ADDRESS_VALIDATION_INITIALIZE,
  ADDRESS_VALIDATION_UPDATE,
  fetchTransactions,
  clearMostRecentlySavedField,
  clearTransaction,
  clearTransactionRequest,
  refreshTransaction,
  createTransaction,
  validateAddress,
  updateValidationKeyAndSave,
  resetAddressValidation,
} from './profile/vap-svc/actions/transactions';
import {
  UPDATE_PROFILE_FORM_FIELD,
  OPEN_MODAL,
  UPDATE_SELECTED_ADDRESS,
  COPY_ADDRESS_MODAL,
  openModal,
  closeModal,
  updateCopyAddressModal,
  updateFormFieldWithSchema,
  updateSelectedAddress,
} from './profile/vap-svc/actions/ui';

import {
  getFormSchema,
  getUiSchema,
} from './profile/vap-svc/components/AddressField/address-schemas';
import AddressEditModal from './profile/vap-svc/components/AddressField/AddressEditModal';
import AddressField, {
  convertNextValueToCleanData,
  convertCleanDataToPayload,
} from './profile/vap-svc/components/AddressField/AddressField';
import AddressView from './profile/vap-svc/components/AddressField/AddressView';

import VAPServiceEditModal from './profile/vap-svc/components/base/VAPServiceEditModal';
import VAPServiceEditModalActionButtons from './profile/vap-svc/components/base/VAPServiceEditModalActionButtons';
import VAPServiceEditModalErrorMessage from './profile/vap-svc/components/base/VAPServiceEditModalErrorMessage';
import VAPServiceProfileFieldHeading from './profile/vap-svc/components/base/VAPServiceProfileFieldHeading';
import VAPServiceTransaction from './profile/vap-svc/components/base/VAPServiceTransaction';
import VAPServiceTransactionErrorBanner, {
  GenericUpdateError,
  VAProfileInitError,
  MVILookupFailError,
  MVIError,
} from './profile/vap-svc/components/base/VAPServiceTransactionErrorBanner';
import VAPServiceTransactionInlineErrorMessage from './profile/vap-svc/components/base/VAPServiceTransactionInlineErrorMessage';
import VAPServiceTransactionPending from './profile/vap-svc/components/base/VAPServiceTransactionPending';

import CannotEditModal from './profile/vap-svc/components/ContactInformationFieldInfo/CannotEditModal';
import ConfirmCancelModal from './profile/vap-svc/components/ContactInformationFieldInfo/ConfirmCancelModal';
import ConfirmRemoveModal from './profile/vap-svc/components/ContactInformationFieldInfo/ConfirmRemoveModal';
import ContactInformationUpdateSuccessAlert from './profile/vap-svc/components/ContactInformationFieldInfo/ContactInformationUpdateSuccessAlert';

import EmailEditModal from './profile/vap-svc/components/EmailField/EmailEditModal';
import EmailField from './profile/vap-svc/components/EmailField/EmailField';
import EmailView from './profile/vap-svc/components/EmailField/EmailView';

import PhoneEditModal from './profile/vap-svc/components/PhoneField/PhoneEditModal';
import PhoneField from './profile/vap-svc/components/PhoneField/PhoneField';
import PhoneView from './profile/vap-svc/components/PhoneField/PhoneView';

import ContactInfoForm from './profile/vap-svc/components/ContactInfoForm';
import Email from './profile/vap-svc/components/Email';
import FaxNumber from './profile/vap-svc/components/FaxNumber';
import HomePhone from './profile/vap-svc/components/HomePhone';
import MailingAddress from './profile/vap-svc/components/MailingAddress';
import MobilePhone from './profile/vap-svc/components/MobilePhone';
import ProfileInformationFieldController from './profile/vap-svc/components/ProfileInformationFieldController';
import ResidentialAddress from './profile/vap-svc/components/ResidentialAddress';
import WorkPhone from './profile/vap-svc/components/WorkPhone';

import {
  ADDRESS_VALIDATION_TYPES,
  ADDRESS_VALIDATION_MESSAGES,
  BAD_UNIT_NUMBER,
  MISSING_UNIT_NUMBER,
  CONFIRMED,
} from './profile/vap-svc/constants/addressValidationMessages';
import {
  MILITARY_STATES,
  ADDRESS_FORM_VALUES,
  ADDRESS_TYPES,
  ADDRESS_TYPES_ALTERNATE,
  ADDRESS_POU,
  ADDRESS_PROPS,
  USA,
  TRANSACTION_CATEGORY_TYPES,
  TRANSACTION_STATUS,
  INIT_VAP_SERVICE_ID,
  PERSONAL_INFO_FIELD_NAMES,
  FIELD_NAMES,
  FIELD_TITLES,
  FIELD_TITLE_DESCRIPTIONS,
  FIELD_IDS,
  PHONE_TYPE,
  ANALYTICS_FIELD_MAP,
  API_ROUTES,
  VAP_SERVICE_INITIALIZATION_STATUS,
  ACTIVE_EDIT_VIEWS,
  MISSING_CONTACT_INFO,
  COPY_ADDRESS_MODAL_STATUS,
} from './profile/vap-svc/constants/index';

import AddressValidationModal from './profile/vap-svc/containers/AddressValidationModal';
import AddressValidationView from './profile/vap-svc/containers/AddressValidationView';
import CopyMailingAddress from './profile/vap-svc/containers/CopyMailingAddress';
import InitializeVAPServiceID from './profile/vap-svc/containers/InitializeVAPServiceID';
import Vet360PendingTransactionCategory from './profile/vap-svc/containers/VAPServicePendingTransactionCategory';
import VAPServiceProfileField from './profile/vap-svc/containers/VAPServiceProfileField';
import VAPServiceTransactionReporter from './profile/vap-svc/containers/VAPServiceTransactionReporter';

import vapService from './profile/vap-svc/reducers/index';

import { getEditButtonId } from './profile/vap-svc/util/id-factory';
import {
  getValidationMessageKey,
  showAddressValidationModal,
  inferAddressType,
  areAddressesEqual,
} from './profile/vap-svc/util/index';
import localVAProfileService, {
  isVAProfileServiceConfigured,
  mockContactInformation,
  makeMockContactInfo,
} from './profile/vap-svc/util/local-vapsvc';
import {
  PENDING_STATUSES,
  SUCCESS_STATUSES,
  FAILURE_STATUSES,
  VA_PROFILE_INIT_ERROR_CODES,
  UPDATE_ERROR_CODES,
  MVI_NOT_FOUND_ERROR_CODES,
  MVI_ERROR_CODES,
  LOW_CONFIDENCE_ADDRESS_ERROR_CODES,
  DECEASED_ERROR_CODES,
  INVALID_EMAIL_ADDRESS_ERROR_CODES,
  INVALID_PHONE_ERROR_CODES,
  isPendingTransaction,
  isSuccessfulTransaction,
  isFailedTransaction,
  hasGenericUpdateError,
  hasMVINotFoundError,
  hasVAProfileInitError,
  hasMVIError,
  hasUserIsDeceasedError,
} from './profile/vap-svc/util/transactions';

export default {
  selectUser,
  isLoggedIn,
  selectProfile,
  isVAPatient,
  selectVeteranStatus,
  isInMPI,
  isNotInMPI,
  hasMPIConnectionError,
  isProfileLoading,
  isLOA3,
  isLOA1,
  isMultifactorEnabled,
  selectAvailableServices,
  selectPatientFacilities,
  selectCernerFacilitiesDsot,
  selectCernerFacilityIdsDsot,
  selectPatientFacilitiesDsot,
  selectPatientCernerFacilitiesDsot,
  selectVAPContactInfo,
  hasVAPServiceConnectionError,
  selectVAPEmailAddress,
  selectVAPMobilePhone,
  selectVAPMobilePhoneString,
  selectVAPHomePhone,
  selectVAPHomePhoneString,
  selectVAPResidentialAddress,
  selectVAPMailingAddress,
  createIsServiceAvailableSelector,
  selectIsCernerOnlyPatient,
  selectIsCernerOnlyPatientDsot,
  selectIsCernerPatient,
  selectIsCernerPatientDsot,
  selectCernerRxFacilities,
  selectCernerMessagingFacilities,
  selectCernerAppointmentsFacilities,
  selectCernerMedicalRecordsFacilities,
  selectCernerTestResultsFacilities,
  mhvTransitionEnabled,
  mhvTransitionModalEnabled,
  shouldRedirectToMyVA,
  LOG_OUT,
  UPDATE_LOGGEDIN_STATUS,
  CHECK_KEEP_ALIVE,
  updateLoggedInStatus,
  logOut,
  checkKeepAlive,
  AccountTransitionModal,
  TransitionSuccessModal,
  AccountLink,
  downtimeBannersConfig,
  DowntimeBanner,
  FedWarning,
  IDMeSVG,
  LoginActions,
  loginHandler,
  LoginButton,
  logoSrc,
  LoginContainer,
  LoginGovSVG,
  LoginHeader,
  LoginInfo,
  LogoutAlert,
  ServiceProvidersList,
  ServiceProvidersTextCreateAcct,
  ServiceProviders,
  SessionTimeoutModal,
  SignInModal,
  defaultSignInProviders,
  defaultSignUpProviders,
  defaultMobileQueryParams,
  defaultMobileOAuthOptions,
  defaultWebOAuthOptions,
  DEV,
  STAGING,
  PROD,
  loginStuff,
  API_VERSION,
  SIS_API_VERSION,
  API_SESSION_URL,
  API_SIGN_IN_SERVICE_URL,
  AUTH_EVENTS,
  SERVICE_PROVIDERS,
  CSP_IDS,
  AUTHN_SETTINGS,
  EXTERNAL_APPS,
  EBENEFITS_DEFAULT_PATH,
  eAuthURL,
  EXTERNAL_REDIRECTS,
  GA,
  IDME_TYPES,
  POLICY_TYPES,
  SIGNUP_TYPES,
  CSP_CONTENT,
  AUTH_LEVEL,
  AUTH_ERROR,
  MHV_TRANSITION_DATE,
  MHV_TRANSITION_TIME,
  ACCOUNT_TRANSITION_DISMISSED,
  LINK_TYPES,
  AUTH_PARAMS,
  hasCheckedKeepAlive,
  signInServiceName,
  isAuthenticatedWithSSOe,
  ssoeTransactionId,
  transitionMHVAccount,
  externalApplicationsConfig,
  loginAppUrlRE,
  getQueryParams,
  reduceAllowedProviders,
  isExternalRedirect,
  sanitizeUrl,
  sanitizePath,
  generateReturnURL,
  createExternalApplicationUrl,
  getGAClientId,
  createAndStoreReturnUrl,
  sessionTypeUrl,
  setSentryLoginType,
  clearSentryLoginType,
  redirect,
  login,
  mfa,
  verify,
  logout,
  signup,
  signupUrl,
  logoutUrl,
  AcceptTermsPrompt,
  RequiredLoginView,
  RequiredLoginLoader,
  MHVApp,
  RequiredTermsAcceptanceView,
  UPDATE_PROFILE_FIELDS,
  PROFILE_LOADING_FINISHED,
  REMOVING_SAVED_FORM,
  REMOVING_SAVED_FORM_SUCCESS,
  REMOVING_SAVED_FORM_FAILURE,
  updateProfileFields,
  profileLoadingFinished,
  refreshProfile,
  initializeProfile,
  removingSavedForm,
  removingSavedFormSuccess,
  removingSavedFormFailure,
  removeSavedForm,
  FETCHING_MHV_ACCOUNT,
  FETCH_MHV_ACCOUNT_FAILURE,
  FETCH_MHV_ACCOUNT_SUCCESS,
  CREATING_MHV_ACCOUNT,
  CREATE_MHV_ACCOUNT_FAILURE,
  CREATE_MHV_ACCOUNT_SUCCESS,
  UPGRADING_MHV_ACCOUNT,
  UPGRADE_MHV_ACCOUNT_FAILURE,
  UPGRADE_MHV_ACCOUNT_SUCCESS,
  fetchMHVAccount,
  createMHVAccount,
  upgradeMHVAccount,
  createAndUpgradeMHVAccount,
  backendServices,
  profileInformation,
  mapRawUserDataToState,
  hasSession,
  hasSessionSSO,
  setupProfileSession,
  teardownProfileSession,
  selectIsVAProfileServiceAvailableForUser,
  selectVAPContactInfoField,
  selectVAPServiceTransaction,
  selectVAPServiceFailedTransactions,
  selectMostRecentlyUpdatedField,
  selectVAPServicePendingCategoryTransactions,
  selectEditedFormField,
  selectCurrentlyOpenEditModal,
  selectEditViewData,
  selectAddressValidation,
  selectAddressValidationType,
  selectVAPServiceInitializationStatus,
  selectCopyAddressModal,
  VAP_SERVICE_CLEAR_LAST_SAVED,
  VAP_SERVICE_TRANSACTIONS_FETCH_SUCCESS,
  VAP_SERVICE_TRANSACTION_REQUESTED,
  VAP_SERVICE_TRANSACTION_REQUEST_FAILED,
  VAP_SERVICE_TRANSACTION_REQUEST_SUCCEEDED,
  VAP_SERVICE_TRANSACTION_REQUEST_CLEARED,
  VAP_SERVICE_TRANSACTION_UPDATE_REQUESTED,
  VAP_SERVICE_TRANSACTION_UPDATED,
  VAP_SERVICE_TRANSACTION_UPDATE_FAILED,
  VAP_SERVICE_TRANSACTION_CLEARED,
  ADDRESS_VALIDATION_CONFIRM,
  ADDRESS_VALIDATION_ERROR,
  ADDRESS_VALIDATION_RESET,
  ADDRESS_VALIDATION_INITIALIZE,
  ADDRESS_VALIDATION_UPDATE,
  fetchTransactions,
  clearMostRecentlySavedField,
  clearTransaction,
  clearTransactionRequest,
  refreshTransaction,
  createTransaction,
  validateAddress,
  updateValidationKeyAndSave,
  resetAddressValidation,
  UPDATE_PROFILE_FORM_FIELD,
  OPEN_MODAL,
  UPDATE_SELECTED_ADDRESS,
  COPY_ADDRESS_MODAL,
  openModal,
  closeModal,
  updateCopyAddressModal,
  updateFormFieldWithSchema,
  updateSelectedAddress,
  getFormSchema,
  getUiSchema,
  AddressEditModal,
  convertNextValueToCleanData,
  convertCleanDataToPayload,
  AddressField,
  AddressView,
  VAPServiceEditModal,
  VAPServiceEditModalActionButtons,
  VAPServiceEditModalErrorMessage,
  VAPServiceProfileFieldHeading,
  VAPServiceTransaction,
  GenericUpdateError,
  VAProfileInitError,
  MVILookupFailError,
  MVIError,
  VAPServiceTransactionErrorBanner,
  VAPServiceTransactionInlineErrorMessage,
  VAPServiceTransactionPending,
  CannotEditModal,
  ConfirmCancelModal,
  ConfirmRemoveModal,
  ContactInformationUpdateSuccessAlert,
  EmailEditModal,
  EmailField,
  EmailView,
  PhoneEditModal,
  PhoneField,
  PhoneView,
  ContactInfoForm,
  Email,
  FaxNumber,
  HomePhone,
  MailingAddress,
  MobilePhone,
  ProfileInformationFieldController,
  ResidentialAddress,
  WorkPhone,
  ADDRESS_VALIDATION_TYPES,
  ADDRESS_VALIDATION_MESSAGES,
  BAD_UNIT_NUMBER,
  MISSING_UNIT_NUMBER,
  CONFIRMED,
  MILITARY_STATES,
  ADDRESS_FORM_VALUES,
  ADDRESS_TYPES,
  ADDRESS_TYPES_ALTERNATE,
  ADDRESS_POU,
  ADDRESS_PROPS,
  USA,
  TRANSACTION_CATEGORY_TYPES,
  TRANSACTION_STATUS,
  INIT_VAP_SERVICE_ID,
  PERSONAL_INFO_FIELD_NAMES,
  FIELD_NAMES,
  FIELD_TITLES,
  FIELD_TITLE_DESCRIPTIONS,
  FIELD_IDS,
  PHONE_TYPE,
  ANALYTICS_FIELD_MAP,
  API_ROUTES,
  VAP_SERVICE_INITIALIZATION_STATUS,
  ACTIVE_EDIT_VIEWS,
  MISSING_CONTACT_INFO,
  COPY_ADDRESS_MODAL_STATUS,
  AddressValidationModal,
  AddressValidationView,
  CopyMailingAddress,
  InitializeVAPServiceID,
  Vet360PendingTransactionCategory,
  VAPServiceProfileField,
  VAPServiceTransactionReporter,
  vapService,
  getEditButtonId,
  getValidationMessageKey,
  showAddressValidationModal,
  inferAddressType,
  areAddressesEqual,
  isVAProfileServiceConfigured,
  mockContactInformation,
  makeMockContactInfo,
  localVAProfileService,
  PENDING_STATUSES,
  SUCCESS_STATUSES,
  FAILURE_STATUSES,
  VA_PROFILE_INIT_ERROR_CODES,
  UPDATE_ERROR_CODES,
  MVI_NOT_FOUND_ERROR_CODES,
  MVI_ERROR_CODES,
  LOW_CONFIDENCE_ADDRESS_ERROR_CODES,
  DECEASED_ERROR_CODES,
  INVALID_EMAIL_ADDRESS_ERROR_CODES,
  INVALID_PHONE_ERROR_CODES,
  isPendingTransaction,
  isSuccessfulTransaction,
  isFailedTransaction,
  hasGenericUpdateError,
  hasMVINotFoundError,
  hasVAProfileInitError,
  hasMVIError,
  hasUserIsDeceasedError,
};
