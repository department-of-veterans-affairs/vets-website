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
      'ui:title': OtherHousingRisksTitle,
      'ui:options': {
        forceDivWrapper: true,
        showFieldLabel: false,
      },
    },
    otherHousingRisks: textareaUI({
      title: otherHousingRisksLabel,
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
