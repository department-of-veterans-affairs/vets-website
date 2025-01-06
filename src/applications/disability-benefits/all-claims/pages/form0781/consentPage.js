import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  consentPageDescription,
  consentPageFormHint,
  consentPageFormQuestion,
  consentPageTitle,
  CONSENT_OPTION_INDICATOR_CHOICES,
} from '../../content/form0781/consentPage';
import { formTitle } from '../../utils';

export const uiSchema = {
  'ui:title': formTitle(consentPageTitle),
  'ui:description': consentPageDescription,
  optionIndicator: radioUI({
    title: consentPageFormQuestion,
    labelHeaderLevel: '4',
    hint: consentPageFormHint,
    labels: CONSENT_OPTION_INDICATOR_CHOICES,
  }),
};

export const schema = {
  type: 'object',
  properties: {
    optionIndicator: radioSchema(Object.keys(CONSENT_OPTION_INDICATOR_CHOICES)),
  },
};
