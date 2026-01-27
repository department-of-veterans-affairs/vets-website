import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isYes } from '../../../utils/helpers';
import { VaForm214138Alert } from '../../../components/FormAlerts';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Dependent’s residence'),
    dependentsResidence: yesNoUI({
      title:
        'Do the children who don’t live with you reside at the same address?',
    }),
    residenceAlert: {
      'ui:description': VaForm214138Alert,
      'ui:options': {
        hideIf: formData => isYes(formData?.dependentsResidence),
        displayEmptyObjectOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['dependentsResidence'],
    properties: {
      dependentsResidence: yesNoSchema,
      residenceAlert: {
        type: 'object',
        properties: {},
      },
    },
  },
};
