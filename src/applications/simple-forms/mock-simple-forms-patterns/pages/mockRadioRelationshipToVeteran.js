import {
  relationshipToVeteranUI,
  relationshipToVeteranSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    wcv3RelationshipToVeteran: relationshipToVeteranUI(),
  },
  schema: {
    type: 'object',
    properties: {
      wcv3RelationshipToVeteran: relationshipToVeteranSchema,
    },
  },
};
