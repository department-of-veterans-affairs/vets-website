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
import ToxicExposureChoicePage from './toxicExposureChoicePage';

export const uiSchema = {
  'ui:title': formTitle(conditionsPageTitle),
  'ui:options': {
    forceDivWrapper: true,
  },
  toxicExposure: {
    conditions: makeConditionsUI({
      title: conditionsQuestion,
      description: conditionsDescription,
      replaceSchema: makeTEConditionsSchema,
      updateUiSchema: makeTEConditionsUISchema,
    }),
  },
  'ui:validations': [validateTEConditions],
  // Hidden view fields for state tracking, required by forms-system.
  'view:previousToxicExposureConditions': {
    'ui:hidden': true,
  },
  'view:selectedToxicExposureConditions': {
    'ui:hidden': true,
  },
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
    // View fields for state tracking - required by forms-system
    'view:previousToxicExposureConditions': {
      type: 'object',
      properties: {},
    },
    'view:selectedToxicExposureConditions': {
      type: 'object',
      properties: {},
    },
  },
};

// Export CustomPage as a named export for namespace imports
export const CustomPage = ToxicExposureChoicePage;

// Using custom page component to handle destructive modal
export default {
  uiSchema,
  schema,
  CustomPage: ToxicExposureChoicePage,
  CustomPageReview: null,
};
