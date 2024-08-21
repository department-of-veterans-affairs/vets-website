import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  requestVaRecordsTitle,
  requestVaRecordsHint,
} from '../content/evidenceVaRecordsRequest';

import { EVIDENCE_VA } from '../constants';
import errorMessages from '../../../shared/content/errorMessages';

export default {
  uiSchema: {
    [EVIDENCE_VA]: yesNoUI({
      title: requestVaRecordsTitle,
      hint: requestVaRecordsHint,
      enableAnalytics: true,
      labelHeaderLevel: '3',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      required: () => true,
      errorMessages: {
        required: errorMessages.requiredYesNo,
      },
      hideOnReview: true,
    }),
  },

  schema: {
    type: 'object',
    properties: {
      [EVIDENCE_VA]: yesNoSchema,
    },
  },
};
