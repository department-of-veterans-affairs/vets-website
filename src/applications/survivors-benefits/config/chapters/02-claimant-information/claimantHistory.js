import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Claimant’s service history'),
    claimantIsVeteran: yesNoUI({
      title: 'Is the claimant a Veteran?',
    }),
  },
  schema: {
    type: 'object',
    required: ['claimantIsVeteran'],
    properties: {
      claimantIsVeteran: yesNoSchema,
    },
  },
};
