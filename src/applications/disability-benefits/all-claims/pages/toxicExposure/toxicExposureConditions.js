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
  toxicExposureConditions: checkboxGroupUI({
    title: conditionsQuestion,
    description: conditionsDescription,
    labels: {},
    required: false,
    uswds: false,
    replaceSchema: makeTEConditionsSchema,
    updateUiSchema: makeTEConditionsUISchema,
  }),
  'ui:validations': [validateTEConditions],
};

export const schema = {
  type: 'object',
  properties: {
    toxicExposureConditions: checkboxGroupSchema([]),
  },
};
