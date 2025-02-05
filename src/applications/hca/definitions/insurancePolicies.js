import {
  titleUI,
  textUI,
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  arrayBuilderItemFirstPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  PolicyOrGroupTitle,
  TricarePolicyDescription,
} from '../components/FormDescriptions';
import { FULL_SCHEMA } from '../utils/imports';
import { validatePolicyNumber } from '../utils/validation';
import content from '../locales/en/content.json';

const {
  providers: {
    items: { properties: policy },
  },
} = FULL_SCHEMA.properties;

/**
 * Declare schema attributes for policy information page
 * @returns {PageSchema}
 */
export const policyPage = options => ({
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: content['insurance-info--policy-title'],
      nounSingular: options.nounSingular,
    }),
    insuranceName: {
      ...textUI({
        title: content['insurance-info--provider-label'],
        errorMessages: {
          required: content['insurance-info--provider-error-message'],
          pattern: content['insurance-info--provider-error-message'],
        },
      }),
    },
    insurancePolicyHolderName: {
      ...textUI({
        title: content['insurance-info--policyholder-label'],
        errorMessages: {
          required: content['insurance-info--policyholder-error-message'],
          pattern: content['insurance-info--policyholder-error-message'],
        },
      }),
    },
    'view:policyNumberOrGroupCode': {
      ...titleUI({
        title: PolicyOrGroupTitle,
        headerLevel: 4,
        classNames: 'vads-u-margin-top--3',
      }),
      insurancePolicyNumber: {
        ...textUI({
          title: content['insurance-info--policy-number-label'],
          hint: content['insurance-info--policy-number-hint'],
          description: TricarePolicyDescription,
          errorMessages: {
            required: content['insurance-info--policy-number-error-message'],
            pattern: content['insurance-info--policy-number-error-message'],
          },
        }),
      },
      insuranceGroupCode: {
        ...textUI({
          title: content['insurance-info--group-code-label'],
          hint: content['insurance-info--group-code-hint'],
          errorMessages: {
            required: content['insurance-info--group-code-error-message'],
            pattern: content['insurance-info--group-code-error-message'],
          },
        }),
      },
      'ui:validations': [validatePolicyNumber],
    },
  },
  schema: {
    type: 'object',
    required: ['insuranceName', 'insurancePolicyHolderName'],
    properties: {
      insuranceName: policy.insuranceName,
      insurancePolicyHolderName: policy.insurancePolicyHolderName,
      'view:policyNumberOrGroupCode': {
        type: 'object',
        properties: {
          insurancePolicyNumber: policy.insurancePolicyNumber,
          insuranceGroupCode: policy.insuranceGroupCode,
        },
      },
    },
  },
});

/**
 * Declare schema attributes for summary page
 * @returns {PageSchema}
 */
export const summaryPage = options => ({
  uiSchema: {
    'view:hasHealthInsuranceToAdd': arrayBuilderYesNoUI(options, {
      hint: null,
    }),
  },
  schema: {
    type: 'object',
    required: ['view:hasHealthInsuranceToAdd'],
    properties: {
      'view:hasHealthInsuranceToAdd': arrayBuilderYesNoSchema,
    },
  },
});
