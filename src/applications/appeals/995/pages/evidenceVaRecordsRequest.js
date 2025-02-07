import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  requestVaRecordsTitleOld,
  requestVaRecordsHint,
  requestVaRecordsTitle,
  requestVaRecordsInfo,
} from '../content/evidenceVaRecordsRequest';

import { EVIDENCE_VA } from '../constants';
import { showScNewForm } from '../utils/toggle';
import errorMessages from '../../shared/content/errorMessages';

export default {
  uiSchema: {
    [EVIDENCE_VA]: yesNoUI({
      title: requestVaRecordsTitleOld,
      enableAnalytics: true,
      classNames: 'vads-u-margin-bottom--4',
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
      updateUiSchema: formData => ({
        'ui:title': showScNewForm(formData)
          ? requestVaRecordsTitle
          : requestVaRecordsTitleOld,
        'ui:options': {
          hint: showScNewForm(formData) ? requestVaRecordsHint : '',
        },
      }),
    }),

    'view:vaEvidenceInfo': {
      'ui:description': requestVaRecordsInfo,
    },
  },

  schema: {
    type: 'object',
    properties: {
      [EVIDENCE_VA]: yesNoSchema,
      'view:vaEvidenceInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
