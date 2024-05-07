import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  unemployabilityTitle,
  unemployabilityPageTitle,
} from '../content/unemployabilityFormIntro';

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  unemployability: {
    'ui:title': unemployabilityPageTitle('Certification'),
    'view:statementsAreTrue': {
      'ui:title':
        'I certify that because of my service-connected disabilities, I’m unable to hold down a steady job and that the statements in my application are true and complete to the best of my knowledge and belief. I understand that these statements will be considered in deciding my eligibility for Individual Unemployability benefits.',
      'view:statementsAreTrueAccept': {
        'ui:webComponentField': VaCheckboxField,
        'ui:title': 'I accept',
      },
      'ui:options': {
        showFieldLabel: true,
      },
      'ui:validations': [
        (errors, item) => {
          if (!item['view:statementsAreTrueAccept']) {
            errors.addError('You must accept the certification');
          }
        },
      ],
    },
    'view:informOfReturnToWork': {
      'ui:title':
        'I understand that if I become eligible for Individual Unemployability benefits, I must immediately inform VA if I return to work. I also understand that total disability benefits paid to me after I begin work may be considered an overpayment, and I may be asked to repay money to VA.',
      'view:informOfReturnToWorkAccept': {
        'ui:webComponentField': VaCheckboxField,
        'ui:title': 'I accept',
      },
      'ui:options': {
        showFieldLabel: true,
      },
      'ui:validations': [
        (errors, item) => {
          if (!item['view:informOfReturnToWorkAccept']) {
            errors.addError('You must accept the certification');
          }
        },
      ],
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    unemployability: {
      type: 'object',
      properties: {
        'view:statementsAreTrue': {
          type: 'object',
          required: ['view:statementsAreTrueAccept'],
          properties: {
            'view:statementsAreTrueAccept': {
              type: 'boolean',
            },
          },
        },
        'view:informOfReturnToWork': {
          type: 'object',
          required: ['view:informOfReturnToWorkAccept'],
          properties: {
            'view:informOfReturnToWorkAccept': {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};
