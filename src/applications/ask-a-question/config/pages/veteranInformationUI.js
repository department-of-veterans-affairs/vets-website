import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  claimNumberTitle,
  serviceNumberTitle,
  socialSecurityNumberTitle,
  dateOfBirthTitle,
  serviceStartDateTitle,
  serviceEndDateTitle,
} from '../../content/labels';

const formFields = {
  dateOfBirth: 'dateOfBirth',
  socialSecurityNumber: 'socialSecurityNumber',
  serviceNumber: 'serviceNumber',
  claimNumber: 'claimNumber',
  serviceStartDate: 'serviceStartDate',
  serviceEndDate: 'serviceEndDate',
};

export const veteranInformationUI = {
  [formFields.dateOfBirth]: {
    ...currentOrPastDateUI(dateOfBirthTitle),
  },
  [formFields.socialSecurityNumber]: {
    'ui:title': socialSecurityNumberTitle,
  },
  [formFields.serviceNumber]: {
    'ui:title': serviceNumberTitle,
  },
  [formFields.claimNumber]: {
    'ui:title': claimNumberTitle,
  },
  [formFields.serviceStartDate]: {
    ...currentOrPastDateUI(serviceStartDateTitle),
  },
  [formFields.serviceEndDate]: {
    ...currentOrPastDateUI(serviceEndDateTitle),
  },
};
