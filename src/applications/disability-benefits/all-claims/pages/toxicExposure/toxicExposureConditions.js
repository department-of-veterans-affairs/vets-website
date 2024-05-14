import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  conditionsDescription,
  conditionsPageTitle,
  conditionsQuestion,
  makeTEConditionsSchema,
  makeTEConditionsUISchema,
  validateTEConditions,
} from '../../content/toxicExposure';
import { formTitle } from '../../utils';

export const uiSchema = {
  'ui:title': formTitle(conditionsPageTitle),
  toxicExposure: {
    conditions: checkboxGroupUI({
      title: conditionsQuestion,
      description: conditionsDescription,
      labels: {},
      required: false,
      replaceSchema: makeTEConditionsSchema,
      updateUiSchema: makeTEConditionsUISchema,
    }),
  },
  'ui:validations': [validateTEConditions],
};

export const schema = {
  type: 'object',
  properties: {
    toxicExposure: {
      type: 'object',
      properties: {
        conditions: checkboxGroupSchema([]),
      },
    },
  },
};
