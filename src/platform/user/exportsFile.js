export {
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
  mhvTransitionModalEnabled,
} from './selectors';

/* authentication */
export {
  LOG_OUT,
  UPDATE_LOGGEDIN_STATUS,
  CHECK_KEEP_ALIVE,
  updateLoggedInStatus,
  logOut,
  checkKeepAlive,
} from './authentication/actions';

export {
  useIdentityVerificationURL,
  onVerifyClick,
} from './authentication/hooks/index';

export {
  VerifyIdmeButton,
  VerifyLogingovButton,
  VerifyButton,
} from './authentication/components/VerifyButton';
export {
  default as CreateAccountLink,
} from './authentication/components/CreateAccountLink';
export {
  default as VerifyAccountLink,
} from './authentication/components/VerifyAccountLink';
export {
  default as DowntimeBanners,
} from './authentication/components/DowntimeBanner';
export {
  default as LoginActions,
} from './authentication/components/LoginActions';
export {
  default as LoginButton,
  loginHandler,
} from './authentication/components/LoginButton';
export {
  logoSrc,
  default as LoginContainer,
} from './authentication/components/LoginContainer';
export {
  default as LoginHeader,
} from './authentication/components/LoginHeader';
export { default as LoginInfo } from './authentication/components/LoginInfo';
export {
  default as ServiceProvidersList,
} from './authentication/components/ServiceProvidersList';
export {
  default as ServiceProviders,
  ServiceProvidersTextCreateAcct,
} from './authentication/components/ServiceProvidersText';
export {
  default as SessionTimeoutModal,
} from './authentication/components/SessionTimeoutModal';
export {
  default as SignInModal,
} from './authentication/components/SignInModal';

export {
  defaultSignInProviders,
  defaultMobileQueryParams,
  defaultMobileOAuthOptions,
  defaultWebOAuthOptions,
  ial2DefaultWebOAuthOptions,
} from './authentication/config/constants';
export { default as DEV } from './authentication/config/dev.config';
export { default as STAGING } from './authentication/config/staging.config';
export { default as PROD } from './authentication/config/prod.config';

export { default as loginStuff } from './authentication/reducers/index';

export {
  API_VERSION,
  API_SESSION_URL,
  AUTH_EVENTS,
  SERVICE_PROVIDERS,
  CSP_IDS,
  AUTHN_SETTINGS,
  EXTERNAL_APPS,
  eAuthURL,
  EXTERNAL_REDIRECTS,
  GA,
  IDME_TYPES,
  POLICY_TYPES,
  SIGNUP_TYPES,
  LINK_TYPES,
  AUTH_PARAMS,
} from './authentication/constants';
export { AUTH_LEVEL, AUTH_ERRORS } from './authentication/errors';
export {
  hasCheckedKeepAlive,
  signInServiceName,
  isAuthenticatedWithSSOe,
  isAuthenticatedWithOAuth,
  ssoeTransactionId,
} from './authentication/selectors';
export { externalApplicationsConfig } from './authentication/usip-config';
export { OAuthEnabledApplications } from './authentication/config/constants';
export {
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
  logout,
  signupOrVerify,
  logoutUrl,
} from './authentication/utilities';

/* authorization */
export {
  default as RequiredLoginView,
  RequiredLoginLoader,
} from './authorization/components/RequiredLoginView';
export { default as VerifyAlert } from './authorization/components/VerifyAlert';

/* profile */

export {
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
export {
  FETCHING_MHV_ACCOUNT,
  FETCH_MHV_ACCOUNT_FAILURE,
  FETCH_MHV_ACCOUNT_SUCCESS,
  fetchMHVAccount,
} from './profile/actions/mhv';

export {
  default as backendServices,
} from './profile/constants/backendServices';
export { default as profileInformation } from './profile/reducers/index';
export {
  mapRawUserDataToState,
  hasSession,
  hasSessionSSO,
  setupProfileSession,
  teardownProfileSession,
} from './profile/utilities/index';

/* vap-svc */

export {
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

export {
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
export {
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

export {
  getFormSchema,
  getUiSchema,
} from './profile/vap-svc/components/AddressField/address-schemas';
export {
  default as AddressField,
  convertNextValueToCleanData,
  convertCleanDataToPayload,
} from './profile/vap-svc/components/AddressField/AddressField';
export {
  default as AddressView,
} from './profile/vap-svc/components/AddressField/AddressView';

export {
  default as VAPServiceEditModalActionButtons,
} from './profile/vap-svc/components/base/VAPServiceEditModalActionButtons';
export {
  default as VAPServiceEditModalErrorMessage,
} from './profile/vap-svc/components/base/VAPServiceEditModalErrorMessage';
export {
  default as VAPServiceProfileFieldHeading,
} from './profile/vap-svc/components/base/VAPServiceProfileFieldHeading';
export {
  default as VAPServiceTransaction,
} from './profile/vap-svc/components/base/VAPServiceTransaction';
export {
  default as VAPServiceTransactionErrorBanner,
  GenericUpdateError,
  VAProfileInitError,
  MVILookupFailError,
  MVIError,
} from './profile/vap-svc/components/base/VAPServiceTransactionErrorBanner';
export {
  default as VAPServiceTransactionPending,
} from './profile/vap-svc/components/base/VAPServiceTransactionPending';

export {
  default as CannotEditModal,
} from './profile/vap-svc/components/ContactInformationFieldInfo/CannotEditModal';
export {
  default as ConfirmCancelModal,
} from './profile/vap-svc/components/ContactInformationFieldInfo/ConfirmCancelModal';
export {
  default as ConfirmRemoveModal,
} from './profile/vap-svc/components/ContactInformationFieldInfo/ConfirmRemoveModal';
export {
  default as ContactInformationUpdateSuccessAlert,
} from './profile/vap-svc/components/ContactInformationFieldInfo/ContactInformationUpdateSuccessAlert';

export {
  default as ContactInfoForm,
} from './profile/vap-svc/components/ContactInfoForm';
export {
  default as GenericErrorAlert,
} from './profile/vap-svc/components/GenericErrorAlert';

export {
  default as ProfileInformationFieldController,
} from './profile/vap-svc/components/ProfileInformationFieldController';
export {
  default as ResidentialAddress,
} from './profile/vap-svc/components/ResidentialAddress';

export {
  ADDRESS_VALIDATION_TYPES,
  ADDRESS_VALIDATION_MESSAGES,
  BAD_UNIT_NUMBER,
  MISSING_UNIT_NUMBER,
  CONFIRMED,
} from './profile/vap-svc/constants/addressValidationMessages';
export {
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

export {
  default as AddressValidationModal,
} from './profile/vap-svc/containers/AddressValidationModal';
export {
  default as AddressValidationView,
} from './profile/vap-svc/containers/AddressValidationView';
export {
  default as CopyMailingAddress,
} from './profile/vap-svc/containers/CopyMailingAddress';
export {
  default as InitializeVAPServiceID,
} from './profile/vap-svc/containers/InitializeVAPServiceID';
export {
  default as Vet360PendingTransactionCategory,
} from './profile/vap-svc/containers/VAPServicePendingTransactionCategory';

export {
  default as VAPServiceTransactionReporter,
} from './profile/vap-svc/containers/VAPServiceTransactionReporter';

export { default as vapService } from './profile/vap-svc/reducers/index';

export { getEditButtonId } from './profile/vap-svc/util/id-factory';
export {
  getValidationMessageKey,
  showAddressValidationModal,
  inferAddressType,
  areAddressesEqual,
} from './profile/vap-svc/util/index';
export {
  default as localVAProfileService,
  isVAProfileServiceConfigured,
  mockContactInformation,
  makeMockContactInfo,
} from './profile/vap-svc/util/local-vapsvc';
export {
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
