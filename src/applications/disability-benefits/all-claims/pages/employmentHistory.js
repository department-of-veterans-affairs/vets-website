import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';

import { unemployabilityTitle } from '../content/unemployabilityFormIntro';
import { employmentDescription } from '../content/employmentHistory';
import EmploymentHistoryCard from '../components/EmploymentHistoryCard';
import { addressUISchema } from '../utils/schemas';

const {
  previousEmployers,
} = fullSchema.properties.form8940.properties.unemployability.properties;

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
        employerAddress: addressUISchema(
          'unemployability.previousEmployers[:index].employerAddress',
        ),
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
            'How much time did you miss from work because of your disability?',
        },
        mostEarningsInAMonth: currencyUI('Highest gross earnings per month'),
        inBusiness: {
          'ui:webComponentField': VaCheckboxField,
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
