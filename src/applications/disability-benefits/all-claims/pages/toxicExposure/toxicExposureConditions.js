import { checkboxGroupSchema } from 'platform/forms-system/src/js/web-component-patterns';
import {
  conditionsDescription,
  conditionsPageTitle,
  conditionsQuestion,
  makeTEConditionsSchema,
  makeTEConditionsUISchema,
  validateTEConditions,
} from '../../content/toxicExposure';
import { formTitle, makeConditionsUI } from '../../utils';
import ToxicExposureConditions from '../../components/confirmation/ToxicExposureConditions';

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
  'ui:confirmationField': ToxicExposureConditions,
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
