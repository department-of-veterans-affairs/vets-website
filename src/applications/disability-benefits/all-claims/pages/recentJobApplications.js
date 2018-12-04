import { merge, omit } from 'lodash';
import fullSchema from '../config/schema';

const { date } = fullSchema.definitions;

import {
  recentJobApplicationsDescription,
  substantiallyGainfulEmployment,
} from '../content/recentJobApplications';

import {
  uiSchema as addressUI,
  schema as addressSchema,
} from '../../../../platform/forms/definitions/address';

const address = addressSchema(fullSchema);

import { validateZIP } from '../validations';

import currentOrPastDateUI from 'us-forms-system/lib/js/definitions/date';
import RecentJobApplicationField from '../components/RecentJobApplicationField';

export const uiSchema = {
  'ui:title': 'Recent job applications',
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
      address: merge(addressUI('', false), {
        'ui:order': [
          'country',
          'addressLine1',
          'addressLine2',
          'city',
          'state',
          'zipCode',
        ],
        addressLine1: {
          'ui:title': 'Street 1',
        },
        addressLine2: {
          'ui:title': 'Street 2',
        },
        state: {
          'ui:title': 'State',
        },
        zipCode: {
          'ui:title': 'Postal Code',
          'ui:validations': [validateZIP],
        },
      }),
      workType: {
        'ui:title': 'Type of work',
      },
      date: currentOrPastDateUI('Date you applied'),
    },
  },
  substantiallyGainfulEmploymentInfo: {
    'ui:title': ' ',
    'ui:description': substantiallyGainfulEmployment(),
  },
};

export const schema = {
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
          name: {
            type: 'string',
          },
          address: {
            ...address,
            properties: {
              ...omit(address.properties, ['addressLine3', 'postalCode']),
              zipCode: {
                type: 'string',
              },
            },
          },
          workType: {
            type: 'string',
          },
          date,
        },
      },
    },
    substantiallyGainfulEmploymentInfo: {
      type: 'object',
      properties: {},
    },
  },
};
