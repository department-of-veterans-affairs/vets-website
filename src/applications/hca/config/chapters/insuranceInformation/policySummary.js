import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { insuranceTextOverrides } from '../../../utils/helpers';
import { validateInsurancePolicy } from '../../../utils/validation';
import content from '../../../locales/en/content.json';

export const insuranceArrayOptions = {
  arrayPath: 'providers',
  nounPlural: content['insurance-info--array-noun-plural'],
  nounSingular: content['insurance-info--array-noun-singular'],
  required: false,
  isItemIncomplete: validateInsurancePolicy,
  text: insuranceTextOverrides(),
};

export default {
  uiSchema: {
    'view:hasHealthInsuranceToAdd': arrayBuilderYesNoUI(insuranceArrayOptions),
  },
  schema: {
    type: 'object',
    required: ['view:hasHealthInsuranceToAdd'],
    properties: {
      'view:hasHealthInsuranceToAdd': arrayBuilderYesNoSchema,
    },
  },
};
