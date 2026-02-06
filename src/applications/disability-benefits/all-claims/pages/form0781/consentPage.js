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
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../content/form0781';
import ConfirmationTraumaticEventsMedicalRecordOptIn from '../../components/confirmationFields/ConfirmationTraumaticEventsMedicalRecordOptIn';

export const uiSchema = {
  'ui:title': titleWithTag(consentPageTitle, form0781HeadingTag),
  'ui:description': consentPageDescription,
  'ui:confirmationField': ConfirmationTraumaticEventsMedicalRecordOptIn,
  optionIndicator: radioUI({
    title: consentPageFormQuestion,
    labelHeaderLevel: '4',
    hint: consentPageFormHint,
    labels: CONSENT_OPTION_INDICATOR_CHOICES,
  }),
  'view:mentalHealthSupportAlert': {
    'ui:description': mentalHealthSupportAlert,
  },
};

export const schema = {
  type: 'object',
  properties: {
    optionIndicator: radioSchema(Object.keys(CONSENT_OPTION_INDICATOR_CHOICES)),
    'view:mentalHealthSupportAlert': {
      type: 'object',
      properties: {},
    },
  },
};
