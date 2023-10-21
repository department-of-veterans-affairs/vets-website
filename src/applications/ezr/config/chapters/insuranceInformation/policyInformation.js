import ezrSchema from 'vets-json-schema/dist/10-10EZ-schema.json';
import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

import PolicyOrGroupDescription from '../../../components/FormDescriptions/InsurancePolicyOrGroupDescription';
import TricarePolicyDescription from '../../../components/FormDescriptions/TricarePolicyDescription';
import PolicyOrDescription from '../../../components/FormDescriptions/InsurancePolicyOrDescription';
import { validatePolicyNumberGroupCode } from '../../../utils/validation';
import { VIEW_FIELD_SCHEMA } from '../../../utils/constants';
import content from '../../../locales/en/content.json';

const {
  insuranceName,
  insurancePolicyHolderName,
  insurancePolicyNumber,
  insuranceGroupCode,
} = ezrSchema.definitions.provider.properties;

export default {
  uiSchema: {
    ...titleUI(content['insurance-policy-information-title']),
    insuranceName: {
      'ui:title': content['insurance-provider-name-label'],
      'ui:webComponentField': VaTextInputField,
    },
    insurancePolicyHolderName: {
      'ui:title': content['insurance-policyholder-name-label'],
      'ui:webComponentField': VaTextInputField,
    },
    'view:policyOrGroup': {
      'ui:title': PolicyOrGroupDescription,
      ...descriptionUI(TricarePolicyDescription, { hideOnReview: true }),
      'ui:validations': [validatePolicyNumberGroupCode],
      insurancePolicyNumber: {
        'ui:title': content['insurance-policy-number-label'],
        'ui:webComponentField': VaTextInputField,
        'ui:hint': content['insurance-policy-number-hint-text'],
      },
      'view:or': {
        ...descriptionUI(PolicyOrDescription),
      },
      insuranceGroupCode: {
        'ui:title': content['insurance-group-code-label'],
        'ui:webComponentField': VaTextInputField,
        'ui:hint': content['insurance-group-code-hint-text'],
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
          insuranceGroupCode,
          'view:or': VIEW_FIELD_SCHEMA,
        },
      },
    },
  },
};
