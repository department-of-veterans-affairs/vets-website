import {
  relationshipToVeteranUI,
  relationshipToVeteranSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    relationshipToVeteran: relationshipToVeteranUI(),
  },
  schema: {
    type: 'object',
    properties: {
      relationshipToVeteran: relationshipToVeteranSchema,
    },
  },
};
