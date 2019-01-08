import { merge } from 'lodash';
import { uiSchema as addressUI } from '../../../../platform/forms/definitions/address';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import currencyUI from 'us-forms-system/lib/js/definitions/currency';
import phoneUI from 'us-forms-system/lib/js/definitions/phone';

import { unemployabilityTitle } from '../content/unemployabilityFormIntro';
import { employmentDescription } from '../content/employmentHistory';
import EmploymentHistoryCard from '../components/EmploymentHistoryCard';
import { validateZIP } from '../../all-claims/validations';

const { previousEmployers } = fullSchema.properties.form8940;

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
        employerAddress: merge(addressUI(''), {
          'ui:order': [
            'country',
            'addressLine1',
            'addressLine2',
            'city',
            'state',
            'zipCode',
          ],
          addressLine1: {
            'ui:title': 'Street address',
          },
          addressLine2: {
            'ui:title': 'Street address (line 2)',
          },
          zipCode: {
            'ui:title': 'Postal code',
            'ui:validations': [validateZIP],
            'ui:errorMessages': {
              pattern:
                'Please enter a valid 5- or 9-digit Postal code (dashes allowed)',
            },
          },
        }),
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
        previousEmployers,
      },
    },
  },
};
