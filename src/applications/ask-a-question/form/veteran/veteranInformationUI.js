import {
  stateRequiredCountries,
  uiSchema,
} from 'platform/forms/definitions/address';
import SectionHeader from '../../components/SectionHeader';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import _ from 'lodash';
import {
  daytimePhoneAreaCodeTitle,
  emailTitle,
  streetAddress,
  veteranInformationHeader,
  veteransFirstName,
  veteransLastName,
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
  'ui:description': SectionHeader(veteranInformationHeader),
  [formFields.first]: {
    'ui:title': veteransFirstName,
    'ui:required': requireIfDisplayed,
  },
  [formFields.last]: {
    'ui:title': veteransLastName,
    'ui:required': requireIfDisplayed,
  },
  [formFields.address]: _.merge(uiSchema(''), {
    'ui:order': ['street', 'street2', 'city', 'country', 'state', 'postalCode'],
    'ui:options': {
      hideIf: formData => veteranIsDeceased(formData),
    },
    street: {
      'ui:title': streetAddress,
    },
    country: {
      'ui:required': formData =>
        requireIfDisplayed(formData) && veteranIsAlive(formData),
    },
    state: {
      'ui:required': formData =>
        requireIfDisplayed(formData) &&
        veteranIsAlive(formData) &&
        formData.veteranInformation.address &&
        stateRequiredCountries.has(formData.veteranInformation.address.country),
    },
    street2: {
      'ui:options': {
        hideIf: () => true,
      },
    },
  }),
  [formFields.phone]: _.merge(phoneUI(daytimePhoneAreaCodeTitle), {
    'ui:options': {
      hideIf: formData => veteranIsDeceased(formData),
    },
  }),
  [formFields.email]: _.merge(emailUI(emailTitle), {
    'ui:required': formData =>
      requireIfDisplayed(formData) && veteranIsAlive(formData),
    'ui:options': {
      hideIf: formData => veteranIsDeceased(formData),
    },
  }),
});
