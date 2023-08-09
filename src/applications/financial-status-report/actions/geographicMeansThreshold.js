import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

const INCOME_UPPER_PERCENTAGE = 1.5;
const ASSET_PERCENTAGE = 0.065;
const DISCRETIONARY_INCOME_PERCENTAGE = 0.0125;

export const getGMT = (dependents, year, zipCode) => {
  const CONTEXT_ROOT = '/income_limits/v1/limitsByZipCode';
  const REQUEST_URL = `${
    environment.API_URL
  }${CONTEXT_ROOT}/${zipCode}/${year}/${dependents}`;

  // For testing locally if api db isn't populated
  // const REQUEST_URL = `https://staging-api.va.gov/income_limits/v1/limitsByZipCode/${zipCode}/${year}/${dependents}`;

  return apiRequest(REQUEST_URL)
    .then(({ data }) => {
      // incomeUpperThreshold is 150% of the GMT
      const incomeUpperThreshold = data.gmtThreshold * INCOME_UPPER_PERCENTAGE;
      // assetThreshold is 6.5% of the GMT
      const assetThreshold = data.gmtThreshold * ASSET_PERCENTAGE;
      // discressionaryStatus is 1.25% of the GMT
      const discretionaryIncomeThreshold =
        data.gmtThreshold * DISCRETIONARY_INCOME_PERCENTAGE;

      return {
        ...data,
        error: null,
        incomeUpperThreshold,
        assetThreshold,
        discretionaryIncomeThreshold,
      };
    })
    .catch(({ error }) => {
      Sentry.withScope(scope => {
        scope.setExtra('error', error);
        Sentry.captureMessage(`income_limits failed: ${error}`);
      });

      return { gmtThreshold: null, error };
    });
};
