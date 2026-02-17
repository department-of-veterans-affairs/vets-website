import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Previous marriages',
  path: 'household/spouse-marriage-question',
  depends: formData => formData.claimantRelationship === 'SURVIVING_SPOUSE',
  uiSchema: {
    ...titleUI('Previous marriages'),
    recognizedAsSpouse: yesNoUI({
      title: 'Did we recognize you as the Veteran’s spouse before their death?',
    }),
    hadPreviousMarriages: yesNoUI({
      title:
        'Were you or the Veteran married to anyone else before you married each other?',
    }),
  },
  schema: {
    type: 'object',
    required: ['recognizedAsSpouse', 'hadPreviousMarriages'],
    properties: {
      recognizedAsSpouse: yesNoSchema,
      hadPreviousMarriages: yesNoSchema,
    },
  },
};
