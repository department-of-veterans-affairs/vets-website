/* eslint-disable camelcase */
import React from 'react';

import { apiRequest as commonApiClient } from '../../common/helpers/api';
import environment from '../../common/helpers/environment';
import { formatDateShort } from '../../common/utils/helpers';

export function apiRequest(resource, optionalSettings = {}, success, error) {
  const baseUrl = `${environment.API_URL}`;
  const requestUrl = resource[0] === '/'
            ? [baseUrl, resource].join('')
            : resource;

  return commonApiClient(requestUrl, optionalSettings, success, error);
}

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

// Map values returned by vets-api to display text.
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

// Options returned by the benefit summary letter request that should be offered in
// the checkbox list regardless of their values (e.g., true, false, 'unavailable', or other)
// All other options are conditionally displayed, depending on the value
export const optionsToAlwaysDisplay = [
  'hasChapter35Eligibility',
  'hasDeathResultOfDisability',
  'hasServiceConnectedDisabilities',
  'hasSurvivorsIndemnityCompensationAward',
  'hasSurvivorsPensionAward',
  'serviceConnectedPercentage'
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
      veteran: <div>You <strong>have been found entitled</strong> to a Specially Adapted Housing (SAH) and/or Special Home Adaptation (SHA) grant.</div>,
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
      veteran: <div>You <strong>are</strong> being paid at the 100 percent rate because you are unemployable due to your service-connected disabilities.</div>,
      dependent: undefined
    },
    'false': {
      veteran: undefined,
      dependent: undefined
    }
  },
  hasSpecialMonthlyCompensation: {
    'true': {
      veteran: <div>You <strong>are</strong> service-connected for loss of or loss of use of a limb, or you are totally blind in or missing at least one eye.</div>,
      dependent: undefined
    },
    'false': {
      veteran: undefined,
      dependent: undefined
    }
  }
};

export function getBenefitOptionText(option, value, isVeteran) {
  const personType = isVeteran ? 'veteran' : 'dependent';
  let valueString;
  if (value === false) {
    valueString = 'false';
  } else if (value === true) {
    valueString = 'true';
  } else {
    valueString = value;
  }

  if (!['awardEffectiveDate', 'monthlyAwardAmount', 'serviceConnectedPercentage'].includes(option)) {
    return benefitOptionText[option][valueString][personType];
  }
  switch (option) {
    case 'awardEffectiveDate': {
      if (value && value !== 'unavailable') {
        return (<div>The effective date of the last change to your current award was <strong>{formatDateShort(value)}</strong></div>);
      }
      return undefined;
    }

    case 'monthlyAwardAmount': {
      if (value && value !== 'unavailable') {
        return (<div>Your current monthly award amount is <strong>${value}</strong>.</div>);
      }
      return undefined;
    }

    case 'serviceConnectedPercentage': {
      if (value && value !== 'unavailable' && isVeteran) {
        return (<div>Your combined service-connected evaluation is <strong>{value}%</strong>.</div>);
      }
      return undefined;
    }

    default:
      return undefined;
  }
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
  awardEffectiveDate: 'monthlyAward',
  serviceConnectedPercentage: 'serviceConnectedEvaluation',
  militaryService: 'militaryService'
};
