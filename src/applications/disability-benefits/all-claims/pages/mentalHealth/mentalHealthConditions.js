import { checkboxGroupSchema } from 'platform/forms-system/src/js/web-component-patterns';
import {
  conditionsPageTitle,
  conditionsQuestion,
  examplesHint,
  makeMHConditionsSchema,
  makeMHConditionsUISchema,
  validateMHConditions,
} from '../../content/mentalHealth';
import { traumaticEventsExamples } from '../../content/form0781';
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
    'ui:description': traumaticEventsExamples,
  },
  'ui:validations': [validateMHConditions],
};

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
