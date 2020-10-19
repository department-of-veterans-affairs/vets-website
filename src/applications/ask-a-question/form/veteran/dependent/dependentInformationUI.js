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
  dependentsFirstName,
  dependentsLastName,
  emailTitle,
  streetAddress,
} from '../../../constants/labels';

const formFields = {
  first: 'first',
  last: 'last',
  address: 'address',
  phone: 'phone',
  email: 'email',
};

export const dependentInformationUI = requireIfDisplayed => ({
  'ui:description': SectionHeader(dependentInformationHeader),
  [formFields.first]: {
    'ui:title': dependentsFirstName,
    'ui:required': requireIfDisplayed,
  },
  [formFields.last]: {
    'ui:title': dependentsLastName,
    'ui:required': requireIfDisplayed,
  },
  [formFields.address]: _.merge(uiSchema(''), {
    'ui:order': ['country', 'street', 'street2', 'city', 'state', 'postalCode'],
    'ui:validations': [validateStreet, validateCity],
    street: {
      'ui:title': streetAddress,
    },
    country: {
      'ui:required': formData => {
        return requireIfDisplayed(formData);
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
    'ui:required': formData => requireIfDisplayed(formData),
  }),
});
