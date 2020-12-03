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
  branchOfServiceTitle,
} from '../../../constants/labels';
import { requireServiceInfo } from '../../inquiry/status/veteranStatusUI';

const formFields = {
  dateOfBirth: 'dateOfBirth',
  socialSecurityNumber: 'socialSecurityNumber',
  serviceNumber: 'serviceNumber',
  claimNumber: 'claimNumber',
  branchOfService: 'branchOfService',
  serviceDateRange: 'serviceDateRange',
};

export const veteranServiceInformationUI = {
  'ui:order': [
    'socialSecurityNumber',
    'dateOfBirth',
    'serviceNumber',
    'claimNumber',
    'branchOfService',
    'serviceDateRange',
  ],
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
  [formFields.branchOfService]: {
    'ui:title': branchOfServiceTitle,
    'ui:required': formData =>
      requireServiceInfo(formData.veteranStatus.veteranStatus),
    'ui:errorMessages': {
      required: "Please enter the Veteran's branch of service",
    },
  },
  [formFields.dateOfBirth]: {
    ...currentOrPastDateUI(dateOfBirthTitle),
  },
  [formFields.serviceDateRange]: dateRangeUI(
    serviceStartDateTitle,
    serviceEndDateTitle,
    serviceDateRangeErrorMessage,
  ),
};
