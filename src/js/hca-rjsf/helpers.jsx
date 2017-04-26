import React from 'react';
import _ from 'lodash/fp';
import { transformForSubmit } from '../common/schemaform/helpers';
import { vaMedicalFacilities } from '../common/utils/options-for-select.js';

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    healthCareApplication: {
      form: formData
    }
  });
}

export function FacilityHelp() {
  return <div>OR <a href="/facilities" target="_blank">Find locations with the VA Facility Locator</a></div>;
}

// Turns the facility list for each state into an array of strings
export const medicalCentersByState = _.mapValues((val) => {
  return val.map(center => center.value);
}, vaMedicalFacilities);

// Merges all the state facilities into one object with values as keys
// and labels as values
export const medicalCenterLabels = Object.keys(vaMedicalFacilities).reduce((labels, state) => {
  const stateLabels = vaMedicalFacilities[state].reduce((centers, center) => {
    return Object.assign(centers, {
      [center.value]: center.label
    });
  }, {});

  return Object.assign(labels, stateLabels);
}, {});

export const dischargeTypeLabels = {
  honorable: 'Honorable',
  general: 'General',
  other: 'Other Than Honorable',
  'bad-conduct': 'Bad Conduct',
  dishonorable: 'Dishonorable',
  undesirable: 'Undesirable'
};

export const lastServiceBranchLabels = {
  'air force': 'Air Force',
  army: 'Army',
  'coast guard': 'Coast Guard',
  'marine corps': 'Marine Corps',
  'merchant seaman': 'Merchant Seaman',
  navy: 'Navy',
  noaa: 'Noaa',
  usphs: 'USPHS',
  'f.commonwealth': 'Filipino Commonwealth Army',
  'f.guerilla': 'Filipino Guerilla Forces',
  'f.scouts new': 'Filipino New Scout',
  'f.scouts old': 'Filipino Old Scout',
  other: 'Other'
};
