import {
  titleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const labels = {
  veteran: "I'm a Veteran",
  veteransSpouse: "I'm a Veteran's spouse",
  veteransChild: "I'm a Veteran's child",
  veteransCaregiver:
    "I'm a Veteran's caregiver (who isn't their spouse or child)",
  activeduty: "I'm an active duty service member",
  nationalGuard: "I'm a member of the National Guard",
  reservist: "I'm a Reservist",
  individualReadyReserve: "I'm a member of the Individual Ready Reserve",
};

export const uiSchema = {
  ...titleUI('Your relationship to Veteran'),
  veteranDesc: {
    ...radioUI({
      title: 'Which of these best describes you?',
      labels,
      errorMessages: {
        required: 'You must select one of the options',
      },
    }),
  },
};

export const schema = {
  type: 'object',
  required: ['veteranDesc'],
  properties: {
    veteranDesc: radioSchema(Object.keys(labels)),
  },
};
