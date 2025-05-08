import { checkboxGroupSchema } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import {
  conditionsDescription,
  conditionsPageTitle,
  conditionsQuestion,
  makeTEConditionsSchema,
  makeTEConditionsUISchema,
  validateTEConditions,
} from '../../content/toxicExposure';
import { formTitle, makeConditionsUI } from '../../utils';

export const uiSchema = {
  'ui:title': formTitle(conditionsPageTitle),
  toxicExposure: {
    conditions: makeConditionsUI({
      title: conditionsQuestion,
      description: conditionsDescription,
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
