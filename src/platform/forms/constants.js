import { getAppUrl } from '../utilities/registry-helpers';

export const VA_FORM_IDS = Object.freeze({
  FORM_0873: '0873',
  FORM_10182: '10182',
  FORM_10_10CG: '10-10CG',
  FORM_10_7959C: '10-7959C',
  FORM_10_10D: '10-10D',
  FORM_10_10EZ: '1010ez',
  FORM_10_10EZR: '10-10EZR',
  FORM_10_3542: '10-3542',
  FORM_10_7959F_1: '10-7959F-1',
  FORM_20_0995: '20-0995',
  FORM_20_0996: '20-0996',
  FORM_20_10206: '20-10206',
  FORM_20_10207: '20-10207',
  FORM_21_0845: '21-0845',
  FORM_21_0966: '21-0966',
  FORM_21_0972: '21-0972',
  FORM_21_10210: '21-10210',
  FORM_21_4142: '21-4142',
  FORM_21_526EZ: '21-526EZ',
  FORM_21_686C: '686C-674',
  FORM_21P_0847: '21P-0847',
  FORM_21P_527EZ: '21P-527EZ',
  FORM_21P_530: '21P-530V2',
  FORM_22_0993: '22-0993',
  FORM_22_0994: '22-0994',
  FORM_22_1990: '22-1990',
  FORM_22_1990E: '22-1990E',
  FORM_22_1990EMEB: '22-1990EMEB',
  FORM_22_1990EZ: '22-1990EZ',
  FORM_22_1990N: '22-1990N',
  FORM_22_1990S: '22-1990S',
  FORM_22_1995: '22-1995',
  FORM_22_1995S: '22-1995S',
  FORM_22_5490: '22-5490',
  FORM_22_5490E: '22-5490E',
  FORM_22_5495: '22-5495',
  FORM_22_10203: '22-10203',
  FORM_26_4555: '26-4555',
  FORM_28_1900: '28-1900',
  FORM_40_0247: '40-0247',
  FORM_40_10007: '40-10007',
  FEEDBACK_TOOL: 'FEEDBACK-TOOL',
  FORM_VA_2346A: 'MDOT',
  FORM_28_8832: '28-8832',
  FORM_HC_QSTNR: 'HC-QSTNR',
  FORM_COVID_VACCINE_TRIAL: 'COVID-VACCINE-TRIAL',
  FORM_COVID_VACCINE_TRIAL_UPDATE: 'COVID-VACCINE-TRIAL-UPDATE',
  FORM_21_22: '21-22',
  FORM_5655: '5655',
  FORM_COVID_VACCINATION_EXPANSION: 'COVID-VACCINATION-EXPANSION',
  FORM_26_1880: '26-1880',
  FORM_21_22A: '21-22a',
  FORM_XX_123: 'XX-123',
  FORM_MOCK: '00-1234',
  FORM_MOCK_ALT_HEADER: 'FORM_MOCK_ALT_HEADER',
  FORM_MOCK_SF_PATTERNS: 'FORM_MOCK_SF_PATTERNS',
  FORM_MOCK_PATTERNS_V3: 'FORM_MOCK_PATTERNS_V3',
  FORM_MOCK_APPEALS: 'FORM_MOCK_APPEALS',
});

export const VA_FORM_IDS_SKIP_INFLECTION = Object.freeze([
  VA_FORM_IDS.FORM_21_526EZ,
]);

export const VA_FORM_IDS_IN_PROGRESS_FORMS_API = Object.freeze({
  // 526 save-in-progress endpoint that adds an `updatedRatedDisabilities` array
  // to the saved form data from /v0/disability_compensation_in_progress_forms/
  [VA_FORM_IDS.FORM_21_526EZ]: '/v0/disability_compensation_in_progress_forms/',
});

export const FORM_BENEFITS = {
  [VA_FORM_IDS.FORM_10_10D]: 'application for champva benefits',
  [VA_FORM_IDS.FORM_20_10206]: 'personal records request',
  [VA_FORM_IDS.FORM_21_0972]: 'alternate signer',
  [VA_FORM_IDS.FORM_21_10210]: 'lay/witness statement',
  [VA_FORM_IDS.FORM_21_4142]: 'authorization to release medical information',
  [VA_FORM_IDS.FORM_21_526EZ]: 'disability compensation',
  [VA_FORM_IDS.FORM_21P_0847]: 'substitute claimant',
  [VA_FORM_IDS.FORM_21P_527EZ]: 'Veterans pension benefits',
  [VA_FORM_IDS.FORM_21P_530]: 'burial benefits',
  [VA_FORM_IDS.FORM_10_10EZ]: 'health care benefits',
  [VA_FORM_IDS.FORM_22_0993]: 'opt out',
  [VA_FORM_IDS.FORM_22_0994]: 'VET TEC',
  [VA_FORM_IDS.FORM_22_1990]: 'education benefits',
  [VA_FORM_IDS.FORM_22_1990E]: 'education benefits',
  [VA_FORM_IDS.FORM_22_1990EZ]: 'education benefits',
  [VA_FORM_IDS.FORM_22_1990N]: 'education benefits',
  [VA_FORM_IDS.FORM_22_1995]: 'education benefits',
  [VA_FORM_IDS.FORM_22_5490]: 'education benefits',
  [VA_FORM_IDS.FORM_22_5495]: 'education benefits',
  [VA_FORM_IDS.FORM_22_10203]: 'Rogers STEM Scholarship',
  [VA_FORM_IDS.FORM_26_4555]: 'specially adapted housing grant',
  [VA_FORM_IDS.FORM_28_1900]: 'Veteran Readiness and Employment Benefits',
  [VA_FORM_IDS.FORM_40_10007]:
    'pre-need determination of eligibility in a VA national cemetery',
  [VA_FORM_IDS.FEEDBACK_TOOL]: 'feedback',
  [VA_FORM_IDS.FORM_21_686C]: 'dependent status',
  [VA_FORM_IDS.FORM_10182]: 'Board Appeal',
  [VA_FORM_IDS.FORM_20_0995]: 'Supplemental Claim',
  [VA_FORM_IDS.FORM_20_0996]: 'Higher-Level Review',
  [VA_FORM_IDS.FORM_VA_2346A]: 'hearing aid batteries and accessories',
  [VA_FORM_IDS.FORM_5655]: 'financial status report',
};

export const FORM_TITLES = Object.keys(FORM_BENEFITS).reduce((titles, key) => {
  let formNumber;
  if (key === VA_FORM_IDS.FORM_40_10007) {
    formNumber = '';
  } else if (key === VA_FORM_IDS.FORM_10_10EZ) {
    formNumber = ' (10-10EZ)';
  } else if (key === VA_FORM_IDS.FEEDBACK_TOOL) {
    formNumber = ' (GI Bill School Feedback Tool)';
  } else {
    formNumber = ` (${key})`;
  }
  const formTitle = `${FORM_BENEFITS[key]}${formNumber}`;
  titles[key] = formTitle; // eslint-disable-line no-param-reassign
  return titles;
}, {});

export const FORM_DESCRIPTIONS = Object.keys(FORM_BENEFITS).reduce(
  (descriptions, key) => {
    let formNumber;
    if (key === VA_FORM_IDS.FORM_40_10007) {
      formNumber = '';
    } else if (key === VA_FORM_IDS.FORM_10_10EZ) {
      formNumber = '(10-10EZ)';
    } else {
      formNumber = `(${key})`;
    }
    let formDescription = `${FORM_BENEFITS[key]} application ${formNumber}`;
    if (key === VA_FORM_IDS.FORM_VA_2346A) {
      formDescription = `${FORM_BENEFITS[key]} ${formNumber}`;
    }
    return { ...descriptions, [key]: formDescription };
  },
  {},
);

export const getAllFormLinks = getAppUrlImpl => {
  if (!getAppUrlImpl) {
    throw new Error(
      'getAppUrlImpl is required as an argument of getAllFormLinks()',
    );
  }

  return {
    [VA_FORM_IDS.FEEDBACK_TOOL]: `${getAppUrlImpl('feedback-tool')}/`,
    [VA_FORM_IDS.FORM_10_10D]: `${getAppUrlImpl('10-10D')}/`,
    [VA_FORM_IDS.FORM_10_10EZ]: `${getAppUrlImpl('hca')}/`,
    [VA_FORM_IDS.FORM_10182]: `${getAppUrlImpl('10182-board-appeal')}/`,
    [VA_FORM_IDS.FORM_20_0995]: `${getAppUrlImpl('995-supplemental-claim')}/`,
    [VA_FORM_IDS.FORM_20_0996]: `${getAppUrlImpl('0996-higher-level-review')}/`,
    [VA_FORM_IDS.FORM_20_10206]: `${getAppUrlImpl('10206-pa')}/`,
    [VA_FORM_IDS.FORM_21_0972]: `${getAppUrlImpl('21-0972-alternate-signer')}/`,
    [VA_FORM_IDS.FORM_21_10210]: `${getAppUrlImpl(
      '10210-lay-witness-statement',
    )}/`,
    [VA_FORM_IDS.FORM_21_4142]: `${getAppUrlImpl('21-4142-medical-release')}/`,
    [VA_FORM_IDS.FORM_21_526EZ]: `${getAppUrlImpl('526EZ-all-claims')}/`,
    [VA_FORM_IDS.FORM_21_686C]: `${getAppUrlImpl('686C-674')}/`,
    [VA_FORM_IDS.FORM_21P_0847]: `${getAppUrlImpl(
      '21P-0847-substitute-claimant',
    )}/`,
    [VA_FORM_IDS.FORM_21P_527EZ]: `${getAppUrlImpl('pensions')}/`,
    [VA_FORM_IDS.FORM_21P_530]: `${getAppUrlImpl('burials')}/`,
    [VA_FORM_IDS.FORM_22_0993]: `${getAppUrlImpl('0993-edu-benefits')}/`,
    [VA_FORM_IDS.FORM_22_0994]: `${getAppUrlImpl('0994-edu-benefits')}/`,
    [VA_FORM_IDS.FORM_22_1990]: `${getAppUrlImpl('1990-edu-benefits')}/`,
    [VA_FORM_IDS.FORM_22_1990E]: `${getAppUrlImpl('1990e-edu-benefits')}/`,
    [VA_FORM_IDS.FORM_22_1990EZ]: `${getAppUrlImpl('1990ez-edu-benefits')}/`,
    [VA_FORM_IDS.FORM_22_1990N]: `${getAppUrlImpl('1990n-edu-benefits')}/`,
    [VA_FORM_IDS.FORM_22_1995]: `${getAppUrlImpl('1995-edu-benefits')}/`,
    [VA_FORM_IDS.FORM_22_5490]: `${getAppUrlImpl('5490-edu-benefits')}/`,
    [VA_FORM_IDS.FORM_22_5495]: `${getAppUrlImpl('5495-edu-benefits')}/`,
    [VA_FORM_IDS.FORM_22_10203]: `${getAppUrlImpl('10203-edu-benefits')}/`,
    [VA_FORM_IDS.FORM_26_4555]: `${getAppUrlImpl('4555-adapted-housing')}/`,
    [VA_FORM_IDS.FORM_28_1900]: `${getAppUrlImpl('28-1900-chapter-31')}/`,
    [VA_FORM_IDS.FORM_40_10007]: `${getAppUrlImpl('pre-need')}/`,
    [VA_FORM_IDS.FORM_5655]: `${getAppUrlImpl('request-debt-help-form-5655')}/`,
    [VA_FORM_IDS.FORM_VA_2346A]: `${getAppUrlImpl('order-form-2346')}/`,
  };
};

// memoizing so that we don't have to recompute the form links every time
// returns a function that takes a formId and returns a link
export const memoizedGetFormLink = (getAppUrlImpl = getAppUrl) => {
  let cache = {};
  return formId => {
    if (!(formId in cache)) {
      cache = getAllFormLinks(getAppUrlImpl);
    }

    return cache?.[formId] || null;
  };
};

export const TRACKING_PREFIXES = {
  [VA_FORM_IDS.FORM_10_10D]: '10-10D-',
  [VA_FORM_IDS.FORM_20_10206]: 'pa-10206-',
  [VA_FORM_IDS.FORM_21_0972]: '21-0972-alternate-signer-',
  [VA_FORM_IDS.FORM_21_10210]: 'lay-witness-10210-',
  [VA_FORM_IDS.FORM_21_4142]: 'medical-release-4142-',
  [VA_FORM_IDS.FORM_21_526EZ]: 'disability-526EZ-',
  [VA_FORM_IDS.FORM_21P_0847]: '21P-0847-substitute-claimant-',
  [VA_FORM_IDS.FORM_21P_527EZ]: 'pensions-527EZ-',
  [VA_FORM_IDS.FORM_21P_530]: 'burials-530-',
  [VA_FORM_IDS.FORM_10_10EZ]: 'hca-',
  [VA_FORM_IDS.FORM_22_0993]: 'edu-0993-',
  [VA_FORM_IDS.FORM_22_0994]: 'edu-0994-',
  [VA_FORM_IDS.FORM_22_1990]: 'edu-',
  [VA_FORM_IDS.FORM_22_1990E]: 'edu-1990e-',
  [VA_FORM_IDS.FORM_22_1990EZ]: 'edu-1990ez-',
  [VA_FORM_IDS.FORM_22_1990N]: 'edu-1990n-',
  [VA_FORM_IDS.FORM_22_1995]: 'edu-1995-',
  [VA_FORM_IDS.FORM_22_5490]: 'edu-5490-',
  [VA_FORM_IDS.FORM_22_5495]: 'edu-5495-',
  [VA_FORM_IDS.FORM_22_10203]: 'edu-10203-',
  [VA_FORM_IDS.FORM_26_4555]: 'adapted-housing-4555-',
  [VA_FORM_IDS.FORM_40_10007]: 'preneed-',
  [VA_FORM_IDS.FEEDBACK_TOOL]: 'gi_bill_feedback',
  [VA_FORM_IDS.FORM_21_686C]: '686-',
  [VA_FORM_IDS.FORM_10182]: '10182-board-appeal-',
  [VA_FORM_IDS.FORM_20_0995]: '995-supplemental-claim-',
  [VA_FORM_IDS.FORM_20_0996]: 'decision-reviews-va20-0996-',
  [VA_FORM_IDS.FORM_VA_2346A]: 'bam-2346a-',
  [VA_FORM_IDS.FORM_5655]: 'fsr-5655-',
};

export const SIP_ENABLED_FORMS = new Set([
  VA_FORM_IDS.FORM_10_10D,
  VA_FORM_IDS.FORM_10_10EZ,
  VA_FORM_IDS.FORM_20_10206,
  VA_FORM_IDS.FORM_21_0972,
  VA_FORM_IDS.FORM_21_10210,
  VA_FORM_IDS.FORM_21_4142,
  VA_FORM_IDS.FORM_21_686C,
  VA_FORM_IDS.FORM_21_526EZ,
  VA_FORM_IDS.FORM_21P_0847,
  VA_FORM_IDS.FORM_21P_527EZ,
  VA_FORM_IDS.FORM_21P_530,
  VA_FORM_IDS.FORM_22_0993,
  VA_FORM_IDS.FORM_22_0994,
  VA_FORM_IDS.FORM_22_1990,
  VA_FORM_IDS.FORM_22_1990E,
  VA_FORM_IDS.FORM_22_1990EZ,
  VA_FORM_IDS.FORM_22_1990N,
  VA_FORM_IDS.FORM_22_1995,
  VA_FORM_IDS.FORM_22_5490,
  VA_FORM_IDS.FORM_22_5495,
  VA_FORM_IDS.FORM_22_10203,
  VA_FORM_IDS.FORM_26_4555,
  VA_FORM_IDS.FORM_28_1900,
  VA_FORM_IDS.FORM_40_10007,
  VA_FORM_IDS.FEEDBACK_TOOL,
  VA_FORM_IDS.FORM_10182,
  VA_FORM_IDS.FORM_20_0995,
  VA_FORM_IDS.FORM_20_0996,
  VA_FORM_IDS.FORM_VA_2346A,
  VA_FORM_IDS.FORM_5655,
]);
