import appendQuery from 'append-query';
import Raven from 'raven-js';
import React from 'react';
import fullSchema from 'vets-json-schema/dist/FEEDBACK-TOOL-schema.json';
import { transformForSubmit } from 'us-forms-system/lib/js/helpers';

import dataUtils from '../../../platform/utilities/data/index';
import { apiRequest } from '../../../platform/utilities/api';
import environment from '../../../platform/utilities/environment';
import recordEvent from '../../../platform/monitoring/record-event';
import conditionalStorage from '../../../platform/utilities/storage/conditionalStorage';

import UserInteractionRecorder from '../components/UserInteractionRecorder';

const { get } = dataUtils;
const domesticSchoolAddressFields = get(
  'properties.educationDetails.properties.school.properties.address.anyOf[0].properties',
  fullSchema
);
const searchToolSchoolAddressFields = get(
  'properties.educationDetails.properties.school.properties.address.anyOf[2].properties',
  fullSchema
);

export function fetchInstitutions({ institutionQuery, page, onDone, onError }) {
  const fetchUrl = appendQuery('/gi/institutions/search', {
    name: institutionQuery,
    include_address: true, // eslint-disable-line camelcase
    page
  });

  return apiRequest(
    fetchUrl,
    null,
    payload => onDone(payload),
    error => onError(error));
}

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form, null);
  return JSON.stringify({
    giBillFeedback: {
      form: formData
    }
  });
}

function checkStatus(guid) {
  const userToken = conditionalStorage().getItem('userToken');
  const headers = {
    'Content-Type': 'application/json',
    'X-Key-Inflection': 'camel',
  };

  if (userToken) {
    headers.Authorization = `Token token=${userToken}`;
  }
  return fetch(`${environment.API_URL}/v0/gi_bill_feedbacks/${guid}`, {
    headers
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      return Promise.reject(res);
    }).catch(res => {
      if (res instanceof Error) {
        Raven.captureException(res);
        Raven.captureMessage('vets_gi_bill_feedbacks_poll_client_error');

        // keep polling because we know they submitted earlier
        // and this is likely a network error
        return Promise.resolve();
      }

      // if we get here, it's likely that we hit a server error
      return Promise.reject(res);
    });
}

const POLLING_INTERVAL = 1000;

function pollStatus(guid, onDone, onError) {
  setTimeout(() => {
    checkStatus(guid)
      .then(res => {
        if (!res || res.data.attributes.state === 'pending') {
          pollStatus(guid, onDone, onError);
        } else if (res.data.attributes.state === 'success') {
          onDone(res.data.attributes.parsedResponse);
        } else {
          // needs to start with this string to get the right message on the form
          throw new Error(`vets_server_error_gi_bill_feedbacks: status ${res.data.attributes.state}`);
        }
      })
      .catch(onError);
  }, window.VetsGov.pollTimeout || POLLING_INTERVAL);
}


export function submit(form, formConfig) {
  const userToken = conditionalStorage().getItem('userToken');
  const headers = {
    'Content-Type': 'application/json',
    'X-Key-Inflection': 'camel',
  };

  if (userToken) {
    headers.Authorization = `Token token=${userToken}`;
  }

  const body = transform(formConfig, form);
  return fetch(`${environment.API_URL}/v0/gi_bill_feedbacks`, {
    method: 'POST',
    headers,
    body
  }).then(res => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }).then(json => {
    const guid = json.data.attributes.guid;
    return new Promise((resolve, reject) => {
      pollStatus(guid,
        response => {
          recordEvent({
            event: `${formConfig.trackingPrefix}-submission-successful`,
          });
          return resolve(response);
        }, error => reject(error));
    });
  }).catch(respOrError => {
    if (respOrError instanceof Response) {
      if (respOrError.status === 429) {
        const error = new Error('vets_throttled_error_gi_bill_feedbacks');
        error.extra = parseInt(respOrError.headers.get('x-ratelimit-reset'), 10);

        return Promise.reject(error);
      }
    }
    return Promise.reject(respOrError);
  });
}

/**
 * The base object all the onBehalfOf tracking event objects extend
 */
const baseOnBehalfOfEventObject = {
  event: 'edu-complaint-tool-applicant-selection'
};

/**
 * Map of possible onBehalfOf values and the tracking event object to send to
 * Google Analytics
 */
const applicantRelationshipEventMap = {
  Myself: {
    ...baseOnBehalfOfEventObject,
    completingForm: 'myself'
  },
  'Someone else': {
    ...baseOnBehalfOfEventObject,
    completingForm: 'someone-else'
  },
  Anonymous: {
    ...baseOnBehalfOfEventObject,
    completingForm: 'anonymous'
  },
};

/**
 *
 * @param {*} _ - Object with a formData.onBehalfOf property (from GIBFT
 * form)
 */
export function recordApplicantRelationship({ formData: { onBehalfOf } }) {
  return <UserInteractionRecorder eventRecorder={recordEvent} selectedValue={onBehalfOf} trackingEventMap={applicantRelationshipEventMap}></UserInteractionRecorder>;
}

/**
 * A helper that takes data from the SchoolSelectField back end and transforms
 * it to a valid format as specified by the FEEDBACK-TOOL's
 * educationDetails.school.address schema.
 *
 * @param {*} _ - Object with address fields
 * @returns {Object} An Object that passes the FEEDBACK-TOOL's educationDetails.
 * school.address schema.
 */
export function transformSearchToolAddress({ address1, address2, address3, city, country, state, zip }) {
  const isDomesticAddress = country === 'USA';
  if (isDomesticAddress) {
    return {
      country: 'United States',
      street: address1 && address1.slice(0, domesticSchoolAddressFields.street.maxLength),
      street2: address2 && address2.slice(0, domesticSchoolAddressFields.street2.maxLength),
      street3: address3 && address3.slice(0, domesticSchoolAddressFields.street3.maxLength),
      city: city && city.slice(0, domesticSchoolAddressFields.city.maxLength),
      state: state && state.slice(0, domesticSchoolAddressFields.state.maxLength),
      postalCode: zip && zip.slice(0, domesticSchoolAddressFields.postalCode.maxLength),
    };
  }
  return {
    country,
    street: address1 && address1.slice(0, searchToolSchoolAddressFields.street.maxLength),
    street2: address2 && address2.slice(0, searchToolSchoolAddressFields.street2.maxLength),
    street3: address3 && address3.slice(0, searchToolSchoolAddressFields.street3.maxLength),
    city: city && city.slice(0, searchToolSchoolAddressFields.city.maxLength),
    state: state && state.slice(0, searchToolSchoolAddressFields.state.maxLength),
    postalCode: zip && zip.slice(0, searchToolSchoolAddressFields.postalCode.maxLength),
  };

}

export function validateMatch(field1, field2, fieldType) {
  return function matchValidator(errors, formData) {
    if (formData[field1] !== formData[field2]) {
      errors[field2].addError(`Please ensure your ${fieldType} entries match`);
    }
  };
}
