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

// TODO: Add destructive modal for toxic exposure

export const uiSchema = {
  'ui:title': formTitle(conditionsPageTitle),
  'ui:options': {
    forceDivWrapper: true,
  },
  toxicExposure: {
    conditions: {
      ...makeConditionsUI({
        title: conditionsQuestion,
        description: conditionsDescription,
        replaceSchema: makeTEConditionsSchema,
        updateUiSchema: makeTEConditionsUISchema,
      }),
      'ui:required': () => true,
      'ui:validations': [validateTEConditions],
      'ui:errorMessages': {
        required: 'Please select at least one condition',
      },
    },
  },
  // View fields for tracking state changes - hidden from user
  'view:previousToxicExposureConditions': {
    'ui:hidden': true,
  },
  'view:selectedToxicExposureConditions': {
    'ui:hidden': true,
  },
};

export const schema = {
  type: 'object',
  required: ['toxicExposure'],
  properties: {
    toxicExposure: {
      type: 'object',
      required: ['conditions'],
      properties: {
        conditions: checkboxGroupSchema([]),
      },
    },
    // View fields for state tracking
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
