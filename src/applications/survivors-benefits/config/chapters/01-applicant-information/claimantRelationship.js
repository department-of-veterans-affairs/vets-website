import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Claimant information',
  path: 'applicant/claimant',
  uiSchema: {
    ...titleUI('Claimant information'),
    claimantNotVeteran: yesNoUI({
      title: 'Is the claimant for these expenses different than the veteran?',
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['claimantNotVeteran'],
    properties: {
      claimantNotVeteran: {
        type: 'boolean',
      },
    },
  },
};
