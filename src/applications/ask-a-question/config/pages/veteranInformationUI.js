import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

import {
  claimNumberTitle,
  claimNumberPatternErrorMessage,
  serviceNumberTitle,
  serviceNumberPatternErrorMessage,
  socialSecurityNumberTitle,
  dateOfBirthTitle,
  serviceStartDateTitle,
  serviceEndDateTitle,
  serviceDateRangeErrorMessage,
} from '../../content/labels';

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
    ...ssnUI,
    'ui:title': socialSecurityNumberTitle,
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
