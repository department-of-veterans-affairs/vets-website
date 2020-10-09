import { uiSchema } from 'platform/forms/definitions/address';
import SectionHeader from '../../content/SectionHeader';
import _ from 'lodash';

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

export const personInformationUI = person => ({
  'ui:description': SectionHeader(`${person} information`),
  [formFields.first]: {
    'ui:title': `${person}'s first name`,
    'ui:required': () => true,
  },
  [formFields.last]: {
    'ui:title': `${person}'s last name`,
    'ui:required': () => true,
  },
  [formFields.address]: _.merge(uiSchema(''), {
    'ui:order': ['street', 'street2', 'city', 'country', 'state', 'postalCode'],
    'ui:options': {
      hideIf: formData => person !== 'Dependent' && veteranIsDeceased(formData),
    },
    street: {
      'ui:title': 'Street address',
    },
    country: {
      'ui:required': () => true,
    },
    street2: {
      'ui:options': {
        hideIf: () => true,
      },
    },
  }),
  [formFields.phone]: {
    'ui:title': 'Daytime phone (area code)',
    'ui:options': {
      hideIf: formData => person !== 'Dependent' && veteranIsDeceased(formData),
    },
  },
  [formFields.email]: {
    'ui:title': 'Email',
    'ui:required': () => true,
    'ui:options': {
      hideIf: formData => person !== 'Dependent' && veteranIsDeceased(formData),
    },
  },
});
