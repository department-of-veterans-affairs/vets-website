import dataImports from './address/data/index';

const { states, militaryStates, militaryCities } = dataImports;
import {
  militaryBranches,
  countryValues,
  countryLabels,
  states as statesLabels,
} from './address/data/labels';

import {
  ADDRESS_TYPES,
  isEmptyAddress,
  getStateName,
  formatAddress,
} from './address/helpers';
import {
  countries,
  states as usStates,
  isValidUSZipCode,
  isValidCanPostalCode,
} from './address/index';
import { isValidCentralMailPostalCode } from './address/validations';
import ErrorMessage from './components/common/alerts/ErrorMessage';
import { Column, Row } from './components/common/grid/index';
import BurialModalContent from './components/OMBInfoModalContent/BurialModalContent';
import EducationModalContent from './components/OMBInfoModalContent/EducationModalContent';
import HealthcareModalContent from './components/OMBInfoModalContent/HealthcareModalContent';
import ApplicantDescription from './components/ApplicantDescription';
import FormFooter from './components/FormFooter';
import GetPensionOrBurialFormHelp from './components/GetPensionOrBurialFormHelp';
import ServicePeriodView from './components/ServicePeriodView';
import {
  stateRequiredCountries,
  requireStateWithCountry,
  requireStateWithData,
  validateStreet,
  validateCity,
  schema as definitionsSchema,
  uiSchema as definitionsUiSchema,
} from './definitions/address';
import bankAccountUiSchema from './definitions/bankAccount';
import fullNameUiSchema, { validateName } from './definitions/fullName';
import nonMilitaryJobsUiSchema from './definitions/nonMilitaryJobs';
import nonRequiredFullName from './definitions/nonRequiredFullName';
import {
  schema as personIdSchema,
  uiSchema as personIdUiSchema,
} from './definitions/personId';
import Form from './formulate-integration/Form';
import ApplicationInformation from './pages/applicantInformation';
import {
  SET_SAVE_FORM_STATUS,
  SET_AUTO_SAVE_FORM_STATUS,
  SET_FETCH_FORM_STATUS,
  SET_FETCH_FORM_PENDING,
  SET_IN_PROGRESS_FORM,
  SET_START_OVER,
  SET_PREFILL_UNFILLED,
  SAVE_STATUSES,
  saveErrors,
  LOAD_STATUSES,
  PREFILL_STATUSES,
  setSaveFormStatus,
  setFetchFormStatus,
  setFetchFormPending,
  setInProgressForm,
  setStartOver,
  setPrefillComplete,
  migrateFormData,
  autoSaveForm,
  saveAndRedirectToReturnUrl,
  fetchInProgressForm,
  removeInProgressForm,
} from './save-in-progress/actions';

import {
  removeFormApi,
  saveFormApi,
  inProgressApi,
} from './save-in-progress/api';

import ApplicationStatus from './save-in-progress/ApplicationStatus';

import DowntimeMessage from './save-in-progress/DowntimeMessage';

import FormSaved from './save-in-progress/FormSaved';

import { createRoutesWithSaveInProgress } from './save-in-progress/helpers';

import MilitaryPrefillMessage from './save-in-progress/MilitaryPrefillMessage';
import PrefillMessage from './save-in-progress/PrefillMessage';

import {
  saveInProgressReducers,
  createSaveInProgressFormReducer,
  createSaveInProgressInitialState,
} from './save-in-progress/reducers';

import RoutedSavableApp from './save-in-progress/RoutedSavableApp';

import SaveFormLink from './save-in-progress/SaveInProgressIntro';

import SaveStatus from './save-in-progress/SaveStatus';

import {
  getSaveInProgressState,
  getIntroState,
  getFormContext,
} from './save-in-progress/selectors';

import {
  VA_FORM_IDS,
  VA_FORM_IDS_SKIP_INFLECTION,
  VA_FORM_IDS_IN_PROGRESS_FORMS_API,
} from './constants';

import { makeField, dirtyAllFields } from './fields';

import {
  getPageList,
  groupPagesIntoChapters,
  isInProgressPath,
  isActivePage,
  getActivePages,
  getInactivePages,
  getCurrentFormStep,
  getCurrentPageName,
} from './helpers';

import Subtask, {
  SUBTASK_SESSION_STORAGE,
  getStoredSubTask,
  setStoredSubTask,
  resetStoredSubTask,
} from './sub-task';

export {
  Subtask,
  SUBTASK_SESSION_STORAGE,
  getStoredSubTask,
  setStoredSubTask,
  resetStoredSubTask,
  states,
  militaryStates,
  militaryCities,
  militaryBranches,
  countryValues,
  countryLabels,
  statesLabels,
  ADDRESS_TYPES,
  isEmptyAddress,
  getStateName,
  formatAddress,
  countries,
  usStates,
  isValidUSZipCode,
  isValidCanPostalCode,
  isValidCentralMailPostalCode,
  ErrorMessage,
  Column,
  Row,
  BurialModalContent,
  EducationModalContent,
  HealthcareModalContent,
  ApplicantDescription,
  FormFooter,
  GetPensionOrBurialFormHelp,
  ServicePeriodView,
  stateRequiredCountries,
  requireStateWithCountry,
  requireStateWithData,
  validateStreet,
  validateCity,
  definitionsSchema,
  definitionsUiSchema,
  bankAccountUiSchema,
  validateName,
  fullNameUiSchema,
  nonMilitaryJobsUiSchema,
  nonRequiredFullName,
  personIdSchema,
  personIdUiSchema,
  Form,
  ApplicationInformation,
  SET_SAVE_FORM_STATUS,
  SET_AUTO_SAVE_FORM_STATUS,
  SET_FETCH_FORM_STATUS,
  SET_FETCH_FORM_PENDING,
  SET_IN_PROGRESS_FORM,
  SET_START_OVER,
  SET_PREFILL_UNFILLED,
  SAVE_STATUSES,
  saveErrors,
  LOAD_STATUSES,
  PREFILL_STATUSES,
  setSaveFormStatus,
  setFetchFormStatus,
  setFetchFormPending,
  setInProgressForm,
  setStartOver,
  setPrefillComplete,
  migrateFormData,
  autoSaveForm,
  saveAndRedirectToReturnUrl,
  fetchInProgressForm,
  removeInProgressForm,
  removeFormApi,
  saveFormApi,
  ApplicationStatus,
  DowntimeMessage,
  FormSaved,
  createRoutesWithSaveInProgress,
  MilitaryPrefillMessage,
  PrefillMessage,
  saveInProgressReducers,
  createSaveInProgressFormReducer,
  createSaveInProgressInitialState,
  RoutedSavableApp,
  SaveFormLink,
  SaveStatus,
  getSaveInProgressState,
  getIntroState,
  getFormContext,
  VA_FORM_IDS,
  VA_FORM_IDS_SKIP_INFLECTION,
  VA_FORM_IDS_IN_PROGRESS_FORMS_API,
  makeField,
  dirtyAllFields,
  inProgressApi,
  getPageList,
  groupPagesIntoChapters,
  isInProgressPath,
  isActivePage,
  getActivePages,
  getInactivePages,
  getCurrentFormStep,
  getCurrentPageName,
};
