import React from 'react';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isYes } from '../../../../utils/helpers';
import { IncomeAssetStatementFormAlert } from '../../../../components/FormAlerts';

const MarketableInfo = () => (
  <va-additional-info trigger="The additional land might not be marketable in these situations">
    <div>
      <ul>
        <li>The entire lot of land is only slightly more than 2 acres, or</li>
        <li>The additional land isn’t accessible, or</li>
        <li>
          There are zoning rules that prevent selling the additional property
        </li>
      </ul>
    </div>
  </va-additional-info>
);

const uiSchema = {
  ...titleUI('Marketable land'),
  landMarketable: yesNoUI({
    title: 'Is the additional land marketable?',
    'ui:required': true,
  }),
  incomeAssetStatementFormAlert: {
    'ui:description': IncomeAssetStatementFormAlert,
    'ui:options': {
      hideIf: formData => !isYes(formData?.landMarketable),
      displayEmptyObjectOnReview: true,
    },
  },
  'view:marketableInfo': {
    'ui:description': MarketableInfo,
    'ui:options': {
      displayEmptyObjectOnReview: true,
    },
  },
};

const schema = {
  type: 'object',
  required: ['landMarketable'],
  properties: {
    landMarketable: yesNoSchema,
    incomeAssetStatementFormAlert: {
      type: 'object',
      properties: {},
    },
    'view:marketableInfo': {
      type: 'object',
      properties: {},
    },
  },
};

export default {
  uiSchema,
  schema,
};
