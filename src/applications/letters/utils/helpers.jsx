/* eslint-disable camelcase */
import React from 'react';

// import EbenefitsLink from '@department-of-veterans-affairs/platform-site-wide/ebenefits/containers/EbenefitsLink';
import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';
import { apiRequest as commonApiClient } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { formatDateShort } from 'platform/utilities/date';

import { ADDRESS_TYPES_ALTERNATE } from '@@vap-svc/constants';
import { BENEFIT_OPTIONS } from './constants';

export function LH_MIGRATION__getEntryPoint(topLevelObject, entryPointKeys) {
  if (Object.keys(topLevelObject).length === 0) {
    return {};
  }

  return entryPointKeys.reduce((acc, key) => {
    return acc[key];
  }, topLevelObject);
}

export function LH_MIGRATION__getOptions(shouldUseLighthouse) {
  const migrationOptions = {
    listEndpoint: {
      method: 'GET',
      path: '/v0/letters',
    },
    summaryEndpoint: {
      method: 'GET',
      path: '/v0/letters/beneficiary',
    },
    downloadEndpoint: {
      method: 'POST',
      path: '/v0/letters',
    },
    dataEntryPoint: ['data', 'attributes'],
  };

  if (shouldUseLighthouse) {
    migrationOptions.listEndpoint.path = '/v0/letters_generator';
    migrationOptions.summaryEndpoint.path = '/v0/letters_generator/beneficiary';
    migrationOptions.downloadEndpoint.path = '/v0/letters_generator/download';
    migrationOptions.dataEntryPoint = [];
  }

  return migrationOptions;
}

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
    <p />
    <va-alert status="warning" uswds="false">
      <h2 slot="headline">We couldn’t find your VA letters or documents</h2>
      <p>
        <EbenefitsLink path="ebenefits/download-letters">
          If you’re a dependent, please go to eBenefits to look for your
          letters.
        </EbenefitsLink>
      </p>
    </va-alert>
    <h2>Need help?</h2>
    <hr className="divider" />
    <p>
      If you have questions or need help looking up your VA letters and
      documents, please call <va-telephone contact="8008271000" uswds="false" />
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
  <>
    <va-alert status="warning" uswds="false">
      <p>
        You can now use your Benefit Summary letter instead of this Service
        Verification letter.
      </p>
    </va-alert>
    <p>
      This letter shows your branch of service, the date you started active
      duty, and the date you were discharged from active duty.
    </p>
  </>
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
      please send us a message through
      <a target="_blank" rel="noopener noreferrer" href="https://ask.va.gov/">
        Ask VA
      </a>
      . We will respond within 5 business days.
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
      <va-telephone contact="8772228387" uswds="false" />, Monday through
      Friday, 8:00 a.m. to 8:00 p.m. ET to request another copy.
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
          You <strong>don’t have</strong> one or more service-connected
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
          You <strong>aren’t</strong> considered to be totally and permanently
          disabled solely due to your service-connected disabilities.
        </div>
      ),
      dependent: (
        <div>
          The Veteran <strong>wasn’t</strong> totally and permanently disabled.
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
          The Veteran <strong>didn’t</strong> die as a result of a
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

/**
 * EVSS sets dates to central time (T06:00:00.000+00:00), but adds the timezone
 * offset after the "T" instead of after the "+". So we're going to strip off
 * the time completely, see
 * https://github.com/department-of-veterans-affairs/va.gov-team/issues/29762#issuecomment-920225928
 * @param {String} date - ISO 8601 date format
 * @returns {String} - ISO 8601 date format
 */
export function stripOffTime(date) {
  const [ymd] = (date || '').split('T');
  return ymd || '';
}

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
  }
  if (option === BENEFIT_OPTIONS.monthlyAwardAmount && isAvailable) {
    return (
      <div>
        <div>
          Your current monthly award is <strong>${value}</strong>.
        </div>
        <div>
          The effective date of the last change to your current award was{' '}
          <strong>{formatDateShort(stripOffTime(awardEffectiveDate))}</strong>.
        </div>
      </div>
    );
  }
  if (
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
 * When address the address type changes, we may need to clear out some fields
 *  so validation doesn't fail because we're sending information that's no longer
 *  accurate (compared to what the user sees).
 */
export function resetDisallowedAddressFields(address) {
  const newAddress = { ...address };
  // International addresses don't allow state or zip
  if (address.type === ADDRESS_TYPES_ALTERNATE.international) {
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
export const getStatus = response => {
  return response.errors && response.errors.length
    ? response.errors[0].status
    : 'unknown';
};

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
