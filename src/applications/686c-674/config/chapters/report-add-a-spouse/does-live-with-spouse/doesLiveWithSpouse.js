import {
  yesNoSchema,
  yesNoUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const schema = {
  type: 'object',
  properties: {
    doesLiveWithSpouse: {
      type: 'object',
      properties: {
        spouseDoesLiveWithVeteran: yesNoSchema,
      },
    },
    currentMarriageInformation: {
      type: 'object',
      properties: {
        date: currentOrPastDateSchema,
      },
    },
  },
};

export const uiSchema = {
  doesLiveWithSpouse: {
    ...titleUI('Information about your marriage'),
    spouseDoesLiveWithVeteran: yesNoUI({
      title: 'Do you live with your spouse?',
      required: () => true,
      errorMessages: {
        required: 'Make a selection',
      },
    }),
  },
  currentMarriageInformation: {
    date: {
      ...currentOrPastDateUI('When did you get married?'),
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Enter the date you got married',
      },
    },
  },
};
