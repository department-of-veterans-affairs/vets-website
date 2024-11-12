import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  traumaticEventsInfo,
  conditionsPageTitle,
  conditionsQuestion,
  examplesDescription,
  makeMHConditionsSchema,
  makeMHConditionsUISchema,
  validateMHConditions,
} from '../../content/mentalHealth';
import { formTitle } from '../../utils';

export const uiSchema = {
  'ui:title': formTitle(conditionsPageTitle),
  mentalHealth: {
    conditions: checkboxGroupUI({
      title: conditionsQuestion,
      hint: examplesDescription,
      labels: {},
      required: false,
      replaceSchema: makeMHConditionsSchema,
      updateUiSchema: makeMHConditionsUISchema,
    }),
  },
  'view:traumaticEventsInfo': {
    'ui:description': traumaticEventsInfo,
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
