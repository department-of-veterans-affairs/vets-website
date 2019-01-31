import summaryDescription from '../content/ancillaryFormsWizardSummary';

export const depends = formData =>
  !!(
    formData['view:modifyingHome'] ||
    formData['view:modifyingCar'] ||
    formData['view:aidAndAttendance'] ||
    formData['view:unemployable']
  );

export const uiSchema = {
  'ui:title': 'Summary of additional benefits',
  'ui:description': summaryDescription,
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
