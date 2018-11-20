import { ancillaryFormsWizardDescription } from '../content/ancillaryFormsWizardIntro';

export const uiSchema = {
  'ui:title': 'Additional disability benefits',
  'view:ancillaryFormsWizardIntro': {
    'ui:description': ancillaryFormsWizardDescription,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:ancillaryFormsWizardIntro': {
      type: 'object',
      properties: {},
    },
  },
};
