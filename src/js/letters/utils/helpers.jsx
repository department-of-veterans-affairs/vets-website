/* eslint-disable camelcase */
import React from 'react';
import Raven from 'raven-js';

import { apiRequest as commonApiClient } from '../../common/helpers/api';
import environment from '../../common/helpers/environment';
import { formatDateShort } from '../../common/utils/helpers';
import { AVAILABILITY_STATUSES, BENEFIT_OPTIONS, STATE_CODE_TO_NAME } from './constants';

export function apiRequest(resource, optionalSettings = {}, success, error) {
  const baseUrl = `${environment.API_URL}`;
  const requestUrl = resource[0] === '/'
    ? [baseUrl, resource].join('')
    : resource;

  return commonApiClient(requestUrl, optionalSettings, success, error);
}

export const invalidAddressProperty = (
  <div id="invalidAddress">
    <div className="usa-alert usa-alert-error">
      <div className="usa-alert-body">
        <h2 className="usa-alert-heading">Address unavailable</h2>
        <p className="usa-alert-text">
          We’re encountering an error with your address information. This is not required for your letters, but if you’d like to see the address we have on file, or to update it, please visit <a href="/" target="_blank">this link</a>.
        </p>
      </div>
    </div>
  </div>
);

export const addressUpdateUnavailable = (
  <div>
    <div className="usa-alert usa-alert-warning">
      <div className="usa-alert-body">
        <h4 className="usa-alert-heading">Address update unavailable</h4>
        <p className="usa-alert-text">
          We’re sorry. We can’t update your address right now. Your <strong>
          VA letters and documents are still valid</strong> with your old
          address.
        </p>
        <br/>
        <p className="usa-alert-text">
          <strong>Please continue to download your VA letter or document</strong>.
          You can come back later and try again.
        </p>
      </div>
    </div>
  </div>
);

// Map values returned by vets-api to display text.
export const characterOfServiceContent = {
  honorable: 'Honorable',
  other_than_honorable: 'Other than honorable',
  under_honorable_conditions: 'Under honorable conditions',
  general: 'General',
  uncharacterized: 'Uncharacterized',
  uncharacterized_entry_level: 'Uncharacterized entry level',
  dishonorable: 'Dishonorable'
};

// Define jsx for service_verification letter to add alert informing user that
// service_verification letter is being phased out in favor of benefit_summary
// letter
const serviceVerificationLetterContent = (
  <div>
    <div className="usa-alert usa-alert-warning">
      <div className="usa-alert-body">
        <p className="usa-alert-text">
          You can now use the Benefit Summary Letter in place of your Service Verification Letter.
        </p>
      </div>
    </div>
    <p>
      This letter shows your branch of service, date entered on active duty, and date discharged from active duty.
    </p>
  </div>
);

// Commissary letter contains a link so gets its own jsx to correctly display the anchor tag
const commissaryLetterContent = (
  <div>
    If you’re a Veteran with a 100% service-connected disability rating take this letter, a copy of your DD214 or other discharge papers, and your DD2765 to a local military ID and pass office. You can schedule an appointment to get a Retiree Military ID card at the office or use the <a
      target="_blank" href="https://rapids-appointments.dmdc.osd.mil/">Rapid Appointments Scheduler</a>. The Retiree Military ID card gives you access to your local base facilities, including the commissary and post exchange.
  </div>
);

// Map values returned by vets-api to display text.
export const letterContent = {
  commissary: commissaryLetterContent,
  proof_of_service: 'This card shows that you served honorably in the Armed Forces. This card might be useful as proof of status to receive discounts at certain stores or restaurants.',
  medicare_partd: 'You will need this letter as proof that you qualify for Medicare Part D prescription drug coverage.',
  minimum_essential_coverage: 'This letter shows that you have Minimum Essential Coverage (MEC). MEC means that your health plan meets the requirements for health insurance under the Affordable Care Act (ACA). You may also need this letter when you change health insurance plans to show what days you were covered by the plan.',
  service_verification: serviceVerificationLetterContent,
  civil_service: 'This letter shows that you’re a disabled Veteran and you qualify for preference for civil service jobs.',
  benefit_summary: 'This letter can be customized and used for many things, including to verify income and apply for housing assistance, civil service preference jobs, and state or local property or car tax relief.',
  benefit_verification: 'This letter shows the benefits you’re receiving from VA. The letter also shows your benefit gross amount (the amount before anything is taken out) and net amount (the amount after deductions are taken out), your benefit effective date, and your disability rating.'
};

// Options returned by the benefit summary letter request that should be offered in
// the checkbox list regardless of their values (e.g., true, false, 'unavailable', or other)
// All other options are conditionally displayed, depending on the value
export const optionsToAlwaysDisplay = [
  BENEFIT_OPTIONS.hasChapter35Eligibility,
  BENEFIT_OPTIONS.hasDeathResultOfDisability,
  BENEFIT_OPTIONS.hasServiceConnectedDisabilities,
  BENEFIT_OPTIONS.hasSurvivorsIndemnityCompensationAward,
  BENEFIT_OPTIONS.hasSurvivorsPensionAward,
  BENEFIT_OPTIONS.serviceConnectedPercentage
];

const benefitOptionText = {
  hasNonServiceConnectedPension: {
    'true': {
      veteran: <div>You <strong>are</strong> receiving non-service connected pension.</div>,
      dependent: undefined
    },
    'false': {
      veteran: undefined,
      dependent: undefined
    }
  },
  hasServiceConnectedDisabilities: {
    'true': {
      veteran: <div>You <strong>have</strong> one or more service-connected disabilities.</div>,
      dependent: undefined
    },
    'false': {
      veteran: <div>You <strong>do not have</strong> one or more service-connected disabilities.</div>,
      dependent: undefined
    }
  },
  hasSurvivorsIndemnityCompensationAward: {
    'true': {
      veteran: undefined,
      dependent: <div>You <strong>are</strong> receiving Dependency and Indemnity Compensation.</div>
    },
    'false': {
      veteran: undefined,
      dependent: undefined
    }
  },
  hasSurvivorsPensionAward: {
    'true': {
      veteran: undefined,
      dependent: <div>You <strong>are</strong> receiving Survivors Pension.</div>
    },
    'false': {
      veteran: undefined,
      dependent: undefined
    }
  },
  hasAdaptedHousing: {
    'true': {
      veteran: <div>You <strong>qualify</strong> for a Specially Adapted Housing (SAH) and/or a Special Home Adaption (SHA) grant.</div>,
      dependent: undefined
    },
    'false': {
      veteran: undefined,
      dependent: undefined
    }
  },
  hasChapter35Eligibility: {
    'true': {
      veteran: <div>You <strong>are</strong> considered to be totally and permanently disabled solely due to your service-connected disabilities.</div>,
      dependent: <div>The veteran <strong>was</strong> totally and permanently disabled.</div>
    },
    'false': {
      veteran: <div>You <strong>are not</strong> considered to be totally and permanently disabled solely due to your service-connected disabilities.</div>,
      dependent: <div>The veteran <strong>was not</strong> totally and permanently disabled.</div>
    }
  },
  hasDeathResultOfDisability: {
    'true': {
      veteran: undefined,
      dependent: <div>The Veteran died as a result of a service-connected disability.</div>
    },
    'false': {
      veteran: undefined,
      dependent: <div>The Veteran <strong>did not</strong> die as a result of a service-connected disability.</div>
    }
  },
  hasIndividualUnemployabilityGranted: {
    'true': {
      veteran: <div>You <strong>are</strong> being paid at 100% because you’re unemployable due to your service-connected disabilities.</div>,
      dependent: undefined
    },
    'false': {
      veteran: undefined,
      dependent: undefined
    }
  },
  hasSpecialMonthlyCompensation: {
    'true': {
      veteran: <div>You’re receiving special monthly payments due to your service-connected disabilities.</div>,
      dependent: undefined
    },
    'false': {
      veteran: undefined,
      dependent: undefined
    }
  }
};

export function getBenefitOptionText(option, value, isVeteran, awardEffectiveDate) {
  const personType = isVeteran ? 'veteran' : 'dependent';
  let valueString;
  if (value === false) {
    valueString = 'false';
  } else if (value === true) {
    valueString = 'true';
  } else {
    valueString = value;
  }

  const isAvailable = value && value !== AVAILABILITY_STATUSES.unavailable;
  const availableOptions = new Set([BENEFIT_OPTIONS.awardEffectiveDate, BENEFIT_OPTIONS.monthlyAwardAmount, BENEFIT_OPTIONS.serviceConnectedPercentage]);

  if (!availableOptions.has(option)) {
    return benefitOptionText[option][valueString][personType];
  } else if (option === BENEFIT_OPTIONS.monthlyAwardAmount && isAvailable) {
    return (
      <div>
        <div>Your current monthly award is <strong>${value}</strong>.</div>
        <div>The effective date of the last change to your current award was <strong>{formatDateShort(awardEffectiveDate)}</strong>.</div>
      </div>
    );
  } else if (option === BENEFIT_OPTIONS.serviceConnectedPercentage && isAvailable && isVeteran) {
    return (<div>Your combined service-connected rating is <strong>{value}%</strong>.</div>);
  }

  return undefined;
}

// Lookup table to convert the benefit and military service options
// returned by the benefit summary letter response to the expected
// request body options for customizing the benefit summary letter.
export const benefitOptionsMap = {
  hasAdaptedHousing: 'adaptedHousing',
  hasChapter35Eligibility: 'chapter35Eligibility',
  hasDeathResultOfDisability: 'deathResultOfDisability',
  hasIndividualUnemployabilityGranted: 'unemployable',
  hasNonServiceConnectedPension: 'nonServiceConnectedPension',
  hasServiceConnectedDisabilities: 'serviceConnectedDisabilities',
  hasSpecialMonthlyCompensation: 'specialMonthlyCompensation',
  // A given user should only see one of these survivor award options and never both,
  // so both map to the same request body option
  hasSurvivorsIndemnityCompensationAward: 'survivorsAward',
  hasSurvivorsPensionAward: 'survivorsAward',
  monthlyAwardAmount: 'monthlyAward',
  serviceConnectedPercentage: 'serviceConnectedEvaluation',
  militaryService: 'militaryService'
};

export const militaryStateNames = [
  { label: 'Armed Forces Americas (AA)', value: 'AA' },
  { label: 'Armed Forces Europe (AE)', value: 'AE' },
  { label: 'Armed Forces Pacific (AP)', value: 'AP' },
];

export function isDomesticAddress(address) {
  return (address.type === 'DOMESTIC');
}

export function isInternationalAddress(address) {
  return (address.type === 'INTERNATIONAL');
}

export function isMilitaryAddress(address) {
  return (address.type === 'MILITARY');
}

export function getZipCode(address) {
  if (isInternationalAddress(address)) {
    return '';
  }
  const parts = [
    address.zipCode,
    address.zipSuffix ? `-${address.zipSuffix}` : ''
  ];
  return parts.join('');
}

export function getStateName(stateCode) {
  const stateName = STATE_CODE_TO_NAME[stateCode];

  if (stateName === undefined) {
    Raven.captureMessage(`vets_letters_unknown_state_code: ${stateCode}`);
  }

  return stateName || '';
}
