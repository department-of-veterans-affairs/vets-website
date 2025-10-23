import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { format } from 'date-fns-tz';
// import { ensureValidCSRFToken } from '../utils/ensureValidCSRFToken';

export function replacer(_key, value) {
  const transformedValue = value;
  if (
    value?.claimantNotVeteran === false &&
    value.claimantFullName.first &&
    value.claimantFullName.last &&
    !value.veteranFullName?.first &&
    !value.veteranFullName?.last
  ) {
    transformedValue.veteranFullName = {
      first: value.claimantFullName.first,
      middle: value.claimantFullName.middle,
      last: value.claimantFullName.last,
      suffix: value.claimantFullName.suffix,
    };
    transformedValue.claimantFullName = {
      first: undefined,
      middle: undefined,
      last: undefined,
      suffix: undefined,
    };
  }
  return transformedValue;
}

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form, replacer);
  return JSON.stringify({
    medicalExpenseReportsClaim: {
      form: formData,
    },
    // can’t use toISOString because we need the offset
    localTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  });
}

export async function submit(
  form,
  formConfig,
  apiPath = '/medical_expense_reports/v0/form8416',
) {
  const headers = { 'Content-Type': 'application/json' };
  const body = transform(formConfig, form);
  const apiRequestOptions = {
    headers,
    body,
    method: 'POST',
    mode: 'cors',
  };

  const onSuccess = resp => {
    window.dataLayer.push({
      event: `${formConfig.trackingPrefix}-submission-successful`,
    });
    return resp.data.attributes;
  };

  const onFailure = respOrError => {
    if (respOrError instanceof Response && respOrError.status === 429) {
      const error = new Error('vets_throttled_error_pensions');
      error.extra = parseInt(respOrError.headers.get('x-ratelimit-reset'), 10);

      return Promise.reject(error);
    }
    return Promise.reject(respOrError);
  };

  const sendRequest = async () => {
    // await ensureValidCSRFToken();
    return apiRequest(
      `${environment.API_URL}${apiPath}`,
      apiRequestOptions,
    ).then(onSuccess);
  };

  return sendRequest().catch(async respOrError => {
    // if it's a CSRF error, clear CSRF and retry once
    const errorResponse = respOrError?.errors?.[0];
    if (
      errorResponse?.status === '403' &&
      errorResponse?.detail === 'Invalid Authenticity Token'
    ) {
      localStorage.setItem('csrfToken', '');
      return sendRequest().catch(onFailure);
    }

    // in other cases, handle error regularly
    return onFailure(respOrError);
  });
}
