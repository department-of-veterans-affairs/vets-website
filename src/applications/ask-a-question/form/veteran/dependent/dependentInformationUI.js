import {
  uiSchema,
  validateCity,
  validateStreet,
} from 'platform/forms/definitions/address';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import _ from 'lodash';
import {
  daytimePhoneAreaCodeTitle,
  dependentCountryError,
  dependentEmailError,
  dependentFirstName,
  dependentFirstNameError,
  dependentLastName,
  dependentLastNameError,
  dependentRelationshipToVeteran,
  dependentRelationshipToVeteranError,
  dependentEmail,
  streetAddress,
  zipCodeTitle,
} from '../../../constants/labels';

const formFields = {
  relationshipToVeteran: 'relationshipToVeteran',
  first: 'first',
  last: 'last',
  address: 'address',
  phone: 'phone',
  email: 'email',
};

export const dependentInformationUI = dependentInformationDisplayed => ({
  [formFields.relationshipToVeteran]: {
    'ui:title': dependentRelationshipToVeteran,
    'ui:required': dependentInformationDisplayed,
    'ui:errorMessages': {
      required: dependentRelationshipToVeteranError,
    },
  },
  [formFields.first]: {
    'ui:title': dependentFirstName,
    'ui:required': dependentInformationDisplayed,
    'ui:errorMessages': {
      required: dependentFirstNameError,
    },
  },
  [formFields.last]: {
    'ui:title': dependentLastName,
    'ui:required': dependentInformationDisplayed,
    'ui:errorMessages': {
      required: dependentLastNameError,
    },
  },
  [formFields.address]: _.merge(uiSchema('', false, null, true), {
    'ui:order': ['country', 'street', 'street2', 'city', 'state', 'postalCode'],
    'ui:validations': [validateStreet, validateCity],
    street: {
      'ui:title': streetAddress,
    },
    country: {
      'ui:required': formData => {
        return dependentInformationDisplayed(formData);
      },
      'ui:errorMessages': {
        required: dependentCountryError,
      },
    },
    street2: {
      'ui:options': {
        hideIf: () => true,
      },
    },
    postalCode: {
      'ui:title': zipCodeTitle,
    },
  }),
  [formFields.phone]: phoneUI(daytimePhoneAreaCodeTitle),
  [formFields.email]: _.merge(emailUI(dependentEmail), {
    'ui:required': formData => dependentInformationDisplayed(formData),
    'ui:errorMessages': {
      required: dependentEmailError,
    },
  }),
});
