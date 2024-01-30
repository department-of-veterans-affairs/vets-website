import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { LIVING_SITUATIONS_3RD_PTY_VET } from '../config/constants';
import { validateLivingSituation } from '../helpers';

export default {
  uiSchema: {
    livingSituation: checkboxGroupUI({
      title:
        'Which of these statements best describe the Veteran’s living situation?',
      required: true,
      labels: LIVING_SITUATIONS_3RD_PTY_VET,
      labelHeaderLevel: '3',
      tile: false,
      errorMessages: {
        required: 'Select the appropriate living situation',
      },
    }),
    'ui:validations': [validateLivingSituation],
  },
  schema: {
    type: 'object',
    properties: {
      livingSituation: checkboxGroupSchema(
        Object.keys(LIVING_SITUATIONS_3RD_PTY_VET),
      ),
    },
  },
};
