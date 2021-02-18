import { countries, states50AndDC } from 'vets-json-schema/dist/constants.json';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

const PATTERNS = {
  date: '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
};

const locationSchema = {
  type: 'object',
  properties: {
    isOutsideUs: {
      type: 'boolean',
      default: false,
    },
    state: {
      type: 'string',
      enum: states50AndDC.map(state => state.value),
      enumNames: states50AndDC.map(state => state.label),
    },
    city: {
      type: 'string',
      maxLength: 30,
    },
  },
};

const locationUiSchema = {
  isOutsideUs: {
    'ui:title': 'This happened outside of the U.S.',
  },
  state: {
    'ui:options': {
      replaceSchema: formData => {
        if (formData?.location?.isOutsideUs) {
          return {
            type: 'string',
            title: 'Country where this happened',
            enum: countries
              .filter(country => country.value !== 'USA')
              .map(country => country.value),
            enumNames: countries
              .filter(country => country.label !== 'United States')
              .map(country => country.label),
          };
        }
        return {
          type: 'string',
          title: 'State where this happened',
          enum: states50AndDC.map(state => state.value),
          enumNames: states50AndDC.map(state => state.label),
        };
      },
    },
  },
  city: {
    'ui:title': 'City where this happened',
  },
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
        location: locationSchema,
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
      location: locationUiSchema,
    },
  },
  Child: {
    schema: {
      type: 'object',
      required: ['reasonForRemoval', 'date'],
      properties: {
        reasonForRemoval: {
          type: 'string',
          enum: ['LEFTHOUSEHOLD', 'DEATH'],
          enumNames: ['No longer part of household', 'Death'],
        },
        date: {
          type: 'string',
          pattern: PATTERNS.date,
        },
      },
    },
    uiSchema: {
      reasonForRemoval: {
        'ui:title': 'Reason for removal',
        'ui:widget': 'radio',
        'ui:errorMessages': {
          required: 'Please select an option',
        },
      },
      date: currentOrPastDateUI('Date this occurred'),
    },
  },
};
