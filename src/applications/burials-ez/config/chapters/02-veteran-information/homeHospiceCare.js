import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Home hospice care'),
    homeHospiceCare: yesNoUI({
      title:
        'Did the Veteran receive home hospice care that was paid for by VA?',
      required: () => true,
      labelHeaderLevel: '',
    }),
  },
  schema: {
    type: 'object',
    required: ['homeHospiceCare'],
    properties: {
      homeHospiceCare: yesNoSchema,
    },
  },
};
