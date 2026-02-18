import React from 'react';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isYes } from '../../../../utils/helpers';
import { IncomeAssetStatementFormAlert } from '../../../../components/FormAlerts';

const WhatTransferredAssets = () => (
  <va-additional-info trigger="How to tell if you have transferred assets">
    <p>You transferred assets if you made any of these transactions:</p>
    <ul>
      <li>You gave away money or property</li>
      <li>You sold a home that isn’t your primary residence</li>
      <li>You purchased an annuity</li>
      <li>You put money or property into a trust</li>
    </ul>
  </va-additional-info>
);

const uiSchema = {
  ...titleUI('Transferred assets'),
  transferredAssets: yesNoUI({
    title:
      'Did you or your dependents transfer any assets in the last 3 calendar years?',
    'ui:required': true,
  }),
  incomeAssetStatementFormAlert: {
    'ui:description': IncomeAssetStatementFormAlert,
    'ui:options': {
      hideIf: formData => !isYes(formData?.transferredAssets),
      displayEmptyObjectOnReview: true,
    },
  },
  'view:whatTransferredAssets': {
    'ui:description': WhatTransferredAssets,
    'ui:options': {
      displayEmptyObjectOnReview: true,
    },
  },
};

const schema = {
  type: 'object',
  required: ['transferredAssets'],
  properties: {
    transferredAssets: yesNoSchema,
    incomeAssetStatementFormAlert: {
      type: 'object',
      properties: {},
    },
    'view:whatTransferredAssets': {
      type: 'object',
      properties: {},
    },
  },
};
export default {
  uiSchema,
  schema,
};
