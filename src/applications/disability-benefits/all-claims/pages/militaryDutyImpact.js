import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  unemployability: {
    'ui:title': 'Impact on military duty',
    disabilityPreventMilitaryDuties: {
      'ui:title':
        'If you’re currently serving in the Reserves or the National Guard, does your service-connected disability prevent you from performing your military duties?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          yes: 'Yes',
          no: 'No',
          reservesNo: 'I’m not serving in the Reserves or the National Guard.',
        },
      },
      'ui:errorMessages': {
        required: 'Please select one of the three options provided',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    unemployability: {
      type: 'object',
      required: ['disabilityPreventMilitaryDuties'],
      properties: {
        disabilityPreventMilitaryDuties: {
          type: 'string',
          enum: ['yes', 'no', 'reservesNo'],
        },
      },
    },
  },
};
