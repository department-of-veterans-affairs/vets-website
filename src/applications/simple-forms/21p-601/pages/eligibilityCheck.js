import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import EligibilityAlert from '../components/EligibilityAlert';

export default {
  uiSchema: {
    ...titleUI('Check your eligibility'),
    'ui:description':
      'Please answer these questions to determine if you can file this form online.',
    hasAlreadyFiled: yesNoUI(
      'Have you already filed VA Form 21P-534EZ or 21P-535?',
    ),
    'view:continueWarning': {
      'ui:description':
        'You should not complete this form. Your accrued benefits claim is already included in your survivor benefits application.',
      'ui:options': {
        hideIf: formData => formData.hasAlreadyFiled !== true,
      },
    },
    needsWitnessSignature: {
      ...yesNoUI('Do you need to sign with an X mark?'),
      'ui:options': {
        hideIf: formData => formData.hasAlreadyFiled === true,
      },
    },
    'view:witnessWarning': {
      'ui:description': `You must use the paper form if you sign with an X mark.

[Download VA Form 21P-601 (PDF)](https://www.va.gov/find-forms/about-form-21p-601/)`,
      'ui:options': {
        hideIf: formData => formData.needsWitnessSignature !== true,
      },
    },
    hasUnpaidCreditors: {
      ...yesNoUI('Do you have unpaid creditors who need to provide waivers?'),
      'ui:options': {
        hideIf: formData =>
          formData.hasAlreadyFiled === true ||
          formData.needsWitnessSignature === true,
      },
    },
    'view:unpaidCreditorsWarning': {
      'ui:description': `You must use the paper form if you have unpaid creditors.

[Download VA Form 21P-601 (PDF)](https://www.va.gov/find-forms/about-form-21p-601/)`,
      'ui:options': {
        hideIf: formData => formData.hasUnpaidCreditors !== true,
      },
    },
    'view:eligibilityResult': {
      'ui:field': EligibilityAlert,
      'ui:options': {
        hideIf: formData =>
          formData.hasAlreadyFiled === undefined ||
          (formData.hasAlreadyFiled === false &&
            formData.needsWitnessSignature === undefined) ||
          (formData.hasAlreadyFiled === false &&
            formData.needsWitnessSignature === false &&
            formData.hasUnpaidCreditors === undefined),
      },
    },
  },
  schema: {
    type: 'object',
    required: ['hasAlreadyFiled'],
    properties: {
      hasAlreadyFiled: yesNoSchema,
      'view:continueWarning': {
        type: 'object',
        properties: {},
      },
      needsWitnessSignature: yesNoSchema,
      'view:witnessWarning': {
        type: 'object',
        properties: {},
      },
      hasUnpaidCreditors: yesNoSchema,
      'view:unpaidCreditorsWarning': {
        type: 'object',
        properties: {},
      },
      'view:eligibilityResult': {
        type: 'object',
        properties: {},
      },
    },
  },
  // Custom validation to prevent continuing if disqualified
  'ui:validations': [
    (errors, formData) => {
      if (formData.hasAlreadyFiled === true) {
        errors.addError(
          'You cannot continue with this form since you already filed for survivor benefits.',
        );
      }
      if (formData.needsWitnessSignature === true) {
        errors.addError(
          'You cannot submit this form online if you need witness signatures.',
        );
      }
      if (formData.hasUnpaidCreditors === true) {
        errors.addError(
          'You cannot submit this form online if you have unpaid creditors requiring waivers.',
        );
      }
    },
  ],
};
