import React, { useEffect, useState } from 'react';
import * as Sentry from '@sentry/browser';
import moment from 'moment';

import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { apiRequest } from 'platform/utilities/api';

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

function transformCountryCode(countryCode) {
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
      // this is ugly but the address schema helper within the forms system coerces all country codes back to alpha 3
      form: formData,
    },
    // can’t use toISOString because we need the offset
    localTime: moment().format('Y-MM-DD[T]kk:mm:ssZZ'),
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
export const serviceRecordNotification = (
  <div className="usa-alert usa-alert-warning background-color-only">
    <span>
      <strong>Note:</strong> If you would rather upload a DD214 than enter dates
      here, you can do that later in the form.
    </span>
  </div>
);

export const serviceRecordWarning = (
  <div className="usa-alert usa-alert-warning background-color-only">
    <span>
      <strong>Note:</strong> If you chose to upload a DD214 instead of recording
      service periods, you can do that here
    </span>
  </div>
);

export const transportationWarning = (
  <div
    className="usa-alert usa-alert-warning background-color-only"
    aria-live="polite"
  >
    <span>
      <strong>Note:</strong> At the end of the application, you will be asked to
      upload documentation for the expenses you incurred for transporting the
      Veteran’s remains.
    </span>
  </div>
);

export const BurialDateWarning = () => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // NOTE: If we don't wait at least 900ms to render,
    // the alert content gets overspoken by the year content
    // when using a Screen Reader.
    // Using 1000ms to give a bit of padding
    const timeout = setTimeout(() => setShouldRender(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div aria-live="polite">
      {shouldRender && (
        <va-alert background-only show-icon status="warning" uswds="false">
          <span className="sr-only">Warning:</span>
          <p className="vads-u-margin-top--0">
            If filing for a non-service-connected allowance, the Veteran’s
            burial date must be no more than 2 years from the current date.
          </p>
          <a href="/burials-memorials/eligibility/" target="_blank">
            Find out if you still qualify for a non-service-connected allowance
            (opens in new tab)
          </a>
        </va-alert>
      )}
    </div>
  );
};

export function fileHelp({ formContext }) {
  if (formContext.reviewMode) {
    return <p />;
  }

  return (
    <p>
      Files we accept: pdf, jpg, png
      <br />
      Maximum file size: 20MB
    </p>
  );
}
