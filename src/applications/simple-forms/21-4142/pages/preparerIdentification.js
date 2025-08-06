import {
  radioSchema,
  radioUI,
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  preparerIdentificationFields,
  relationshipToVeteranLabels,
} from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [preparerIdentificationFields.parentObject]: {
      ...titleUI('Who is submitting this authorization?'),
      [preparerIdentificationFields.relationshipToVeteran]: radioUI({
        title: 'Relationship to Veteran',
        labels: relationshipToVeteranLabels,
      }),
      other: textUI({
        title:
          'If your relationship with the Veteran is not listed, you can write it here',
        hideEmptyValueInReview: true,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [preparerIdentificationFields.parentObject]: {
        type: 'object',
        properties: {
          [preparerIdentificationFields.relationshipToVeteran]: radioSchema(
            Object.values(relationshipToVeteranLabels),
          ),
          other: textSchema,
        },
      },
    },
  },
};
