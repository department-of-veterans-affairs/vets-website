import {
  arrayBuilderItemFirstPageTitleUI,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  PolicyOrGroupTitle,
  TricarePolicyDescription,
} from '../../../components/FormDescriptions';
import { FULL_SCHEMA } from '../../../utils/imports';
import { validatePolicyNumber } from '../../../utils/validation';
import content from '../../../locales/en/content.json';

const { providers } = FULL_SCHEMA.properties;
const policy = providers.items.properties;

export default {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: content['insurance-info--policy-title'],
      showEditExplanationText: false,
    }),
    insuranceName: textUI({
      title: content['insurance-info--provider-label'],
      errorMessages: {
        required: content['insurance-info--provider-error-message'],
        pattern: content['insurance-info--provider-error-message'],
      },
    }),
    insurancePolicyHolderName: textUI({
      title: content['insurance-info--policyholder-label'],
      errorMessages: {
        required: content['insurance-info--policyholder-error-message'],
        pattern: content['insurance-info--policyholder-error-message'],
      },
    }),
    'view:policyNumberOrGroupCode': {
      ...titleUI({
        title: PolicyOrGroupTitle,
        headerLevel: 4,
        classNames: 'vads-u-margin-top--3',
      }),
      insurancePolicyNumber: textUI({
        title: content['insurance-info--policy-number-label'],
        hint: content['insurance-info--policy-number-hint'],
        description: TricarePolicyDescription,
        errorMessages: {
          required: content['insurance-info--policy-number-error-message'],
          pattern: content['insurance-info--policy-number-error-message'],
        },
      }),
      insuranceGroupCode: textUI({
        title: content['insurance-info--group-code-label'],
        hint: content['insurance-info--group-code-hint'],
        errorMessages: {
          required: content['insurance-info--group-code-error-message'],
          pattern: content['insurance-info--group-code-error-message'],
        },
      }),
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
};
