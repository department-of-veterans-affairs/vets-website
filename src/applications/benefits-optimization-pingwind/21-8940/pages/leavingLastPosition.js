import { yesNoUI, yesNoSchema } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Leaving Your Last Position',
    'ui:description': 'Tell us more about why you left your last position.',
    leftDueToDisability: yesNoUI({
      title:
        'Did you leave your last job or self-employment because of your disability?',
    }),
    receivesDisabilityRetirement: yesNoUI({
      title:
        'Do you receive, or do you expect to receive disability retirement benefits?',
    }),
    receivesWorkersCompensation: yesNoUI({
      title:
        'Do you receive, or do you expect to receive workers compensation benefits?',
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
