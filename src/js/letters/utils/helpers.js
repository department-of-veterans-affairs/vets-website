/* eslint-disable camelcase */
import React from 'react';
import merge from 'lodash/fp/merge';

import environment from '../../common/helpers/environment';
import { formatDateShort } from '../../common/utils/helpers';

function isJson(response) {
  const contentType = response.headers.get('content-type');
  return contentType && contentType.indexOf('application/json') !== -1;
}

export function apiRequest(url, optionalSettings = {}, success, error) {
  const requestUrl = `${environment.API_URL}${url}`;

  const defaultSettings = {
    method: 'GET',
    headers: {
      Authorization: `Token token=${sessionStorage.userToken}`,
      'X-Key-Inflection': 'camel',
    }
  };

  const settings = merge(defaultSettings, optionalSettings);

  return fetch(requestUrl, settings)
    .then((response) => {
      if (!response.ok) {
        // Refresh to show login view when requests are unauthorized.
        if (response.status === 401) { return window.location.reload(); }
        return Promise.reject(response);
      } else if (isJson(response)) {
        return response.json();
      }
      return Promise.resolve(response);
    })
    .then(success, error);
}

export const characterOfServiceContent = {
  honorable: 'Honorable',
  other_than_honorable: 'Other than honorable',
  under_honorable_conditions: 'Under honorable conditions',
  general: 'General',
  uncharacterized: 'Uncharacterized',
  uncharacterized_entry_level: 'Uncharacterized entry level',
  dishonorable: 'Dishonorable'
};

export const letterContent = {
  commissary: 'If you\'re a Veteran who is permanently and totally disabled, use this letter to access the commissary on your local base.',
  proof_of_service: 'This card serves as proof of honorable service in the uniformed services and can replace a VA ID card.',
  medicare_partd: 'You will need this letter as proof that you qualify for Medicare Part D prescription drug coverage.',
  minimum_essential_coverage: 'This letter shows that you have Minimum Essential Coverage (MEC). MEC means that your health plan meets the requirements for health insurance under the Affordable Care Act (ACA). You may also need this letter when you change health insurance plans to show what days you were covered by the plan.',
  service_verification: 'This letter shows your branch of service, date entered on active duty, and date discharged from active duty.',
  civil_service: 'You will need this letter to prove you are a disabled Veteran who can get preference for civil service jobs.',
  benefit_summary: 'This letter shows what benefits you\'re receiving from the VA, military service, and disability status. Below, you can choose if you want military service and disability status to be included.',
  benefit_verification: 'This letter shows what benefits you\'re receiving from the VA. It is different from the benefit summary because it includes [x] and does not give you the option to choose what is included in the letter.'
};

export function veteranBenefitSummaryOptionText(currentOption, currentValue) {
  const textForAllOptions = {
    awardEffectiveDate: <div>The effective date of the last change to your current award was <strong>{formatDateShort(currentValue)}</strong></div>,
    hasAdaptedHousing: <div>You <strong>have</strong> been found entitled to a Specially Adapted Housing (SAH) and/or Special Home Adaptation (SHA) grant</div>,
    hasChapter35Eligibility: <div>You <strong>are</strong> considered to be totally and permanently disabled solely due to your service-connected disabilities</div>,
    hasDeathResultOfDisability: <div></div>,
    hasIndividualUnemployabilityGranted: <div>You <strong>are</strong> being paid at the 100 percent rate because you are unemployable due to your service-connected disabilities</div>,
    hasNonServiceConnectedPension: <div>Your non-service connected pension information</div>,
    hasServiceConnectedDisabilities: <div>You have one or more service-connected disabilities</div>,
    hasSpecialMonthlyCompensation: <div>You <strong>are</strong> service-connected for loss of or loss of use of a limb, or you are totally blind in or missing at least one eye</div>,
    hasSurvivorsIndemnityCompensationAward: <div></div>,
    hasSurvivorsPensionAward: <div></div>,
    monthlyAwardAmount: <div>Your current monthly award amount is <strong>${currentValue}</strong></div>,
    serviceConnectedPercentage: <div>Your combined service-connected evaluation is <strong>{currentValue}%</strong></div>,
  };

  return textForAllOptions[currentOption];
}
