import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import currencyUI from 'us-forms-system/lib/js/definitions/currency';
import phoneUI from 'us-forms-system/lib/js/definitions/phone';

import { unemployabilityTitle } from '../content/unemployabilityFormIntro';
import { employmentDescription } from '../content/employmentHistory';
import EmploymentHistoryCard from '../components/EmploymentHistoryCard';
import { generateAddressSchemas } from '../utils';

const {
  previousEmployers,
} = fullSchema.properties.form8940.properties.unemployability.properties;

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

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': employmentDescription,
  unemployability: {
    previousEmployers: {
      'ui:options': {
        itemName: 'Employer',
        viewField: EmploymentHistoryCard,
        hideTitle: true,
      },
      items: {
        name: {
          'ui:title': 'Employer’s name',
        },
        employerAddress: addressUI,
        phone: phoneUI('Primary phone number'),
        typeOfWork: {
          'ui:title': 'Type of work',
        },
        hoursPerWeek: {
          'ui:title': 'Hours worked per week',
        },
        dates: {
          ...dateRangeUI(),
          'ui:title': 'Dates of employment',
        },
        timeLostFromIllness: {
          'ui:title':
            'How much time did you miss from work because of your disability',
        },
        mostEarningsInAMonth: currencyUI('Highest gross earnings per month'),
        inBusiness: {
          'ui:title': 'Employer is no longer in business',
        },
        'view:inBusinessMsg': {
          'ui:title': '',
          'ui:description':
            'Since this employer is no longer in business, you don’t need to ask them to fill out VA Form 21-4192',
          'ui:options': {
            expandUnder: 'inBusiness',
          },
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  required: ['view:unemployabilityUploadChoice'],
  properties: {
    unemployability: {
      type: 'object',
      properties: {
        previousEmployers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ...previousEmployers.items.properties,
              employerAddress: addressSchema,
              'view:inBusinessMsg': {
                type: 'object',
                'ui:collapsed': true,
                properties: {},
              },
            },
          },
        },
      },
    },
  },
};
