const categories = {
  EDUCATION: 'Education',
  EMPLOYMENT: 'Careers & Employment',
  MORE_SUPPORT: 'More Support',
  HEALTHCARE: 'Healthcare',
  DISABILITY: 'Disability',
  LIFE_INSURANCE: 'Life Insurance',
  LOAN: 'Loan Guaranty',
};

export const anyType = {
  ANY: 'any',
};

export const blankType = {
  BLANK: '',
};

export const yesNoType = {
  YES: 'yes',
  NO: 'no',
};

const goalTypes = {
  PROGRESS: 'progressInMyMilitaryCareer',
  PLAN: 'planForMyTransition',
  NETWORK: 'buildMyNetwork',
  JOBS: 'findACivilianJob',
  CAREER_PATH: 'setACareerPath',
  BUSINESS: 'startABusiness',
  UNDERSTAND: 'understandMyBenefits',
  DEGREE: 'earnDegreeOrCertificate',
};

// const serviceLengthTypes = {
//   UP_TO_90_DAYS: 'upTo90days',
//   UP_TO_1_YEAR: 'upTo1yr',
//   UP_TO_2_YEARS: 'upTo2yr',
//   UP_TO_3_YEARS: 'upTo3yr',
//   OVER_3_YEARS: 'over3yr',
// };

const separationTypes = {
  UP_TO_6MO: 'upTo6mo',
  UP_TO_1YR: 'upTo1yr',
  UP_TO_2YRS: 'upTo2yr',
  UP_TO_3YRS: 'upTo3yr',
  OVER_3YRS: 'over3yr',
};

const expectedSparationTypes = {
  WITHIN_3MO: 'Within the next 3 months',
  FROM_3_TO_6_MO: 'More than 3 months but less than 6 months',
  FROM_6MO_TO_1YR: 'More than 6 months but less than 1 year',
  OVER_1YR: 'More than 1 year from now',
  OVER_3YRS_AGO: 'More than 3 years ago',
};

const disabilityTypes = {
  APPLIED_AND_RECEIVED: "I've applied and received a disability rating",
  SUBMITTED: "I've submitted but haven't received a rating yet",
  STARTED: "I've started the process but haven't submitted yet",
  NOT_APPLIED: "I haven't applied for a disability rating",
};

const giBillTypes = {
  APPLIED_AND_RECEIVED: "I've applied and received GI Bill benefits",
  SUBMITTED: "I've submitted but haven't received a decision yet",
  STARTED: "I've started the process but haven't submitted yet",
  NOT_APPLIED: "I haven't applied for GI Bill benefits",
};

const characterOfDischargeTypes = {
  HONORABLE: 'honorable',
  UNDER_HONORABLE_CONDITIONS_GENERAL: 'underHonorableConditionsGeneral',
  UNDER_OTHER_THAN_HONORABLE_CONDITIONS: 'underOtherThanHonorableConditions',
  BAD_CONDUCT: 'badConduct',
  DISHONORABLE: 'dishonorable',
  UNCHARACTERIZED: 'uncharacterized',
  NOT_SURE: 'notSure',
};

export const mappingTypes = {
  GOALS: 'goals',
  LENGTH_OF_SERVICE: 'militaryServiceTotalTimeServed',
  CURRENTLY_SERVING: 'militaryServiceCurrentlyServing',
  PREVIOUS_SERVICE: 'militaryServiceCompleted',
  EXPECTED_SEPARATION: 'expectedSeparation',
  SEPARATION: 'separation',
  CHARACTER_OF_DISCHARGE: 'characterOfDischarge',
  DISABILITY_RATING: 'disabilityRating',
  GI_BILL: 'giBillStatus',
};

export const BENEFITS_LIST = [
  {
    name: 'GI Bill',
    category: categories.EDUCATION,
    id: 'GIB',
    description:
      'GI Bill benefits help you pay for college, graduate school, and training programs. Since 1944, the GI Bill has helped qualifying Veterans and their family members get money to cover all or some of the costs for school or training.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.UNDERSTAND, goalTypes.DEGREE],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.HONORABLE,
        blankType.BLANK,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
      [mappingTypes.GI_BILL]: [giBillTypes.STARTED, giBillTypes.NOT_APPLIED],
    },
    learnMoreURL: 'https://www.va.gov/education/about-gi-bill-benefits/',
    applyNowURL: 'https://www.va.gov/education/how-to-apply/',
  },
  {
    name: 'Skillbridge Program',
    category: categories.EMPLOYMENT,
    id: 'SBP',
    description:
      'The DOD SkillBridge program is an opportunity for service members to gain valuable civilian work experience through specific industry training, apprenticeships, or internships during the last 180 days of service. For service members, DOD SkillBridge provides an invaluable chance to work and learn in civilian career areas.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.JOBS,
        goalTypes.CAREER_PATH,
        goalTypes.UNDERSTAND,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [yesNoType.YES],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.HONORABLE,
        characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
        blankType.BLANK,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
      [mappingTypes.GI_BILL]: [anyType.ANY],
    },
    learnMoreURL: 'https://skillbridge.osd.mil/program-overview.htm',
    applyNowURL: '',
  },
  {
    name: 'Educational and career counseling (Chapter 36)',
    category: categories.EMPLOYMENT,
    id: 'ECC',
    description:
      "Get support transitioning to a civilian career with free educational and career counseling. You can use this benefit if you're leaving active service soon, have been discharged within the past year, or are a Veteran or dependent who is eligible for VA education benefits.",
    isTimeSensitive: true,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.JOBS,
        goalTypes.PLAN,
        goalTypes.CAREER_PATH,
        goalTypes.UNDERSTAND,
        goalTypes.DEGREE,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [
        expectedSparationTypes.WITHIN_3MO,
        expectedSparationTypes.FROM_3_TO_6_MO,
        blankType.BLANK,
      ],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [
        separationTypes.UP_TO_6MO,
        separationTypes.UP_TO_1YR,
        blankType.BLANK,
      ],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.HONORABLE,
        characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
        characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
        characterOfDischargeTypes.UNCHARACTERIZED,
        blankType.BLANK,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
      [mappingTypes.GI_BILL]: [anyType.ANY],
    },
    extraConditions: {
      oneIsNotBlank: [
        mappingTypes.EXPECTED_SEPARATION,
        mappingTypes.SEPARATION,
      ],
    },
    learnMoreURL:
      'https://www.va.gov/careers-employment/education-and-career-counseling',
    applyNowURL:
      'https://www.va.gov/careers-employment/education-and-career-counseling/apply-career-guidance-form-25-8832/introduction',
  },
  {
    name: 'Preference for veterans in federal hiring',
    category: categories.EMPLOYMENT,
    id: 'FHV',
    description:
      'The Federal government is committed to helping those who have served in the Armed Forces find rewarding Federal careers. Explore this page to learn more about the Federal hiring process and the career resources and opportunities available to veterans, transitioning service members, and military family members.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.JOBS, goalTypes.UNDERSTAND],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.HONORABLE,
        characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
        blankType.BLANK,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
      [mappingTypes.GI_BILL]: [anyType.ANY],
    },
    extraConditions: {
      dependsOn: [
        {
          field: mappingTypes.CURRENTLY_SERVING,
          value: yesNoType.YES,
          dependsOnField: mappingTypes.PREVIOUS_SERVICE,
          dependsOnValue: yesNoType.YES,
        },
        {
          field: mappingTypes.PREVIOUS_SERVICE,
          value: yesNoType.YES,
          dependsOnField: mappingTypes.CURRENTLY_SERVING,
          dependsOnValue: yesNoType.YES,
        },
      ],
    },
    learnMoreURL: 'https://www.opm.gov/fedshirevets/',
    applyNowURL: '',
  },
  {
    name: 'Support for your Veteran-owned small business',
    category: categories.EMPLOYMENT,
    id: 'SVC',
    description:
      "Veteran-owned small businesses can use this application to be certified by SBA to compete for federal contracts. Certified veteran-owned small businesses will have the opportunity to pursue sole-source and set-aside contracts at the Department of Veterans Affairs under the VA's Vets First program.",
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.BUSINESS, goalTypes.UNDERSTAND],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [anyType.ANY],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
      [mappingTypes.GI_BILL]: [anyType.ANY],
    },
    extraConditions: {
      dependsOn: [
        {
          field: mappingTypes.CURRENTLY_SERVING,
          value: yesNoType.YES,
          dependsOnField: mappingTypes.PREVIOUS_SERVICE,
          dependsOnValue: yesNoType.YES,
        },
        {
          field: mappingTypes.PREVIOUS_SERVICE,
          value: yesNoType.YES,
          dependsOnField: mappingTypes.CURRENTLY_SERVING,
          dependsOnValue: yesNoType.YES,
        },
      ],
    },
    learnMoreURL:
      'https://www.va.gov/careers-employment/veteran-owned-business-support/',
    applyNowURL: '',
  },
  {
    name: 'Transition Assistance Program (TAP)',
    category: categories.MORE_SUPPORT,
    id: 'TAP',
    description:
      'DoD TAP is an outcome-based statutory program (10 USC, Ch. 58) that bolsters opportunities, services, and training for transitioning Service members in their preparation to meet post-military goals.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.PLAN, goalTypes.UNDERSTAND],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [yesNoType.YES],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [anyType.ANY],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
      [mappingTypes.GI_BILL]: [anyType.ANY],
    },
    learnMoreURL: 'https://www.dodtap.mil/dodtap/app/home',
    applyNowURL: '',
  },
  {
    name: 'Veteran Readiness and Employment (Chapter 31)',
    category: categories.EDUCATION,
    id: 'VRE',
    description:
      'If you have a service-connected disability that limits your ability to work or prevents you from working, find out how to apply for VR&E services. You can apply up to 12 years from when you receive your notice of separation or your first VA disability rating.',
    isTimeSensitive: true,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.JOBS,
        goalTypes.CAREER_PATH,
        goalTypes.BUSINESS,
        goalTypes.UNDERSTAND,
        goalTypes.DEGREE,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.HONORABLE,
        characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
        characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
        characterOfDischargeTypes.UNCHARACTERIZED,
        blankType.BLANK,
      ],
      [mappingTypes.DISABILITY_RATING]: [
        disabilityTypes.APPLIED_AND_RECEIVED,
        disabilityTypes.SUBMITTED,
        disabilityTypes.STARTED,
      ],
      [mappingTypes.GI_BILL]: [anyType.ANY],
    },
    learnMoreURL:
      'https://www.va.gov/careers-employment/vocational-rehabilitation/',
    applyNowURL:
      'https://www.va.gov/careers-employment/vocational-rehabilitation/apply-vre-form-28-1900/start',
  },
  {
    name: 'VetSuccess on Campus',
    category: categories.EMPLOYMENT,
    id: 'VSC',
    description:
      'VetSuccess on Campus (VSOC) supports Veterans and service members who are transitioning from military to college life, and certain qualified dependents. We have vocational rehabilitation counselors, called VSOC counselors, at 104 college campuses across the country.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.CAREER_PATH, goalTypes.UNDERSTAND],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.HONORABLE,
        characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
        characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
        characterOfDischargeTypes.UNCHARACTERIZED,
        blankType.BLANK,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
      [mappingTypes.GI_BILL]: [anyType.ANY],
    },
    learnMoreURL: 'https://www.va.gov/careers-employment/vetsuccess-on-campus/',
    applyNowURL: '',
  },
];
