import { apiRequest } from 'platform/utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import * as Sentry from '@sentry/browser';

// /v0/calculate_monthly_expenses
export const getMonthlyExpensesAPI = async formData => {
  const body = JSON.stringify(formData);
  try {
    const url = `${
      environment.API_URL
    }/debts_api/v0/calculate_monthly_expenses`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
      },
      body,
      mode: 'cors',
    };

    return await apiRequest(url, options);
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(`calculate_monthly_expenses failed: ${error}`);
    });
    return null;
  }
};

// /v0/calculate_all_expenses
export const getAllExpensesAPI = async formData => {
  const body = JSON.stringify(formData);
  try {
    const url = `${environment.API_URL}/debts_api/v0/calculate_all_expenses`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
      },
      body,
      mode: 'cors',
    };

    return await apiRequest(url, options);
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(`calculate_all_expenses failed: ${error}`);
    });
    return null;
  }
};
