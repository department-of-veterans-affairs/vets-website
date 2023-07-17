import {
  titleUI,
  titleSchema,
  relationshipToVeteranUI,
  relationshipToVeteranSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const customLabels = {
  spouse: 'I am the spouse',
  child: 'I am the child',
  other: 'Other option',
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    wcTitle: titleUI('Web component'),
    wcv3RelationshipToVeteran: relationshipToVeteranUI(
      'what is your relationship to this person?',
      'type something else here',
      customLabels,
      'other',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      wcTitle: titleSchema,
      wcv3RelationshipToVeteran: relationshipToVeteranSchema(customLabels),
    },
  },
};
