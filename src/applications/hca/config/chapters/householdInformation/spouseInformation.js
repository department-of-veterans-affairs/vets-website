import merge from 'lodash/merge';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import fullNameUI from 'platform/forms/definitions/fullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';

// import { validateMarriageDate } from '../../../utils/validation';

const {
  cohabitedLastYear,
  dateOfMarriage,
  provideSupportLastYear,
  sameAddress,
  spouseDateOfBirth,
  spouseFullName,
  spousePhone,
  spouseSocialSecurityNumber,
  spouseAddress: address,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Spouse\u2019s information',
    'ui:description':
      'Please fill this out to the best of your knowledge. The more accurate your responses, the faster we can process your application.',
    spouseFullName: {
      ...fullNameUI,
      first: {
        'ui:title': 'Spouse\u2019s first name',
        'ui:errorMessages': {
          required: 'Please enter a first name',
        },
      },
      last: {
        'ui:title': 'Spouse\u2019s last name',
        'ui:errorMessages': {
          required: 'Please enter a last name',
        },
      },
      middle: {
        'ui:title': 'Spouse\u2019s middle name',
      },
      suffix: {
        'ui:title': 'Spouse\u2019s suffix',
      },
    },
    spouseSocialSecurityNumber: {
      ...ssnUI,
      'ui:title': 'Spouse\u2019s Social Security number',
    },
    spouseDateOfBirth: currentOrPastDateUI('Spouse\u2019s date of birth'),
    dateOfMarriage: {
      ...currentOrPastDateUI('Date of marriage'),
      // 'ui:validations': [validateMarriageDate],
    },
    cohabitedLastYear: {
      'ui:title': 'Did your spouse live with you last year?',
      'ui:widget': 'yesNo',
    },
    provideSupportLastYear: {
      'ui:title':
        'If your spouse did not live with you last year, did you provide financial support?',
      'ui:widget': 'yesNo',
      'ui:options': {
        expandUnder: 'cohabitedLastYear',
        expandUnderCondition: false,
      },
    },
    sameAddress: {
      'ui:title': 'Do you have the same address as your spouse?',
      'ui:widget': 'yesNo',
    },
    'view:spouseContactInformation': {
      'ui:title': 'Spouse\u2019s address and telephone number',
      'ui:options': {
        expandUnder: 'sameAddress',
        expandUnderCondition: false,
      },
      spouseAddress: {
        ...addressUI('', true, formData => formData.sameAddress === false),
        street: {
          'ui:title': 'Street address',
        },
      },
      spousePhone: phoneUI(),
    },
  },
  schema: {
    type: 'object',
    required: [
      'spouseSocialSecurityNumber',
      'spouseDateOfBirth',
      'dateOfMarriage',
      'sameAddress',
    ],
    properties: {
      spouseFullName,
      spouseSocialSecurityNumber,
      spouseDateOfBirth,
      dateOfMarriage,
      cohabitedLastYear,
      provideSupportLastYear,
      sameAddress,
      'view:spouseContactInformation': {
        type: 'object',
        properties: {
          spouseAddress: merge(
            {},
            addressSchema({ definitions: { address } }, true),
            {
              properties: {
                city: {
                  minLength: 1,
                  maxLength: 30,
                },
              },
            },
          ),
          spousePhone,
        },
      },
    },
  },
};
