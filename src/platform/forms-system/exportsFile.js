import AddressViewField from './src/js/components/AddressViewField';

import FormNavButtons from './src/js/components/FormNavButtons';

import FormTitle from './src/js/components/FormTitle';

import ProgressButton from './src/js/components/ProgressButton';

import ReviewCardField from './src/js/components/ReviewCardField';

import SchemaForm from './src/js/components/SchemaForm';

import {
  directDepositDescription,
  directDepositAlert,
  bankInfoHelpText,
} from './src/js/definitions/content/directDeposit';

import {
  stateRequiredCountries,
  schema,
  uiSchema,
} from './src/js/definitions/address';

import {
  schema as autosuggestSchema,
  uiSchema as autosuggestUiSchema,
} from './src/js/definitions/autosuggest';

import confirmationEmail from './src/js/definitions/confirmationEmail';

import currency from './src/js/definitions/currency';

import currentOrPastDate from './src/js/definitions/currentOrPastDate';

import currentOrPastMonthYear from './src/js/definitions/currentOrPastMonthYear';

import date from './src/js/definitions/date';

import dateRange from './src/js/definitions/dateRange';

import directDeposit, {
  defaultFieldNames,
  prefillBankInformation,
} from './src/js/definitions/directDeposit';

import email from './src/js/definitions/email';

import fileUiSchema, { fileSchema } from './src/js/definitions/file';

import fullName from './src/js/definitions/fullName';

import monthYear from './src/js/definitions/monthYear';

import monthYearRange from './src/js/definitions/monthYearRange';

import phone from './src/js/definitions/phone';

import profileAddres from './src/js/definitions/profileAddress';

import ssn from './src/js/definitions/ssn';

import year from './src/js/definitions/year';

import FullNameField from './src/js/fields/FullNameField';

import ObjectField from './src/js/fields/ObjectField';

import ReviewPhoneNumberWidget from './src/js/review/PhoneNumberWidget';

import ReviewChapters, {
  mapStateToProps,
} from './src/js/review/ReviewChapters';

import SubmitController from './src/js/review/SubmitController';

import {
  updateRequiredFields,
  isContentExpanded,
  setHiddenFields,
  removeHiddenData,
  updateSchemaFromUiSchema,
  updateUiSchema,
  replaceRefSchemas,
  updateItemsSchema,
  updateSchemaAndData,
  recalculateSchemaAndData,
  createInitialState,
} from './src/js/state/helpers';

import reducers from './src/js/state/reducers';

import {
  getFormData,
  getFormPages,
  getSubmission,
  getReviewPageOpenChapters,
  getViewedPages,
} from './src/js/state/selectors';

import numberToWords from './src/js/utilities/data/numberToWords';

import findDuplicateIndexes from './src/js/utilities/data/findDuplicateIndexes';

import get from './src/js/utilities/data/get';

import set from './src/js/utilities/data/set';

import {
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  arrayIncludesArray,
  fileTypeSignatures,
  FILE_TYPE_MISMATCH_ERROR,
  checkIsEncryptedPdf,
  ShowPdfPassword,
  PasswordLabel,
  PasswordSuccess,
} from './src/js/utilities/file';

import maskString, { srSubstitute } from './src/js/utilities/ui/mask-string';

import {
  $,
  focusElement,
  getFocusableElements,
  scrollElementName,
  focusOnChange,
  scrollToElement,
  setGlobalScroll,
  scrollToFirstError,
} from './src/js/utilities/ui/index';

import {
  isValidSSN,
  isValidYear,
  isValidPartialDate,
  isValidCurrentOrPastDate,
  isValidCurrentOrFutureDate,
  isValidCurrentOrPastYear,
  isValidCurrentOrFutureMonthYear,
  dateToMoment,
  isValidDateRange,
  isValidRoutingNumber,
} from './src/js/utilities/validations/index';

import fuzzyMatching from './src/js/utilities/fuzzy-matching';

import {
  inProgressMessage,
  expiredMessage,
  savedMessage,
} from './src/js/utilities/save-in-progress-messages';

import viewifyFields from './src/js/utilities/viewify-fields';

import PhoneNumberWidget from './src/js/widgets/PhoneNumberWidget';

import TextWidget from './src/js/widgets/TextWidget';

import ArrayCountWidget from './src/js/widgets/ArrayCountWidget';

import {
  closeReviewChapter,
  openReviewChapter,
  setData,
  setEditMode,
  setSubmission,
  setPreSubmit,
  setSubmitted,
  setViewedPages,
  setFormErrors,
} from './src/js/actions';

import {
  START_NEW_APP_DEFAULT_MESSAGE,
  CONTINUE_APP_DEFAULT_MESSAGE,
  APP_SAVED_SUCCESSFULLY_DEFAULT_MESSAGE,
  FINISH_APP_LATER_DEFAULT_MESSAGE,
  UNAUTH_SIGN_IN_DEFAULT_MESSAGE,
  APP_TYPE_DEFAULT,
  APP_ACTION_DEFAULT,
  REVIEW_APP_DEFAULT_MESSAGE,
  FILE_UPLOAD_NETWORK_ERROR_MESSAGE,
  accountTitleLabels,
} from './src/js/constants';

import {
  minYear,
  maxYear,
  isActivePage,
  getActiveProperties,
  getInactivePages,
  createFormPageList,
  createPageListByChapter,
  createPageList,
  formatISOPartialDate,
  formatReviewDate,
  parseISODate,
  filterViewFields,
  filterInactivePageData,
  stringifyFormReplacer,
  isInProgress,
  getArrayFields,
  hasFieldsOtherThanArray,
  getNonArraySchema,
  pureWithDeepEquals,
  checkValidSchema,
  setArrayRecordTouched,
  createUSAStateLabels,
  expandArrayPages,
  getActiveExpandedPages,
  getPageKeys,
  getActiveChapters,
  omitRequired,
  transformForSubmit,
  showReviewField,
} from './src/js/helpers';

import {
  getEligiblePages,
  getNextPagePath,
  getPreviousPagePath,
  checkValidPagePath,
  createRoutes,
} from './src/js/routing';

import {
  transformErrors,
  uiSchemaValidate,
  errorSchemaIsValid,
  isValidForm,
  validateSSN,
  validateDate,
  validateMonthYear,
  validateCurrentOrPastDate,
  validateCurrentOrFutureDate,
  validateCurrentOrPastMonthYear,
  validateFutureDateIfExpectedGrad,
  validateCurrentOrPastYear,
  validateMatch,
  validateRoutingNumber,
  convertToDateField,
  validateDateRange,
  validateDateRangeAllowSameMonth,
  getFileError,
  validateFileField,
  validateBooleanGroup,
  validateAutosuggestOption,
} from './src/js/validation';

export {
  AddressViewField,
  FormNavButtons,
  FormTitle,
  ProgressButton,
  ReviewCardField,
  SchemaForm,
  directDepositDescription,
  directDepositAlert,
  bankInfoHelpText,
  stateRequiredCountries,
  schema,
  uiSchema,
  autosuggestSchema,
  autosuggestUiSchema,
  confirmationEmail,
  currency,
  currentOrPastDate,
  currentOrPastMonthYear,
  date,
  dateRange,
  directDeposit,
  defaultFieldNames,
  prefillBankInformation,
  email,
  fileUiSchema,
  fileSchema,
  fullName,
  monthYear,
  monthYearRange,
  phone,
  profileAddres,
  ssn,
  year,
  FullNameField,
  ObjectField,
  ReviewPhoneNumberWidget,
  ReviewChapters,
  mapStateToProps,
  SubmitController,
  updateRequiredFields,
  isContentExpanded,
  setHiddenFields,
  removeHiddenData,
  updateSchemaFromUiSchema,
  updateUiSchema,
  replaceRefSchemas,
  updateItemsSchema,
  updateSchemaAndData,
  recalculateSchemaAndData,
  createInitialState,
  reducers,
  getFormData,
  getFormPages,
  getSubmission,
  getReviewPageOpenChapters,
  getViewedPages,
  numberToWords,
  findDuplicateIndexes,
  get,
  set,
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  arrayIncludesArray,
  fileTypeSignatures,
  FILE_TYPE_MISMATCH_ERROR,
  checkIsEncryptedPdf,
  ShowPdfPassword,
  PasswordLabel,
  PasswordSuccess,
  maskString,
  srSubstitute,
  $,
  focusElement,
  getFocusableElements,
  scrollElementName,
  focusOnChange,
  scrollToElement,
  setGlobalScroll,
  scrollToFirstError,
  isValidSSN,
  isValidYear,
  isValidPartialDate,
  isValidCurrentOrPastDate,
  isValidCurrentOrFutureDate,
  isValidCurrentOrPastYear,
  isValidCurrentOrFutureMonthYear,
  dateToMoment,
  isValidDateRange,
  isValidRoutingNumber,
  fuzzyMatching,
  inProgressMessage,
  expiredMessage,
  savedMessage,
  viewifyFields,
  PhoneNumberWidget,
  TextWidget,
  ArrayCountWidget,
  closeReviewChapter,
  openReviewChapter,
  setData,
  setEditMode,
  setSubmission,
  setPreSubmit,
  setSubmitted,
  setViewedPages,
  setFormErrors,
  START_NEW_APP_DEFAULT_MESSAGE,
  CONTINUE_APP_DEFAULT_MESSAGE,
  APP_SAVED_SUCCESSFULLY_DEFAULT_MESSAGE,
  FINISH_APP_LATER_DEFAULT_MESSAGE,
  UNAUTH_SIGN_IN_DEFAULT_MESSAGE,
  APP_TYPE_DEFAULT,
  APP_ACTION_DEFAULT,
  REVIEW_APP_DEFAULT_MESSAGE,
  FILE_UPLOAD_NETWORK_ERROR_MESSAGE,
  accountTitleLabels,
  minYear,
  maxYear,
  isActivePage,
  getActiveProperties,
  getInactivePages,
  createFormPageList,
  createPageListByChapter,
  createPageList,
  formatISOPartialDate,
  formatReviewDate,
  parseISODate,
  filterViewFields,
  filterInactivePageData,
  stringifyFormReplacer,
  isInProgress,
  getArrayFields,
  hasFieldsOtherThanArray,
  getNonArraySchema,
  pureWithDeepEquals,
  checkValidSchema,
  setArrayRecordTouched,
  createUSAStateLabels,
  expandArrayPages,
  getActiveExpandedPages,
  getPageKeys,
  getActiveChapters,
  omitRequired,
  transformForSubmit,
  showReviewField,
  getEligiblePages,
  getNextPagePath,
  getPreviousPagePath,
  checkValidPagePath,
  createRoutes,
  transformErrors,
  uiSchemaValidate,
  errorSchemaIsValid,
  isValidForm,
  validateSSN,
  validateDate,
  validateMonthYear,
  validateCurrentOrPastDate,
  validateCurrentOrFutureDate,
  validateCurrentOrPastMonthYear,
  validateFutureDateIfExpectedGrad,
  validateCurrentOrPastYear,
  validateMatch,
  validateRoutingNumber,
  convertToDateField,
  validateDateRange,
  validateDateRangeAllowSameMonth,
  getFileError,
  validateFileField,
  validateBooleanGroup,
  validateAutosuggestOption,
};
