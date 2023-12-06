import {
  titleUI,
  relationshipToVeteranUI,
  relationshipToVeteranSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Relationship to Veteran'),
    relationshipToVeteran: relationshipToVeteranUI(),
  },
  schema: {
    type: 'object',
    properties: {
      relationshipToVeteran: relationshipToVeteranSchema,
    },
  },
};
