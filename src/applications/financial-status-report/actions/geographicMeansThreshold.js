import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

export const getGMT = (dependents, year, zipCode) => {
  const CONTEXT_ROOT = '/income_limits/v1/limitsByZipCode';
  const REMOTE_REQUEST_URL = `${
    environment.API_URL
  }${CONTEXT_ROOT}/${zipCode}/${year}/${dependents}`;
  // For testing locally -- borrowed from income_limits app
  const LOCAL_REQUEST_URL = `https://staging-api.va.gov/income_limits/v1/limitsByZipCode/${zipCode}/${year}/${dependents}`;

  const REQUEST_URL = environment.isLocalhost()
    ? LOCAL_REQUEST_URL
    : REMOTE_REQUEST_URL;

  return apiRequest(REQUEST_URL)
    .then(({ data }) => {
      // incomeUpperThreshold is 150% of the GMT
      const incomeUpperThreshold = data.gmtThreshold * 1.5;
      // assetThreshold is 6.5% of the GMT
      const assetThreshold = data.gmtThreshold * 0.065;
      // discressionaryStatus is 1.25% of the GMT
      const discressionaryIncomeThreshold = data.gmtThreshold * 0.0125;

      return {
        ...data,
        error: null,
        incomeUpperThreshold,
        assetThreshold,
        discressionaryIncomeThreshold,
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
