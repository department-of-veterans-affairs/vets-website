import {
  claimantRelationshipToVeteranSpouseOrChildUI,
  relationshipToVeteranSpouseOrChildSchema,
} from 'platform/forms-system/src/js/web-component-patterns/';

/** @type {PageSchema} */
export default {
  uiSchema: {
    relationshipToVeteran: claimantRelationshipToVeteranSpouseOrChildUI(),
  },
  schema: {
    type: 'object',
    required: ['relationshipToVeteran'],
    properties: {
      relationshipToVeteran: relationshipToVeteranSpouseOrChildSchema,
    },
  },
};
