import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  consentPageDescription,
  consentPageFormHint,
  consentPageFormTitle,
  consentPageTitle,
  optionIndicatorChoices,
} from '../../content/form0781/consentPage';
import { formTitle } from '../../utils';

export const uiSchema = {
  'ui:title': formTitle(consentPageTitle),
  'ui:description': consentPageDescription,
  optionIndicator: radioUI({
    title: consentPageFormTitle,
    hint: consentPageFormHint,
    labels: optionIndicatorChoices,
  }),
};

export const schema = {
  type: 'object',
  properties: {
    optionIndicator: radioSchema(Object.keys(optionIndicatorChoices)),
  },
};

// BE NOTES
// JSON schema
// optionIndicator: {
//   type: 'string',
//   enum: ['yes', 'no', 'revoke', 'notEnrolled'],
// },

// Spec sample
// "optionIndicator": {
//   "yes": false,
//   "no": false,
//   "revoke": false,
//   "notEnrolled": true
// },
