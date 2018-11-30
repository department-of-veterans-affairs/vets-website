import { merge, omit } from 'lodash';
import fullSchema from '../config/schema';

import {
  recentJobApplicationsDescription,
  substantiallyGainfulEmployment,
} from '../content/recentJobApplications';

import {
  uiSchema as addressUI,
  schema as addressSchema,
} from '../../../../platform/forms/definitions/address';
import { validateZIP } from '../validations';

import ArrayField from 'us-forms-system/lib/js/fields/ArrayField';
import dateUI from 'us-forms-system/lib/js/definitions/date';

export const uiSchema = {
  'ui:title': 'Recent job applications',
  'view:hasAppliedEmployers': {
    'ui:title': recentJobApplicationsDescription(),
    'ui:widget': 'yesNo',
  },
  appliedEmployers: {
    'ui:options': {
      viewField: ArrayField,
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
          'ui:title': 'Street',
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
      date: dateUI('Date you applied'),
    },
  },
  substantiallyGainfulEmploymentInfo: {
    'ui:title': ' ',
    'ui:description': substantiallyGainfulEmployment(),
  },
};

export const schema = () => {
  const address = addressSchema(fullSchema);
  return {
    type: 'object',
    properties: {
      'view:hasAppliedEmployers': {
        type: 'boolean',
        properties: {},
      },
      appliedEmployers: {
        type: 'array',
        items: {
          type: 'object',
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
          date: {
            $ref: '#/definitions/date',
          },
        },
      },
      substantiallyGainfulEmploymentInfo: {
        type: 'object',
        properties: {},
      },
    },
  };
};
