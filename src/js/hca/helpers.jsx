import React from 'react';
import _ from 'lodash/fp';

import {
  stringifyFormReplacer,
  filterViewFields,
  filterInactivePages,
  createFormPageList
} from '../common/schemaform/helpers';
import { getInactivePages } from '../common/utils/helpers';
import { vaMedicalFacilities } from '../common/utils/options-for-select.js';

function changePostalToZip(address) {
  if (address.country === 'USA') {
    const newAddress = _.set('zipcode', address.postalCode, address);
    delete newAddress.postalCode;
    return newAddress;
  }

  return address;
}

export function transform(formConfig, form) {
  let updatedForm = _.set(
    'data.veteranAddress',
    changePostalToZip(form.data.veteranAddress),
    form
  );
  if (_.get('data.view:spouseContactInformation.spouseAddress', form)) {
    updatedForm = _.set(
      'data.view:spouseContactInformation.spouseAddress',
      changePostalToZip(form.data['view:spouseContactInformation'].spouseAddress),
      updatedForm
    );
  }

  const inactivePages = getInactivePages(createFormPageList(formConfig), updatedForm.data);
  const withoutInactivePages = filterInactivePages(inactivePages, updatedForm);
  let withoutViewFields = filterViewFields(withoutInactivePages);

  // add back children here, because it could have been removed in filterViewFields
  if (!withoutViewFields.children) {
    withoutViewFields = _.set('children', [], withoutViewFields);
  }

  const formData = JSON.stringify(withoutViewFields, (key, value) => {
    // Don’t let children be removed in the normal empty object clean up
    if (key === 'children') {
      return value;
    }

    return stringifyFormReplacer(key, value);
  }) || '{}';

  return JSON.stringify({
    form: formData
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

export const financialDisclosureText = (
  <div>
    <p>Next, we’ll ask you to provide your financial information from the most recent
    tax year, which we’ll verify with the IRS. We use this information to figure out if you:</p>

    <ol>
      <li>Are eligible for health care even if you don’t have one of the qualifying factors</li>
      <li>Are eligible for added benefits, like reimbusement for travel costs or cost-free medications</li>
      <li>Should be charged for copays or medication</li>
    </ol>

    <div className="usa-alert usa-alert-info">
      <div className="usa-alert-body">
        <span>
          <strong>Note:</strong> You don’t have to provide your financial information. But if you don’t have a qualifying
          eligibility factor, this information is the only other way for us to see if you can get VA
          health care benefits--including added benefits like waived copays.
        </span>
      </div>
    </div>
    <p>Qualifying factors:</p>
    <ul>
      <li>Former Prisoner of War</li>
      <li>Received a Purple Heart</li>
      <li>Recently discharged combat Veteran</li>
      <li>Discharged for a disability that resulted from your service or got worse in the line of duty</li>
      <li>Getting VA service-connected disability compensation</li>
      <li>Getting a VA pension</li>
      <li>Receiving Medicaid benefits</li>
      <li>Served in Vietnam between January 9, 1962, and May 7, 1975</li>
      <li>Served in Southwest Asia during the Gulf War between August 2, 1990, and November 11, 1998</li>
      <li>Served at least 30 days at Camp Lejeune between August 1, 1953, and December 31, 1987</li>
    </ul>

    <div className="input-section">
      <a target="_blank" href="http://www.va.gov/healthbenefits/cost/income_thresholds.asp">Learn more</a> about our income thresholds (also called income limits) and copayments.
    </div>
  </div>
);

export const incomeDescription = (
  <div>
    <p>Please fill this out to the best of your knowledge. Provide the previous calendar year’s gross annual income for you, your spouse, and your dependent children.</p>
    <p><strong>Gross annual income:</strong> This is from employment only, and doesn’t include income from your farm, ranch, property, or business. When you calculate your gross annual income, include your wages, bonuses, tips, severance pay, and other accrued benefits. Include your child’s income information if it could have been used to pay your household expenses.</p>
    <p><strong>Net income:</strong> This is the income from your farm, ranch, property, or business.</p>
    <p><strong>Other income:</strong> This includes retirement and pension income; Social Security Retirement and Social Security Disability income; compensation benefits such as VA disability, unemployment, Workers, and black lung; cash gifts; interest and dividends, including tax exempt earnings and distributions from Individual Retirement Accounts (IRAs) or annuities.</p>
  </div>
);

export const disclosureWarning = (
  <div className="usa-alert usa-alert-info">
    <div className="usa-alert-body">
      <span>If you don’t provide your financial information and you don’t have another qualifying eligibility factor, VA can’t enroll you.</span>
    </div>
  </div>
);

export const resumeMessage = (
  <p>To continue with your saved application when you come back, go to <a href="/health-care/apply/application">Health Care Application Process</a> or add this page to your web browser's bookmark list.</p>
);
