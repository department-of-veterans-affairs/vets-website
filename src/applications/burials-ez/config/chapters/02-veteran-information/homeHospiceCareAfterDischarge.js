import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Home hospice care after discharge'),
    homeHospiceCareAfterDischarge: yesNoUI({
      title:
        'Did the Veteran receive home hospice care after being discharged from a VA hospital or nursing home?',
      required: () => true,
      labelHeaderLevel: '',
    }),
  },
  schema: {
    type: 'object',
    required: ['homeHospiceCareAfterDischarge'],
    properties: {
      homeHospiceCareAfterDischarge: yesNoSchema,
    },
  },
};
