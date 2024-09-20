import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';

import {
  OtherHousingRisksTitle,
  otherHousingRisksLabel,
  domesticViolenceInfo,
} from '../content/livingSituation';

import { OTHER_HOUSING_RISK_MAX } from '../constants';

export default {
  uiSchema: {
    otherHousingRiskTitle: {
      'ui:title': OtherHousingRisksTitle,
      'ui:options': {
        forceDivWrapper: true,
        showFieldLabel: false,
      },
    },
    otherHousingRisks: textareaUI({
      title: otherHousingRisksLabel,
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      charcount: true,
    }),
    'view:domesticViolenceInfo': {
      'ui:description': domesticViolenceInfo,
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherHousingRiskTitle: {
        type: 'object',
        properties: {},
      },
      otherHousingRisks: {
        type: 'string',
        maxLength: OTHER_HOUSING_RISK_MAX,
      },
      'view:domesticViolenceInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
