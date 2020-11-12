import {
  uiSchema,
  validateCity,
  validateStreet,
} from 'platform/forms/definitions/address';
import SectionHeader from '../../../components/SectionHeader';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import _ from 'lodash';
import {
  daytimePhoneAreaCodeTitle,
  dependentInformationHeader,
  dependentRelationshipToVeteran,
  dependentFirstName,
  dependentLastName,
  emailTitle,
  streetAddress,
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
  'ui:description': SectionHeader(dependentInformationHeader),
  [formFields.relationshipToVeteran]: {
    'ui:title': dependentRelationshipToVeteran,
    'ui:required': dependentInformationDisplayed,
  },
  [formFields.first]: {
    'ui:title': dependentFirstName,
    'ui:required': dependentInformationDisplayed,
  },
  [formFields.last]: {
    'ui:title': dependentLastName,
    'ui:required': dependentInformationDisplayed,
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
    },
    street2: {
      'ui:options': {
        hideIf: () => true,
      },
    },
  }),
  [formFields.phone]: phoneUI(daytimePhoneAreaCodeTitle),
  [formFields.email]: _.merge(emailUI(emailTitle), {
    'ui:required': formData => dependentInformationDisplayed(formData),
  }),
});
