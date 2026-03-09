import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Leaving Your Last Position'),
    'ui:description': 'Tell us more about your last position',
    leftDueToDisability: yesNoUI({
      title:
        'Did you leave your last job or self-employment because of your disability? If yes, please explain in the remarks at the end.',
      errorMessages: {
        required:
          'Select a response to tell us if your disability is the reason you left your last job',
      },
    }),
    receivesDisabilityRetirement: yesNoUI({
      title:
        'Do you receive, or do you expect to receive disability retirement benefits?',
      errorMessages: {
        required:
          'Select a response to tell us if you currently receive disability retirement benefits or if you expect to receive them',
      },
    }),
    receivesWorkersCompensation: yesNoUI({
      title:
        'Do you receive, or do you expect to receive workers compensation benefits?',
      errorMessages: {
        required:
          'Select a response to tell us if you currently receive workers compensation benefits or if you expect to receive them',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      leftDueToDisability: yesNoSchema,
      receivesDisabilityRetirement: yesNoSchema,
      receivesWorkersCompensation: yesNoSchema,
    },
    required: [
      'leftDueToDisability',
      'receivesDisabilityRetirement',
      'receivesWorkersCompensation',
    ],
  },
};
