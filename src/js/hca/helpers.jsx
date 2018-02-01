import React from 'react';
import _ from 'lodash/fp';
import AdditionalInfo from '../common/components/AdditionalInfo';

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

  // add back dependents here, because it could have been removed in filterViewFields
  if (!withoutViewFields.dependents) {
    withoutViewFields = _.set('dependents', [], withoutViewFields);
  }

  const formData = JSON.stringify(withoutViewFields, (key, value) => {
    // Don’t let dependents be removed in the normal empty object clean up
    if (key === 'dependents') {
      return value;
    }

    return stringifyFormReplacer(key, value);
  }) || '{}';

  return JSON.stringify({
    form: formData
  });
}

export const facilityHelp = (
  <div>
    <div>OR <a href="/facilities" target="_blank">Find locations with the VA Facility Locator</a></div>
    <br/>
    If you’re looking for medical care outside the continental U.S. or Guam, you’ll need to sign up for our Foreign Medical Program. <a href="https://www.va.gov/COMMUNITYCARE/programs/veterans/fmp/index.asp" target="_blank">Learn more about the Foreign Medical Program</a>.
    <br/>
    <p>You can also visit <a href="https://www.benefits.va.gov/PERSONA/veteran-abroad.asp" target="_blank">Veterans Living Abroad</a>.</p>
  </div>
);

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
    <p>Please fill this section out to the best of your knowledge. Provide the previous calendar year’s gross annual income for you, your spouse, and your dependents.</p>
    <p><strong>Gross annual income:</strong> This income is from employment only, and doesn’t include income from your farm, ranch, property, or business. When you calculate your gross annual income, include your wages, bonuses, tips, severance pay, and other accrued benefits. Include your dependent’s income information if it could have been used to pay your household expenses.</p>
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

export const expensesGreaterThanIncomeWarning = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <h2 className="usa-alert-heading">Your expenses are higher than or equal to your income.</h2>
      <p className="usa-alert-text">You can stop entering your expenses. We’ll adjust your expenses to be equal to your income. This won’t affect your application or benefits.</p>
    </div>
  </div>
);

export function expensesLessThanIncome(fieldShownUnder) {
  const fields = ['deductibleMedicalExpenses', 'deductibleFuneralExpenses', 'deductibleEducationExpenses'];
  return (formData) => {
    const {
      veteranGrossIncome = 0,
      veteranNetIncome = 0,
      veteranOtherIncome = 0,
      dependents = []
    } = formData;

    const {
      spouseGrossIncome = 0,
      spouseNetIncome = 0,
      spouseOtherIncome = 0
    } = formData['view:spouseIncome'] || {};

    const vetSpouseIncome =
      veteranGrossIncome +
      veteranNetIncome +
      veteranOtherIncome +
      spouseGrossIncome +
      spouseNetIncome +
      spouseOtherIncome;

    const income = dependents.reduce((sum, dependent) => {
      const {
        grossIncome = 0,
        netIncome = 0,
        otherIncome = 0,
      } = dependent;

      return grossIncome + netIncome + otherIncome + sum;
    }, vetSpouseIncome);

    const {
      deductibleMedicalExpenses = 0,
      deductibleFuneralExpenses = 0,
      deductibleEducationExpenses = 0,
    } = formData;

    const expenses =
      deductibleMedicalExpenses +
      deductibleEducationExpenses +
      deductibleFuneralExpenses;

    const hideBasedOnValues = income > expenses;

    // If we're not going to hide based on values entered,
    // then we need to make sure the current field is the last non-empty field
    if (!hideBasedOnValues) {
      const nonEmptyFields = fields.filter(field => formData[field]);
      if (!nonEmptyFields.length || nonEmptyFields[nonEmptyFields.length - 1] !== fieldShownUnder) {
        return true;
      }

      return false;
    }

    return true;
  };
}

export const deductibleExpensesDescription = (
  <div>
    Tell us a bit about your expenses this past calendar year. Enter information for any expenses that apply to you.
    <div className="hca-tooltip-wrapper">
      <AdditionalInfo triggerText="What if my expenses are higher than my annual income?">
        We understand in some cases your expenses might be higher than your income. If your expenses exceed your income, we’ll adjust them to be equal to your income. This won’t affect your application or benefits.
      </AdditionalInfo>
    </div>
  </div>
);
export const isEssentialAcaCoverageDescription = (
  <div>
    I’m enrolling to get minimum essential coverage under the Affordable Care Act.
    <div className="hca-tooltip-wrapper">
      <AdditionalInfo triggerText="Learn more about minimum essential coverage.">
        To avoid the penalty for not having insurance, you must be enrolled in a health plan that qualifies as minimum essential coverage. Being signed up for VA health care meets the minimum essential coverage requirement under the Affordable Care Act.
      </AdditionalInfo>
    </div>
  </div>
);
export const medicaidDescription = (
  <div>
    <div className="hca-tooltip-wrapper">
      <AdditionalInfo triggerText="Learn more about Medicaid.">
        Medicaid is a government health program for eligible low-income individuals and families and people with disabilities.
      </AdditionalInfo>
    </div>
  </div>
);
export const medicarePartADescription = (
  <div>
    <div className="hca-tooltip-wrapper">
      <AdditionalInfo triggerText="Learn more about Medicare Part A insurance.">
        Medicare is a federal health insurance program providing coverage for people who are 65 years or older or who meet who meet special criteria. Part A insurance covers hospital care, skilled nursing and nursing home care, hospice, and home health services.
      </AdditionalInfo>
    </div>
  </div>
);
