import {
  conditionsDescription,
  conditionsPageTitle,
  conditionsQuestion,
} from '../../content/toxicExposure';
import { formTitle } from '../../utils';
import { makeSchemaForNewDisabilities } from '../../utils/schemas';

export const uiSchema = {
  'ui:title': formTitle(conditionsPageTitle),
  toxicExposureConditions: {
    'ui:title': conditionsQuestion,
    'ui:description': conditionsDescription,
    'ui:options': {
      hideDuplicateDescription: true,
      showFieldLabel: true,
      updateSchema: makeSchemaForNewDisabilities,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    toxicExposureConditions: {
      type: 'object',
      properties: {},
    },
  },
};
