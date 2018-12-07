export const uiSchema = {
  'ui:title': 'Impact on military duty',
  unemployability: {
    disabilityPreventMilitaryDuties: {
      'ui:title':
        'If you’re currently serving in the Reserves or the National Guard, does your service-connected disability prevent you from performing your military duties?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          yes: 'Yes',
          no: 'No',
          alsoNo: 'I’m not serving in the Reserves or the National Guard.',
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
          enum: ['yes', 'no', 'alsoNo'],
        },
      },
    },
  },
};
