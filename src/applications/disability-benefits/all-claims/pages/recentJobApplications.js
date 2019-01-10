import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import {
  unemployabilityTitle,
  unemployabilityPageTitle,
} from '../content/unemployabilityFormIntro';

import {
  recentJobApplicationsDescription,
  substantiallyGainfulEmployment,
} from '../content/recentJobApplications';

import currentOrPastDateUI from 'us-forms-system/lib/js/definitions/date';
import RecentJobApplicationField from '../components/RecentJobApplicationField';
import { generateAddressSchemas } from '../utils';

const { addressUI, addressSchema } = generateAddressSchemas(
  ['addressLine3', 'postalCode'],
  ['country', 'addressLine1', 'addressLine2', 'city', 'state', 'zipCode'],
  {
    country: 'Country',
    addressLine1: 'Street address',
    addressLine2: 'Street address (line 2)',
    city: 'City',
    state: 'State',
    zipCode: 'Postal code',
  },
);

const {
  appliedEmployers,
} = fullSchema.properties.form8940.properties.unemployability.properties;

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  unemployability: {
    'ui:title': unemployabilityPageTitle('Recent job applications'),
    'view:hasAppliedEmployers': {
      'ui:title': recentJobApplicationsDescription(),
      'ui:widget': 'yesNo',
    },
    appliedEmployers: {
      'ui:options': {
        viewField: RecentJobApplicationField,
        expandUnder: 'view:hasAppliedEmployers',
        itemName: 'Job',
      },
      items: {
        name: {
          'ui:title': "Company's Name",
        },
        address: addressUI,
        workType: {
          'ui:title': 'Type of work',
        },
        date: currentOrPastDateUI('Date you applied'),
      },
    },
    'view:substantiallyGainfulEmploymentInfo': {
      'ui:title': ' ',
      'ui:description': substantiallyGainfulEmployment(),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    unemployability: {
      type: 'object',
      properties: {
        'view:hasAppliedEmployers': {
          type: 'boolean',
        },
        appliedEmployers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ...appliedEmployers.items.properties,
              address: addressSchema,
            },
          },
        },
        'view:substantiallyGainfulEmploymentInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
