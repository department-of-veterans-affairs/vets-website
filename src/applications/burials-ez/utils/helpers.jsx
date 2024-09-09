import React from 'react';
import * as Sentry from '@sentry/browser';

import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { checkboxGroupSchema } from 'platform/forms-system/src/js/web-component-patterns';
import { apiRequest } from 'platform/utilities/api';
import { formatISO } from 'date-fns';

function checkStatus(guid) {
  const headers = { 'Content-Type': 'application/json' };

  return apiRequest(`/burial_claims/${guid}`, {
    headers,
    mode: 'cors',
  }).catch(res => {
    if (res instanceof Error) {
      Sentry.captureException(res);
      Sentry.captureMessage('vets_burial_poll_client_error');

      // keep polling because we know they submitted earlier
      // and this is likely a network error
      return Promise.resolve();
    }

    // if we get here, it's likely that we hit a server error
    return Promise.reject(res);
  });
}

const POLLING_INTERVAL = 1000;

function pollStatus(
  { guid, confirmationNumber, regionalOffice },
  onDone,
  onError,
) {
  setTimeout(() => {
    checkStatus(guid)
      .then(res => {
        if (!res || res.data.attributes.state === 'pending') {
          pollStatus(
            { guid, confirmationNumber, regionalOffice },
            onDone,
            onError,
          );
        } else if (res.data.attributes.state === 'success') {
          const response = res.data.attributes.response || {
            confirmationNumber,
            regionalOffice,
          };
          onDone(response);
        } else {
          // needs to start with this string to get the right message on the form
          throw new Error(
            `vets_server_error_burial: status ${res.data.attributes.state}`,
          );
        }
      })
      .catch(onError);
  }, window.VetsGov.pollTimeout || POLLING_INTERVAL);
}

export function transformCountryCode(countryCode) {
  switch (countryCode) {
    case 'USA':
      return 'US';
    case 'MEX':
      return 'MX';
    case 'CAN':
      return 'CA';
    default:
      return countryCode;
  }
}

export function transform(formConfig, form) {
  const localTime = formatISO(new Date());
  const correctedForm = {
    ...form,
    data: {
      ...form?.data,
      claimantAddress: {
        ...form?.data?.claimantAddress,
        country: transformCountryCode(form?.data?.claimantAddress?.country),
      },
    },
  };
  const formData = transformForSubmit(formConfig, correctedForm);
  return JSON.stringify({
    burialClaim: {
      form: formData,
    },
    localTime,
  });
}

export function submit(form, formConfig) {
  const headers = { 'Content-Type': 'application/json' };

  const body = transform(formConfig, form);
  const apiRequestOptions = {
    headers,
    body,
    method: 'POST',
    mode: 'cors',
  };

  const onSuccess = resp => {
    const { guid, confirmationNumber, regionalOffice } = resp.data.attributes;
    return new Promise((resolve, reject) => {
      pollStatus(
        { guid, confirmationNumber, regionalOffice },
        response => {
          window.dataLayer.push({
            event: `${formConfig.trackingPrefix}-submission-successful`,
          });
          return resolve(response);
        },
        error => reject(error),
      );
    });
  };

  const onFailure = respOrError => {
    if (respOrError instanceof Response && respOrError.status === 429) {
      const error = new Error('vets_throttled_error_burial');
      error.extra = parseInt(respOrError.headers.get('x-ratelimit-reset'), 10);

      return Promise.reject(error);
    }
    return Promise.reject(respOrError);
  };

  return apiRequest('/burial_claims', apiRequestOptions)
    .then(onSuccess)
    .catch(onFailure);
}

export const generateTitle = text => {
  return <h3 className="vads-u-margin-top--0 vads-u-color--base">{text}</h3>;
};

export const generateHelpText = (
  text,
  className = 'vads-u-color--gray vads-u-font-size--md',
) => {
  return <span className={className}>{text}</span>;
};

export const checkboxGroupSchemaWithReviewLabels = keys => {
  const schema = checkboxGroupSchema(keys);
  keys.forEach(key => {
    schema.properties[key] = {
      ...schema.properties[key],
      enum: [true, false],
      enumNames: ['Selected', 'Not selected'],
    };
  });
  return schema;
};
