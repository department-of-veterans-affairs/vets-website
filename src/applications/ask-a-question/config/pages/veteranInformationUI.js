import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  claimNumberTitle,
  claimNumberPatternErrorMessage,
  serviceNumberTitle,
  serviceNumberPatternErrorMessage,
  socialSecurityNumberTitle,
  socialSecurityNumberPatternErrorMessage,
  dateOfBirthTitle,
  serviceStartDateTitle,
  serviceEndDateTitle,
  serviceDateRangeErrorMessage,
} from '../../content/labels';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';

const formFields = {
  dateOfBirth: 'dateOfBirth',
  socialSecurityNumber: 'socialSecurityNumber',
  serviceNumber: 'serviceNumber',
  claimNumber: 'claimNumber',
  serviceDateRange: 'serviceDateRange',
};

export const veteranInformationUI = {
  [formFields.dateOfBirth]: {
    ...currentOrPastDateUI(dateOfBirthTitle),
  },
  [formFields.socialSecurityNumber]: {
    'ui:title': socialSecurityNumberTitle,
    'ui:errorMessages': {
      pattern: socialSecurityNumberPatternErrorMessage,
    },
  },
  [formFields.serviceNumber]: {
    'ui:title': serviceNumberTitle,
    'ui:errorMessages': {
      pattern: serviceNumberPatternErrorMessage,
    },
  },
  [formFields.claimNumber]: {
    'ui:title': claimNumberTitle,
    'ui:errorMessages': {
      pattern: claimNumberPatternErrorMessage,
    },
  },
  [formFields.serviceDateRange]: dateRangeUI(
    serviceStartDateTitle,
    serviceEndDateTitle,
    serviceDateRangeErrorMessage,
  ),
};
