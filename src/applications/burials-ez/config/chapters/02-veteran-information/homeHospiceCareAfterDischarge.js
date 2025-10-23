import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Home hospice care after discharge'),
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
