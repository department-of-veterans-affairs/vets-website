import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

const PATTERNS = {
  date: '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
};

export const SCHEMAS = {
  Spouse: {
    schema: {
      type: 'object',
      required: ['reasonMarriageEnded', 'date'],
      properties: {
        reasonMarriageEnded: {
          type: 'string',
          enum: ['DIVORCE', 'ANNULMENT', 'VOID', 'DEATH'],
          enumNames: [
            'Divorce',
            'Annulment',
            'Declared Void',
            'Spouse’s Death',
          ],
        },
        date: {
          type: 'string',
          pattern: PATTERNS.date,
        },
      },
    },
    uiSchema: {
      reasonMarriageEnded: {
        'ui:title': 'Reason marraged ended:',
        'ui:widget': 'radio',
        'ui:errorMessages': {
          required: 'Please select an option',
        },
      },
      date: currentOrPastDateUI('Date marriage ended'),
    },
  },
};
