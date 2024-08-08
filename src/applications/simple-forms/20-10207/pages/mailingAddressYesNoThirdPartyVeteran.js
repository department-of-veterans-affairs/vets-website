import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MAILING_ADDRESS_YES_NO_LABELS_3RD_PTY_VET } from '../config/constants';

export default {
  uiSchema: {
    mailingAddressYesNo: yesNoUI({
      title: 'Does the Veteran have a current mailing address?',
      hint:
        'If we have a way to contact the Veteran, we’ll be able to process this request faster. But we don’t require a mailing address for this request.',
      labels: MAILING_ADDRESS_YES_NO_LABELS_3RD_PTY_VET,
      labelHeaderLevel: '3',
      errorMessages: {
        required:
          'Select yes if the Veteran has a current mailing address. Select no if the Veteran does not have a current mailing address.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      mailingAddressYesNo: yesNoSchema,
    },
    required: ['mailingAddressYesNo'],
  },
};
