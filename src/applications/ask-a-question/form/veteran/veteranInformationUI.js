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
  veteranEmail,
  streetAddress,
  veteranCountryError,
  veteranEmailError,
  veteranFirstNameError,
  veteranLastNameError,
  veteransFirstName,
  veteransLastName,
  zipCodeTitle,
} from '../../constants/labels';

const formFields = {
  first: 'first',
  last: 'last',
  address: 'address',
  phone: 'phone',
  email: 'email',
};

const veteranIsDeceased = formData => {
  return (
    formData.veteranStatus.veteranIsDeceased !== undefined &&
    formData.veteranStatus.veteranIsDeceased
  );
};

const veteranIsAlive = formData => {
  return !veteranIsDeceased(formData);
};

export const veteranInformationUI = requireIfDisplayed => ({
  [formFields.first]: {
    'ui:title': veteransFirstName,
    'ui:required': requireIfDisplayed,
    'ui:errorMessages': {
      required: veteranFirstNameError,
    },
  },
  [formFields.last]: {
    'ui:title': veteransLastName,
    'ui:required': requireIfDisplayed,
    'ui:errorMessages': {
      required: veteranLastNameError,
    },
  },
  [formFields.address]: _.merge(uiSchema('', false, null, true), {
    'ui:order': ['country', 'street', 'street2', 'city', 'state', 'postalCode'],
    'ui:validations': [validateStreet, validateCity],
    'ui:options': {
      hideIf: formData => veteranIsDeceased(formData),
    },
    street: {
      'ui:title': streetAddress,
    },
    country: {
      'ui:required': formData =>
        requireIfDisplayed(formData) && veteranIsAlive(formData),
      'ui:errorMessages': {
        required: veteranCountryError,
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
  [formFields.phone]: _.merge(phoneUI(daytimePhoneAreaCodeTitle), {
    'ui:options': {
      hideIf: formData => veteranIsDeceased(formData),
    },
  }),
  [formFields.email]: _.merge(emailUI(veteranEmail), {
    'ui:required': formData =>
      requireIfDisplayed(formData) && veteranIsAlive(formData),
    'ui:options': {
      hideIf: formData => veteranIsDeceased(formData),
    },
    'ui:errorMessages': {
      required: veteranEmailError,
    },
  }),
});
