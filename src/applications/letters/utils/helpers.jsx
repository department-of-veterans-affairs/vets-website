/* eslint-disable camelcase */
import React from 'react';

import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';
import { apiRequest as commonApiClient } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import { formatDateShort } from 'platform/utilities/date';
import { BENEFIT_OPTIONS, ADDRESS_TYPES, MILITARY_STATES } from './constants';

export function apiRequest(resource, optionalSettings = {}, success, error) {
  const baseUrl = `${environment.API_URL}`;
  const requestUrl =
    resource[0] === '/' ? [baseUrl, resource].join('') : resource;

  return commonApiClient(requestUrl, optionalSettings)
    .then(success)
    .catch(error);
}

export const recordsNotFound = (
  <div id="records-not-found">
    <header>
      <h1>We couldn’t find your VA letters or documents</h1>
    </header>
    <div className="usa-alert usa-alert-warning">
      <div className="usa-alert-body">
        <p className="usa-alert-heading">
          <EbenefitsLink path="ebenefits/download-letters">
            If you’re a dependent, please go to eBenefits to look for your
            letters.
          </EbenefitsLink>
        </p>
      </div>
    </div>
    <h2>Need help?</h2>
    <hr className="divider" />
    <p>
      If you have questions or need help looking up your VA letters and
      documents, please call{' '}
      <a className="letters-phone-nowrap" href="tel:1-800-827-1000">
        800-827-1000
      </a>{' '}
      from 8:00 a.m. to 7:00 pm ET.
    </p>
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
  dishonorable: 'Dishonorable',
};

// Define jsx for service_verification letter to add alert informing user that
// service_verification letter is being phased out in favor of benefit_summary
// letter
const serviceVerificationLetterContent = (
  <div>
    <div className="usa-alert usa-alert-warning">
      <div className="usa-alert-body">
        <p className="usa-alert-text">
          You can now use your Benefit Summary letter instead of this Service
          Verification letter.
        </p>
      </div>
    </div>
    <p>
      This letter shows your branch of service, the date you started active
      duty, and the date you were discharged from active duty.
    </p>
  </div>
);

// Commissary letter contains a link so gets its own jsx to correctly display the anchor tag
const commissaryLetterContent = (
  <div>
    If you’re a Veteran with a 100% service-connected disability rating take
    this letter, a copy of your DD214 or other discharge papers, and your DD2765
    to a local military ID and pass office. You can schedule an appointment to
    get a Retiree Military ID card at the office or use the{' '}
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://rapids-appointments.dmdc.osd.mil/"
    >
      Rapid Appointments Scheduler
    </a>
    . The Retiree Military ID card gives you access to your local base
    facilities, including the commissary and post exchange.
  </div>
);

// Benefit Summary Letter Help Instructions
export const bslHelpInstructions = (
  <div>
    <p>
      If your service period or disability status information is incorrect,
      please send us a message through VA’s{' '}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://iris.custhelp.com/app/ask"
      >
        Inquiry Routing & Information System (IRIS)
      </a>
      . VA will respond within 5 business days.
    </p>
  </div>
);

// Map values returned by vets-api to display text.
export const letterContent = {
  commissary: commissaryLetterContent,
  proof_of_service:
    'This card shows that you served honorably in the Armed Forces. This card might be useful as proof of status to receive discounts at certain stores or restaurants.',
  medicare_partd:
    'You will need this letter as proof that you qualify for Medicare Part D prescription drug coverage.',
  minimum_essential_coverage: (
    <div>
      This letter indicates that you have Minimum Essential Coverage (MEC) as
      provided by VA. MEC means that your health care plan meets the health
      insurance requirements under the Affordable Care Act (ACA). To prove that
      you’re enrolled in the VA health care system, you must have IRS Form
      1095-B from VA to show what months you were covered by a VA health care
      plan. If you’ve lost your IRS Form 1095-B, please call{' '}
      <a href="tel:+18772228387">877-222-8387</a>, Monday &#8211; Friday, 8:00
      a.m. &#8211; 8:00 p.m. ET to request another copy.
    </div>
  ),
  service_verification: serviceVerificationLetterContent,
  civil_service:
    'This letter shows that you’re a disabled Veteran and you qualify for preference for civil service jobs.',
  benefit_summary:
    'This letter can be customized and used for many things, including to verify service history, income, disability status, and more.',
  benefit_verification:
    'This letter shows the benefits you’re receiving from VA. The letter also shows your benefit gross amount (the amount before anything is taken out) and net amount (the amount after deductions are taken out), your benefit effective date, and your disability rating.',
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
  BENEFIT_OPTIONS.serviceConnectedPercentage,
];

const benefitOptionText = {
  hasNonServiceConnectedPension: {
    true: {
      veteran: (
        <div>
          You <strong>are</strong> receiving non-service connected pension.
        </div>
      ),
      dependent: undefined,
    },
    false: {
      veteran: undefined,
      dependent: undefined,
    },
  },
  hasServiceConnectedDisabilities: {
    true: {
      veteran: (
        <div>
          You <strong>have</strong> one or more service-connected disabilities.
        </div>
      ),
      dependent: undefined,
    },
    false: {
      veteran: (
        <div>
          You <strong>don't have</strong> one or more service-connected
          disabilities.
        </div>
      ),
      dependent: undefined,
    },
  },
  hasSurvivorsIndemnityCompensationAward: {
    true: {
      veteran: undefined,
      dependent: (
        <div>
          You <strong>are</strong> receiving Dependency and Indemnity
          Compensation.
        </div>
      ),
    },
    false: {
      veteran: undefined,
      dependent: undefined,
    },
  },
  hasSurvivorsPensionAward: {
    true: {
      veteran: undefined,
      dependent: (
        <div>
          You <strong>are</strong> receiving Survivors Pension.
        </div>
      ),
    },
    false: {
      veteran: undefined,
      dependent: undefined,
    },
  },
  hasAdaptedHousing: {
    true: {
      veteran: (
        <div>
          You <strong>qualify</strong> for a Specially Adapted Housing (SAH)
          and/or a Special Home Adaption (SHA) grant.
        </div>
      ),
      dependent: undefined,
    },
    false: {
      veteran: undefined,
      dependent: undefined,
    },
  },
  hasChapter35Eligibility: {
    true: {
      veteran: (
        <div>
          You <strong>are</strong> considered to be totally and permanently
          disabled solely due to your service-connected disabilities.
        </div>
      ),
      dependent: (
        <div>
          The Veteran <strong>was</strong> totally and permanently disabled.
        </div>
      ),
    },
    false: {
      veteran: (
        <div>
          You <strong>aren't</strong> considered to be totally and permanently
          disabled solely due to your service-connected disabilities.
        </div>
      ),
      dependent: (
        <div>
          The Veteran <strong>wasn't</strong> totally and permanently disabled.
        </div>
      ),
    },
  },
  hasDeathResultOfDisability: {
    true: {
      veteran: undefined,
      dependent: (
        <div>
          The Veteran died as a result of a service-connected disability.
        </div>
      ),
    },
    false: {
      veteran: undefined,
      dependent: (
        <div>
          The Veteran <strong>didn't</strong> die as a result of a
          service-connected disability.
        </div>
      ),
    },
  },
  hasIndividualUnemployabilityGranted: {
    true: {
      veteran: (
        <div>
          You <strong>are</strong> being paid at 100% because you’re
          unemployable due to your service-connected disabilities.
        </div>
      ),
      dependent: undefined,
    },
    false: {
      veteran: undefined,
      dependent: undefined,
    },
  },
  hasSpecialMonthlyCompensation: {
    true: {
      veteran: (
        <div>
          You’re receiving special monthly payments due to your
          service-connected disabilities.
        </div>
      ),
      dependent: undefined,
    },
    false: {
      veteran: undefined,
      dependent: undefined,
    },
  },
};

export function getBenefitOptionText(
  option,
  value,
  isVeteran,
  awardEffectiveDate,
) {
  const personType = isVeteran ? 'veteran' : 'dependent';
  let valueString;
  if (value === false) {
    valueString = 'false';
  } else if (value === true) {
    valueString = 'true';
  } else {
    valueString = value;
  }

  // NOTE: $0 award is a legitimate number for award amounts
  const isAvailable = value === 0 || value;
  const availableOptions = new Set([
    BENEFIT_OPTIONS.awardEffectiveDate,
    BENEFIT_OPTIONS.monthlyAwardAmount,
    BENEFIT_OPTIONS.serviceConnectedPercentage,
  ]);

  if (!availableOptions.has(option)) {
    return benefitOptionText[option][valueString][personType];
  } else if (option === BENEFIT_OPTIONS.monthlyAwardAmount && isAvailable) {
    return (
      <div>
        <div>
          Your current monthly award is <strong>${value}</strong>.
        </div>
        <div>
          The effective date of the last change to your current award was{' '}
          <strong>{formatDateShort(awardEffectiveDate)}</strong>.
        </div>
      </div>
    );
  } else if (
    option === BENEFIT_OPTIONS.serviceConnectedPercentage &&
    isAvailable &&
    isVeteran
  ) {
    return (
      <div>
        Your combined service-connected rating is <strong>{value}%</strong>.
      </div>
    );
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
  militaryService: 'militaryService',
};

/**
 * Infers the address type from the address supplied and returns the address
 *  with the "new" type.
 */
export function inferAddressType(address) {
  let type = ADDRESS_TYPES.domestic;
  if (
    address.countryName !== 'USA' &&
    address.countryName !== 'United States'
  ) {
    type = ADDRESS_TYPES.international;
  } else if (MILITARY_STATES.has(address.stateCode)) {
    type = ADDRESS_TYPES.military;
  }

  return Object.assign({}, address, { type });
}

/**
 * When address the address type changes, we may need to clear out some fields
 *  so validation doesn't fail because we're sending information that's no longer
 *  accurate (compared to what the user sees).
 */
export function resetDisallowedAddressFields(address) {
  const newAddress = Object.assign({}, address);
  // International addresses don't allow state or zip
  if (address.type === ADDRESS_TYPES.international) {
    newAddress.state = '';
    newAddress.zipCode = '';
  }

  return newAddress;
}

/**
 * Tests an http error response for an errors array and status property for the
 * first error in the array. Returns the status code or 'unknown'
 * @param {Object} response error response object from vets-api
 * @returns {string} status code or 'unknown'
 */
export const getStatus = response =>
  response.errors && response.errors.length
    ? response.errors[0].status
    : 'unknown';

// NOTE: It "shouldn't" ever happen...but it did. In production.
export function isAddressEmpty(address) {
  // An address will always have:
  //  type because it errors out on the api if it doesn't exist (pretty sure)
  //  countryName because of toGenericAddress() adds it
  const fieldsToIgnore = ['type', 'countryName'];
  return Object.keys(address || {}).reduce(
    (emptySoFar, nextField) =>
      emptySoFar && (fieldsToIgnore.includes(nextField) || !address[nextField]),
    true,
  );
}
