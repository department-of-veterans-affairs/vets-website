import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Single page: Children of Veteran
 */
const uiSchema = {
  ...titleUI('Children of Veteran'),
  pregnantWithVeteran: yesNoUI({
    title: "Are you expecting the birth of the Veteran's child?",
  }),
  childWithVeteran: yesNoUI({
    title:
      'Did you have a child with the Veteran before or during your marriage?',
  }),
};

const schema = {
  type: 'object',
  properties: {
    pregnantWithVeteran: yesNoSchema,
    childWithVeteran: yesNoSchema,
  },
  required: ['pregnantWithVeteran', 'childWithVeteran'],
};

const veteranChildren = {
  path: 'household/children-of-veteran',
  title: 'Children of Veteran',
  // Skip this page when spouse answers NO to hadPreviousMarriages so flow jumps to dependents
  depends: formData =>
    formData.claimantRelationship !== 'SPOUSE' ||
    formData.hadPreviousMarriages === true,
  uiSchema,
  schema,
};

export default veteranChildren;
