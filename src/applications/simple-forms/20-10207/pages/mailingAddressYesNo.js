import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MAILING_ADDRESS_YES_NO_LABELS } from '../config/constants';

export default {
  uiSchema: {
    mailingAddressYesNo: yesNoUI({
      title: 'Do you have a current mailing address?',
      description:
        'If we have a way to contact you, we’ll be able to process this request faster. But we don’t require a mailing address for this request.',
      labels: MAILING_ADDRESS_YES_NO_LABELS,
      labelHeaderLevel: '3',
      errorMessages: {
        required:
          'Select yes if you have a current mailing address. Select no if you do not have a current mailing address.',
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
