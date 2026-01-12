import {
  isServerError,
  isClientError,
  getData,
  checkAddingDependentsNot674ForPension,
  checkAdding674ForPension,
  showPensionBackupPath,
  isVetInReceiptOfPension,
  showPensionRelatedQuestions,
  show674IncomeQuestions,
  shouldShowStudentIncomeQuestions,
} from './api';
import { customFormReplacer } from './formDataCleaning';
import { parseDateToDateObj } from './dateUtils';
import { spouseEvidence, childEvidence } from './evidenceRequirements';
import {
  showDupeModalIfEnabled,
  isAddingDependents,
  isRemovingDependents,
  showV3Picklist,
  noV3Picklist,
  showOptionsSelection,
  hasAwardedDependents,
  isVisiblePicklistPage,
  hasSelectedPicklistItems,
} from './featureFlags';
import { buildSubmissionData } from './submissionDataBuilder';
import { customTransformForSubmit } from './submissionPipeline';

export {
  // api
  isServerError,
  isClientError,
  getData,
  checkAddingDependentsNot674ForPension,
  checkAdding674ForPension,
  showPensionBackupPath,
  isVetInReceiptOfPension,
  showPensionRelatedQuestions,
  show674IncomeQuestions,
  shouldShowStudentIncomeQuestions,
  // data
  customFormReplacer,
  buildSubmissionData,
  customTransformForSubmit,
  parseDateToDateObj,
  spouseEvidence,
  childEvidence,
  showDupeModalIfEnabled,
  isAddingDependents,
  isRemovingDependents,
  showV3Picklist,
  noV3Picklist,
  showOptionsSelection,
  hasAwardedDependents,
  isVisiblePicklistPage,
  hasSelectedPicklistItems,
};
