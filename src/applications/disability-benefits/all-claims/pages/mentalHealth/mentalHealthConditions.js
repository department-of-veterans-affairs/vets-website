import { checkboxGroupSchema } from 'platform/forms-system/src/js/web-component-patterns';
import {
  traumaticEventsInfo,
  conditionsPageTitle,
  conditionsQuestion,
  examplesHint,
  makeMHConditionsSchema,
  makeMHConditionsUISchema,
  validateMHConditions,
} from '../../content/mentalHealth';
import { formTitle, makeConditionsUI } from '../../utils';

export const uiSchema = {
  'ui:title': formTitle(conditionsPageTitle),
  mentalHealth: {
    conditions: makeConditionsUI({
      title: conditionsQuestion,
      hint: examplesHint,
      replaceSchema: makeMHConditionsSchema,
      updateUiSchema: makeMHConditionsUISchema,
    }),
  },
  'view:traumaticEventsInfo': {
    'ui:description': traumaticEventsInfo,
  },
  'ui:validations': [validateMHConditions],
};

// [wipn8923] use this selection to conditionally display my 0781 code
export const schema = {
  type: 'object',
  properties: {
    mentalHealth: {
      type: 'object',
      properties: {
        conditions: checkboxGroupSchema([]),
      },
    },
    'view:traumaticEventsInfo': {
      type: 'object',
      properties: {},
    },
  },
};
