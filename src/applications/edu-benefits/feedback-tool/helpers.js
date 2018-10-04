import appendQuery from 'append-query';
import Raven from 'raven-js';
import React from 'react';
import fullSchema from 'vets-json-schema/dist/FEEDBACK-TOOL-schema.json';
import { transformForSubmit } from 'us-forms-system/lib/js/helpers';

import dataUtils from '../../../platform/utilities/data/index';
import { apiRequest } from '../../../platform/utilities/api';
import recordEvent from '../../../platform/monitoring/record-event';

import UserInteractionRecorder from '../components/UserInteractionRecorder';

export const trackingPrefix = 'edu-feedback-tool-';

const { get, unset } = dataUtils;
const domesticSchoolAddressFields = get(
  'properties.educationDetails.properties.school.properties.address.anyOf[0].properties',
  fullSchema,
);
const searchToolSchoolAddressFields = get(
  'properties.educationDetails.properties.school.properties.address.anyOf[2].properties',
  fullSchema,
);

// The flags to add to formData that will indicate if a page is prefilled or not
// These flags will be used for each form page's call to
// conditionalPrefillMessage()
export const PREFILL_FLAGS = {
  // if formData.fullName is set:
  APPLICANT_INFORMATION: 'view:applicantInformationWasPrefilled',
  // if formData.serviceBranch or formData.serviceDateRange is set:
  SERVICE_INFORMATION: 'view:serviceInformationWasPrefilled',
  // if formData.address or formData.phone or formData.applicantEmail is set:
  CONTACT_INFORMATION: 'view:contactInformationWasPrefilled',
};

// For a given PREFILL_FLAG, what data needs to exist in the prefilled data for
// that flag to be set to `true`? ie, what prefill data needs to exist for a
// given page to be considered prefilled?
const prefillFlagsToFieldsMap = {
  [PREFILL_FLAGS.APPLICANT_INFORMATION]: ['fullName'],
  [PREFILL_FLAGS.SERVICE_INFORMATION]: ['serviceBranch', 'serviceDateRange'],
  [PREFILL_FLAGS.CONTACT_INFORMATION]: ['address', 'phone', 'applicantEmail'],
};

export function fetchInstitutions({ institutionQuery, page, onDone, onError }) {
  const fetchUrl = appendQuery('/gi/institutions/search', {
    name: institutionQuery,
    include_address: true, // eslint-disable-line camelcase
    page,
  });

  return apiRequest(
    fetchUrl,
    null,
    payload => onDone(payload),
    error => onError(error),
  );
}

// Helper to remove the facility code. Needed if the code was set via the
// search tool and then manual address entry was selected. if this is not
// cleared out the (incorrect) facility code will be sent along with the
// manually entered school address.
export function removeFacilityCodeIfManualEntry(form) {
  if (
    get(
      'data.educationDetails.school.view:searchSchoolSelect.view:manualSchoolEntryChecked',
      form,
    )
  ) {
    return unset(
      'data.educationDetails.school.view:searchSchoolSelect.facilityCode',
      form,
    );
  }
  return form;
}

export function transform(
  formConfig,
  form,
  formTransformer = removeFacilityCodeIfManualEntry,
) {
  const formData = transformForSubmit(formConfig, formTransformer(form), null);
  return JSON.stringify({
    giBillFeedback: {
      form: formData,
    },
  });
}

function checkStatus(guid) {
  const headers = { 'Content-Type': 'application/json' };

  return apiRequest(`/gi_bill_feedbacks/${guid}`, { headers }, null, res => {
    if (res instanceof Error) {
      Raven.captureException(res);
      Raven.captureMessage('vets_gi_bill_feedbacks_poll_client_error');
      recordEvent({ event: `${trackingPrefix}submission-failed` });

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
          recordEvent({ event: `${trackingPrefix}submission-failed` });
          // needs to start with this string to get the right message on the form
          throw new Error(
            `vets_server_error_gi_bill_feedbacks: status ${
              res.data.attributes.state
            }`,
          );
        }
      })
      .catch(onError);
  }, window.VetsGov.pollTimeout || POLLING_INTERVAL);
}

export function submit(form, formConfig) {
  const headers = { 'Content-Type': 'application/json' };
  const body = transform(formConfig, form);
  const apiRequestOptions = {
    method: 'POST',
    headers,
    body,
  };

  const onSuccess = json => {
    const guid = json.data.attributes.guid;
    return new Promise((resolve, reject) => {
      pollStatus(
        guid,
        response => {
          recordEvent({
            event: `${formConfig.trackingPrefix}submission-successful`,
          });
          return resolve(response);
        },
        error => reject(error),
      );
    });
  };

  const onFailure = respOrError => {
    if (respOrError instanceof Response) {
      if (respOrError.status === 429) {
        const error = new Error('vets_throttled_error_gi_bill_feedbacks');
        error.extra = parseInt(
          respOrError.headers.get('x-ratelimit-reset'),
          10,
        );
        recordEvent({ event: `${formConfig.trackingPrefix}submission-failed` });
        return Promise.reject(error);
      }
    }
    return Promise.reject(respOrError);
  };

  return apiRequest(
    '/gi_bill_feedbacks',
    apiRequestOptions,
    onSuccess,
    onFailure,
  );
}

/**
 * The base object all the onBehalfOf tracking event objects extend
 */
const baseOnBehalfOfEventObject = {
  event: `${trackingPrefix}applicant-selection`,
};

/**
 * Map of possible onBehalfOf values and the tracking event object to send to
 * Google Analytics
 */
const applicantRelationshipEventMap = {
  Myself: {
    ...baseOnBehalfOfEventObject,
    completingForm: 'myself',
  },
  'Someone else': {
    ...baseOnBehalfOfEventObject,
    completingForm: 'someone-else',
  },
  Anonymous: {
    ...baseOnBehalfOfEventObject,
    completingForm: 'anonymous',
  },
};

/**
 *
 * @param {*} _ - Object with a formData.onBehalfOf property (from GIBFT
 * form)
 */
export function recordApplicantRelationship({ formData: { onBehalfOf } }) {
  return (
    <UserInteractionRecorder
      eventRecorder={recordEvent}
      selectedValue={onBehalfOf}
      trackingEventMap={applicantRelationshipEventMap}
    />
  );
}

/**
 * Provides an issue example label and description with the provided text
 * @param {string} Label text
 * @param {string} Example text
 */
export const getIssueLabel = (labelText, exampleText) => (
  <div>
    {labelText}
    <br />
    <span>
      <i>{exampleText}</i>
    </span>
  </div>
);

export const transcriptReleaseLabel = getIssueLabel(
  'Release of transcripts',
  'The school won’t release your transcripts.',
);

export const recruitingLabel = getIssueLabel(
  'Recruiting or marketing practices',
  'The school made inaccurate claims about the quality of its education or its school requirements.',
);

export const studentLoansLabel = getIssueLabel(
  'Student loan',
  'The school didn’t provide you total a cost of your school loan.',
);

export const qualityLabel = getIssueLabel(
  'Quality of education',
  'The school doesn’t have qualified teachers.',
);

export const creditTransferLabel = getIssueLabel(
  'Transfer of credits',
  'The school isn’t accredited for transfer of credits.',
);

export const accreditationLabel = getIssueLabel(
  'Accreditation',
  'The school is unable to get or keep accreditation.',
);

export const jobOpportunitiesLabel = getIssueLabel(
  'Post-graduation job opportunity',
  'The school made promises to you about job placement or salary after graduation.',
);

export const gradePolicyLabel = getIssueLabel(
  'Grade policy',
  'The school didn’t give you a copy of its grade policy or it changed its grade policy in the middle of the year.',
);

export const refundIssuesLabel = getIssueLabel(
  'Refund issues',
  'The school won’t refund your GI Bill payment.',
);

export const financialIssuesLabel = getIssueLabel(
  'Financial concern',
  'The school is charging you a higher tuition or extra fees.',
);

export const changeInDegreeLabel = getIssueLabel(
  'Change in degree plan or requirements',
  'The school added new hour or course requirements after you enrolled.',
);

export function issueUIDescription({ formContext }) {
  if (!formContext) {
    // HACK: due to https://github.com/usds/us-forms-system/issues/260
    return (
      <div>
        Please note, below the topics are examples of what the feedback could
        include.
      </div>
    );
  }
  return null;
}

/**
 * Checks the values of an object's properties and completely removes the
 * property if its value is an empty string. Immutable and shallow.
 *
 * @param {Object} obj - the object to strip properties off of
 * @returns {Object} - the object without top-level properties that were empty
 * strings
 */
export function removeEmptyStringProperties(obj) {
  const cleanObject = { ...obj };
  Object.keys(cleanObject).forEach(key => {
    const value = cleanObject[key];
    if (typeof value === 'string' && value.trim() === '') {
      delete cleanObject[key];
    }
  });
  return cleanObject;
}

/*
 * A helper that takes data from the SchoolSelectField back end and transforms
 * it to a valid format as specified by the FEEDBACK-TOOL's
 * educationDetails.school.address schema.
 *
 * @param {*} _ - Object with address fields
 * @returns {Object} An Object that passes the FEEDBACK-TOOL's educationDetails.
 * school.address schema.
 */
export function transformSearchToolAddress({
  address1,
  address2,
  address3,
  city,
  country,
  state,
  zip,
}) {
  const isDomesticAddress = country === 'USA';
  let address = {};
  if (isDomesticAddress) {
    address = {
      country: 'United States',
      street:
        address1 &&
        address1.slice(0, domesticSchoolAddressFields.street.maxLength),
      street2:
        address2 &&
        address2.slice(0, domesticSchoolAddressFields.street2.maxLength),
      street3:
        address3 &&
        address3.slice(0, domesticSchoolAddressFields.street3.maxLength),
      city: city && city.slice(0, domesticSchoolAddressFields.city.maxLength),
      state:
        state && state.slice(0, domesticSchoolAddressFields.state.maxLength),
      postalCode:
        zip && zip.slice(0, domesticSchoolAddressFields.postalCode.maxLength),
    };
  } else {
    address = {
      country,
      street:
        address1 &&
        address1.slice(0, searchToolSchoolAddressFields.street.maxLength),
      street2:
        address2 &&
        address2.slice(0, searchToolSchoolAddressFields.street2.maxLength),
      street3:
        address3 &&
        address3.slice(0, searchToolSchoolAddressFields.street3.maxLength),
      city: city && city.slice(0, searchToolSchoolAddressFields.city.maxLength),
      state:
        state && state.slice(0, searchToolSchoolAddressFields.state.maxLength),
      postalCode:
        zip && zip.slice(0, searchToolSchoolAddressFields.postalCode.maxLength),
    };
  }
  return removeEmptyStringProperties(address);
}

function addPrefilledFlagsToFormData(formData) {
  const newFormData = { ...formData };
  Object.keys(prefillFlagsToFieldsMap).forEach(flag => {
    if (prefillFlagsToFieldsMap[flag].some(field => get(field, formData))) {
      newFormData[flag] = true;
    }
  });
  return newFormData;
}

export function prefillTransformer(pages, formData, metadata) {
  const newFormData = addPrefilledFlagsToFormData(formData);
  return { metadata, formData: newFormData, pages };
}

/**
 * Checks if the `prefillFlag` is set on the `data.formData`. If it is, returns
 * the React Component created by the `messageComponentCreator`
 *
 * @param {string} prefillFlag - The key to look for on the form data
 * @param {Object} data - Data object from form config
 * @param {React Component} messageComponent - The React component to render
 * @returns {React Component|null}
 */
export function conditionallyShowPrefillMessage(
  prefillFlag,
  data,
  messageComponent,
) {
  if (data.formData[prefillFlag]) {
    return messageComponent(data);
  }
  return null;
}

export function validateMatch(field1, field2, fieldType) {
  return function matchValidator(errors, formData) {
    if (formData[field1] !== formData[field2]) {
      errors[field2].addError(`Please ensure your ${fieldType} entries match`);
    }
  };
}
