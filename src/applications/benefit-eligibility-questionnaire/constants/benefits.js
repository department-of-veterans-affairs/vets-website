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

const yesNoTypes = {
  YES: 'Yes',
  NO: 'No',
};

const characterOfDischargeTypes = {
  HONORABLE: 'Honorable',
  UNDER_HONORABLE_CONDITIONS_GENERAL: 'Under Honorable Conditions (General)',
  UNDER_HONORABLE_CONDITIONS: 'Under Honorable Conditions',
  DISHONORABLE: 'Dishonorable',
  UNCHARACTERIZED: 'Uncharacterized',
  BAD_CONDUCT: 'Bad Conduct',
  NOT_SURE: "I'm not sure",
};

export const mappingTypes = {
  GOALS: 'checkboxGroupGoals',
  LENGTH_OF_SERVICE: 'militaryServiceTotalTimeServed',
  CURRENTLY_SERVING: 'militaryServiceCurrentlyServing',
  PREVIOUS_SERVICE: 'militaryServiceCompleted',
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
      [mappingTypes.GI_BILL]: [yesNoTypes.NO],
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
      [mappingTypes.GI_BILL]: [yesNoTypes.NO],
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
      [mappingTypes.GI_BILL]: [yesNoTypes.NO],
    },
    learnMoreURL: 'https://www.va.gov/education/about-gi-bill-benefits/',
    applyNowURL: 'https://www.va.gov/education/how-to-apply/',
  },
];
