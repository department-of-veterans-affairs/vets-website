import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const historyTitle = 'Your service history';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(historyTitle),
    claimantIsVeteran: yesNoUI({
      title: 'Are you a Veteran?',
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
