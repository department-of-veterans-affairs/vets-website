import React from 'react';
import {
  currencyUI,
  currencySchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { AssetInformationAlert } from '../../../components/FormAlerts';
import { showPdfFormAlignment } from '../../../helpers';

const threshold = showPdfFormAlignment() ? 75000 : 25000;

export const hideIfUnderThreshold = formData => {
  const value = parseInt(formData.netWorthEstimation, 10);
  return (
    formData.netWorthEstimation == null || // null or undefined
    Number.isNaN(value) ||
    value <= threshold
  );
};

/** @type {PageSchema} */
export default {
  title: 'Net worth estimation',
  path: 'financial/net-worth-estimation',
  depends: formData => formData.totalNetWorth === false,
  uiSchema: {
    ...titleUI(
      'Income and assets',
      `We need to know if you and your dependents have over $${threshold.toLocaleString()} in assets.`,
    ),
    'view:warningAlert': {
      'ui:description': AssetInformationAlert,
    },
    netWorthEstimation: currencyUI('Estimate the total value of your assets'),

    'view:warningAlertOnHighValue': {
      'ui:description': (
        <va-alert status="warning">
          <p className="vads-u-margin-y--0">
            Because you have more than ${threshold.toLocaleString()} in assets,
            you’ll need to submit an Income and Asset Statement in Support of
            Claim for Pension or Parents' Dependency and Indemnity Compensation
            (VA Form 21P-0969).
          </p>
          <p>
            We’ll ask you to upload this form at the end of this application. Or
            you can send it to us by mail.
          </p>
          <p>
            <va-link
              href="https://www.va.gov/find-forms/about-form-21p-0969/"
              external
              text="Get VA Form 21P-0969 to download"
            />
          </p>
        </va-alert>
      ),
      'ui:options': {
        hideIf: hideIfUnderThreshold,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['netWorthEstimation'],
    properties: {
      netWorthEstimation: currencySchema,
      'view:warningAlertOnHighValue': {
        type: 'object',
        properties: {},
      },
    },
  },
};
