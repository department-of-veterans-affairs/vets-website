import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

import {
  PolicyOrGroupDescription,
  InsurancePolicyOrDescription,
  TricarePolicyDescription,
} from '../../../components/FormDescriptions/InsurancePolicyDescriptions';
import { validatePolicyNumberGroupCode } from '../../../utils/validation';
import { VIEW_FIELD_SCHEMA } from '../../../utils/constants';
import content from '../../../locales/en/content.json';

const {
  providers: { items: provider },
} = ezrSchema.properties;
const {
  insuranceName,
  insurancePolicyHolderName,
  insurancePolicyNumber,
  insuranceGroupCode,
} = provider.properties;

export default {
  uiSchema: {
    ...titleUI(content['insurance-policy-information-title']),
    insuranceName: {
      'ui:title': content['insurance-provider-name-label'],
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        pattern: 'Enter the insurance provider name',
      },
    },
    insurancePolicyHolderName: {
      'ui:title': content['insurance-policyholder-name-label'],
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        pattern: 'Enter the policyholder\u2019s name',
      },
    },
    'view:policyOrGroup': {
      'ui:title': PolicyOrGroupDescription,
      ...descriptionUI(TricarePolicyDescription, { hideOnReview: true }),
      'ui:validations': [validatePolicyNumberGroupCode],
      insurancePolicyNumber: {
        'ui:title': content['insurance-policy-number-label'],
        'ui:webComponentField': VaTextInputField,
        'ui:options': {
          hint: content['insurance-policy-number-hint-text'],
        },
        'ui:errorMessages': {
          pattern: 'Enter a valid policy number',
        },
      },
      'view:or': {
        ...descriptionUI(InsurancePolicyOrDescription),
      },
      insuranceGroupCode: {
        'ui:title': content['insurance-group-code-label'],
        'ui:webComponentField': VaTextInputField,
        'ui:options': {
          hint: content['insurance-group-code-hint-text'],
        },
        'ui:errorMessages': {
          pattern: 'Enter a valid group code',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['insuranceName', 'insurancePolicyHolderName'],
    properties: {
      insuranceName,
      insurancePolicyHolderName,
      'view:policyOrGroup': {
        type: 'object',
        properties: {
          insurancePolicyNumber,
          'view:or': VIEW_FIELD_SCHEMA,
          insuranceGroupCode,
        },
      },
    },
  },
};
