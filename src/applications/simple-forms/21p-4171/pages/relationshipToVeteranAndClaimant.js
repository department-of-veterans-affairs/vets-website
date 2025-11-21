import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your relationship'),
    relationshipToVeteran: textUI('Relationship to veteran'),
    relationshipToClaimant: textUI('Relationship to claimant'),
  },
  schema: {
    type: 'object',
    properties: {
      relationshipToVeteran: textSchema,
      relationshipToClaimant: textSchema,
    },
    required: [],
  },
};
