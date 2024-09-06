const categories = {
  EDUCATION: 'Education',
  EMPLOYMENT: 'Employment',
  MORE_SUPPORT: 'More Support',
  HEALTHCARE: 'Healthcare',
  DISABILITY: 'Disability',
  LIFE_INSURANCE: 'Life Insurance',
  LOAN: 'Loan Guaranty',
};

export const anyType = {
  ANY: 'any',
};

const blankType = {
  BLANK: '',
};

const goalTypes = {
  PROGRESS: 'progressInMyMilitaryCareer',
  PLAN: 'planForMyTransition',
  NETWORK: 'buildMyNetwork',
  JOBS: 'findACivilJob',
  CAREER_PATH: 'setACareerPath',
  BUSINESS: 'startABusiness',
  UNDERSTAND: 'understandMyBenefits',
};

const serviceLengthTypes = {
  UP_TO_90_DAYS: 'upTo90days',
  UP_TO_1_YEAR: 'upTo1yr',
  UP_TO_2_YEARS: 'upTo2yr',
  UP_TO_3_YEARS: 'upTo3yr',
  OVER_3_YEARS: 'over3yr',
};

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

const giBillTypes = {
  APPLIED_AND_RECEIVED: 'appliedAndReceived',
  SUBMITTED: 'submitted',
  STARTED: 'started',
  NOT_APPLIED: 'notApplied',
};

const characterOfDischargeTypes = {
  HONORABLE: 'Honorable',
  UNDER_HONORABLE_CONDITIONS_GENERAL: 'Under Honorable Conditions (General)',
  UNDER_OTHER_THAN_HONORABLE_CONDITIONS:
    'Under Other Than Honorable Conditions',
  BAD_CONDUCT: 'Bad Conduct',
  DISHONORABLE: 'Dishonorable',
  UNCHARACTERIZED: 'Uncharacterized',
  NOT_SURE: "I'm not sure",
};

export const mappingTypes = {
  GOALS: 'checkboxGroupGoals',
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
    name: 'Apply for a GI Bill program [Post 9/11]',
    category: categories.EDUCATION,
    id: 'GP9',
    description:
      'GI Bill benefits help you pay for college, graduate school, and training programs. Since 1944, the GI Bill has helped qualifying Veterans and their family members get money to cover all or some of the costs for school or training.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.PROGRESS,
        goalTypes.CAREER_PATH,
        goalTypes.UNDERSTAND,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [
        serviceLengthTypes.UP_TO_1_YEAR,
        serviceLengthTypes.UP_TO_2_YEARS,
        serviceLengthTypes.UP_TO_3_YEARS,
        serviceLengthTypes.OVER_3_YEARS,
      ],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.HONORABLE,
        blankType.BLANK,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
      [mappingTypes.GI_BILL]: [giBillTypes.NOT_APPLIED],
    },
    learnMoreURL: 'https://www.va.gov/education/about-gi-bill-benefits/',
    applyNowURL: 'https://www.va.gov/education/how-to-apply/',
  },
  {
    name: 'Apply for a GI Bill program [MGIB Active Duty]',
    category: categories.EDUCATION,
    id: 'GBD',
    description:
      'GI Bill benefits help you pay for college, graduate school, and training programs. Since 1944, the GI Bill has helped qualifying Veterans and their family members get money to cover all or some of the costs for school or training.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.PROGRESS,
        goalTypes.CAREER_PATH,
        goalTypes.UNDERSTAND,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [
        serviceLengthTypes.UP_TO_3_YEARS,
        serviceLengthTypes.OVER_3_YEARS,
      ],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.HONORABLE,
        blankType.BLANK,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
      [mappingTypes.GI_BILL]: [giBillTypes.NOT_APPLIED],
    },
    learnMoreURL: 'https://www.va.gov/education/about-gi-bill-benefits/',
    applyNowURL: 'https://www.va.gov/education/how-to-apply/',
  },
  {
    name: 'Apply for a GI Bill program [MGIB Selected Reserve]',
    category: categories.EDUCATION,
    id: 'GSR',
    description:
      'GI Bill benefits help you pay for college, graduate school, and training programs. Since 1944, the GI Bill has helped qualifying Veterans and their family members get money to cover all or some of the costs for school or training.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.PROGRESS,
        goalTypes.CAREER_PATH,
        goalTypes.UNDERSTAND,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.HONORABLE,
        blankType.BLANK,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
      [mappingTypes.GI_BILL]: [giBillTypes.NOT_APPLIED],
    },
    learnMoreURL: 'https://www.va.gov/education/about-gi-bill-benefits/',
    applyNowURL: 'https://www.va.gov/education/how-to-apply/',
  },
  {
    name: 'Apply for Personalized Career Planning and Guidance (PCPG) benefits',
    category: [categories.EDUCATION, categories.EMPLOYMENT],
    id: 'PCG',
    description:
      'Personalized Career Planning and Guidance (PCPG), or VA Chapter 36, offers free educational and career guidance, planning, and resources to Veterans and their dependents who are eligible for a VA education benefit.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.JOBS,
        goalTypes.PROGRESS,
        goalTypes.CAREER_PATH,
        goalTypes.UNDERSTAND,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [
        expectedSparationTypes.WITHIN_3MO,
        expectedSparationTypes.FROM_3_TO_6_MO,
      ],
      [mappingTypes.SEPARATION]: [
        separationTypes.UP_TO_6MO,
        separationTypes.UP_TO_1YR,
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
    learnMoreURL:
      'https://www.va.gov/careers-employment/education-and-career-counseling/',
    applyNowURL:
      'https://www.va.gov/careers-employment/education-and-career-counseling/apply-career-guidance-form-28-8832/',
  },
];
