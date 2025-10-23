import {
  SummaryTitle,
  SummaryDescription,
} from '../content/ancillaryFormsWizardSummary';

export const depends = formData =>
  !!(
    formData['view:modifyingHome'] ||
    formData['view:modifyingCar'] ||
    formData['view:aidAndAttendance'] ||
    formData['view:unemployable']
  );

export const uiSchema = {
  'ui:title': SummaryTitle,
  'ui:description': SummaryDescription,
  'ui:options': {
    forceDivWrapper: true,
  },
};

export const schema = {
  type: 'object',
  properties: {},
};
