import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';

import {
  OtherHousingRisksTitle,
  otherHousingRisksLabel,
  domesticViolenceInfo,
} from '../content/livingSituation';

import { OTHER_HOUSING_RISK_MAX } from '../constants';

export default {
  uiSchema: {
    'view:otherHousingRisk': {
      'ui:description': OtherHousingRisksTitle,
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
      'view:otherHousingRisk': {
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
