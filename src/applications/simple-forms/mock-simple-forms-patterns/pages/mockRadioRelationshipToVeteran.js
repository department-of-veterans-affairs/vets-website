import {
  titleUI,
  titleSchema,
  relationshipToVeteranUI,
  relationshipToVeteranSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    wcTitle: titleUI('Web component'),
    wcv3RelationshipToVeteran: relationshipToVeteranUI(),
  },
  schema: {
    type: 'object',
    properties: {
      wcTitle: titleSchema,
      wcv3RelationshipToVeteran: relationshipToVeteranSchema,
    },
  },
};
