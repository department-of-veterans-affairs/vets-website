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

export const veteranInformationUI = {
  'ui:description': SectionHeader('Veteran information'),
  [formFields.first]: {
    'ui:title': "Veteran's first name",
    'ui:required': () => true,
  },
  [formFields.last]: {
    'ui:title': "Veteran's last name",
    'ui:required': () => true,
  },
  [formFields.address]: _.merge(uiSchema(''), {
    'ui:order': ['street', 'street2', 'city', 'country', 'state', 'postalCode'],
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
  },
  [formFields.email]: {
    'ui:title': 'Email',
    'ui:required': () => true,
  },
};
