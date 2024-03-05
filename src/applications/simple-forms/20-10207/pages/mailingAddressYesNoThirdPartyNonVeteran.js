import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MAILING_ADDRESS_YES_NO_LABELS_3RD_PTY_NON_VET } from '../config/constants';

export default {
  uiSchema: {
    mailingAddressYesNo: yesNoUI({
      title: 'Does the Claimant have a current mailing address?',
      description:
        'If we have a way to contact the Claimant, we’ll be able to process this request faster. But we don’t require a mailing address for this request.',
      labels: MAILING_ADDRESS_YES_NO_LABELS_3RD_PTY_NON_VET,
      labelHeaderLevel: '3',
      errorMessages: {
        required:
          'Select yes if the Claimant has a current mailing address. Select no if the Claimant does not have a current mailing address.',
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
