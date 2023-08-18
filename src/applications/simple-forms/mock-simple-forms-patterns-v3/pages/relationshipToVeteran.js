import {
  titleUI,
  titleSchema,
  relationshipToVeteranUI,
  relationshipToVeteranSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:title': titleUI('Relationship to Veteran'),
    relationshipToVeteran: relationshipToVeteranUI(),
  },
  schema: {
    type: 'object',
    properties: {
      'view:title': titleSchema,
      relationshipToVeteran: relationshipToVeteranSchema,
    },
  },
};
