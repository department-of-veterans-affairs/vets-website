const categories = {
  EDUCATION: 'Education',
  EMPLOYMENT: 'Careers & Employment',
  MORE_SUPPORT: 'More Support',
  HEALTHCARE: 'Healthcare',
  HOUSING: 'Housing Assistance',
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
  YES: true,
  NO: false,
};

export const goalTypes = Object.freeze({
  FINANCIAL: 'FINANCIAL',
  HOUSING: 'HOUSING',
  FAMILY: 'FAMILY',
  MENTAL: 'MENTAL',
  PHYSICAL: 'PHYSICAL',
  DEGREE: 'DEGREE',
  JOBS: 'JOBS',
  PLAN: 'PLAN',
  CAREER_PATH: 'CAREER_PATH',
  BUSINESS: 'BUSINESS',
  UNDERSTAND: 'UNDERSTAND',
});

export const goalTypeLabels = Object.freeze({
  FINANCIAL: 'Get financial support ',
  HOUSING: 'Find a place to live ',
  FAMILY: 'Grow my family ',
  MENTAL: 'Improve my mental well-being',
  PHYSICAL: 'Improve my physical well-being',
  DEGREE: 'Earn a degree or certificate',
  JOBS: 'Find a civilian job',
  PLAN: 'Plan for my transition',
  CAREER_PATH: 'Set a career path',
  BUSINESS: 'Start a business',
  UNDERSTAND: 'Understand my benefits',
});

export const militaryServiceTimeServedLabels = Object.freeze({
  UP_TO_3_MONTHS: '0 to 3 months',
  UP_TO_6_MONTHS: '4 to 6 months',
  UP_TO_1_YEAR: '7 months to 1 year',
  UP_TO_2_YEARS: '1 to 2 years',
  UP_TO_3_YEARS: '2 to 3 years',
  OVER_3_YEARS: '3+ years',
});

export const militaryServiceTimeServedTypes = Object.freeze({
  UP_TO_3_MONTHS: 'UP_TO_3_MONTHS',
  UP_TO_6_MONTHS: 'UP_TO_6_MONTHS',
  UP_TO_1_YEAR: 'UP_TO_1_YEAR',
  UP_TO_2_YEARS: 'UP_TO_2_YEARS',
  UP_TO_3_YEARS: 'UP_TO_3_YEARS',
  OVER_3_YEARS: 'OVER_3_YEARS',
});

export const expectedSeparationLabels = Object.freeze({
  UP_TO_3_MONTHS: '0 to 3 months',
  MORE_THAN_3_MONTHS_LESS_THAN_6_MONTHS: '4 to 6 months',
  MORE_THAN_6_MONTHS_LESS_THAN_1_YEAR: '7 months to 1 year',
  MORE_THAN_1_YEAR: '1+ year',
});

export const expectedSeparationTypes = Object.freeze({
  UP_TO_3_MONTHS: 'UP_TO_3_MONTHS',
  MORE_THAN_3_MONTHS_LESS_THAN_6_MONTHS:
    'MORE_THAN_3_MONTHS_LESS_THAN_6_MONTHS',
  MORE_THAN_6_MONTHS_LESS_THAN_1_YEAR: 'MORE_THAN_6_MONTHS_LESS_THAN_1_YEAR',
  MORE_THAN_1_YEAR: 'MORE_THAN_1_YEAR',
});

export const separationTypes = Object.freeze({
  UP_TO_3_MONTHS: 'UP_TO_3_MONTHS',
  UP_TO_6_MONTHS: 'UP_TO_6_MONTHS',
  UP_TO_1_YEAR: 'UP_TO_1_YEAR',
  UP_TO_2_YEARS: 'UP_TO_2_YEARS',
  UP_TO_3_YEARS: 'UP_TO_3_YEARS',
  OVER_3_YEARS: 'OVER_3_YEARS',
});

export const separationTypeLabels = Object.freeze({
  UP_TO_3_MONTHS: '0 to 3 months',
  UP_TO_6_MONTHS: '4 to 6 months',
  UP_TO_1_YEAR: '7 months to 1 year',
  UP_TO_2_YEARS: '1 to 2 years',
  UP_TO_3_YEARS: '2 to 3 years',
  OVER_3_YEARS: '3+ years',
});

export const disabilityTypes = Object.freeze({
  APPLIED_AND_RECEIVED: 'APPLIED_AND_RECEIVED',
  SUBMITTED: 'SUBMITTED',
  STARTED: 'STARTED',
  NOT_APPLIED: 'NOT_APPLIED',
});

export const disabilityTypeLabels = Object.freeze({
  APPLIED_AND_RECEIVED: "I've applied and received a disability rating.",
  SUBMITTED: "I've submitted but haven't received a rating yet.",
  STARTED: "I've started the process but haven't submitted yet.",
  NOT_APPLIED: "I haven't applied for a disability rating.",
});

export const giBillTypes = Object.freeze({
  APPLIED_AND_RECEIVED: 'APPLIED_AND_RECEIVED',
  SUBMITTED: 'SUBMITTED',
  STARTED: 'STARTED',
  NOT_APPLIED: 'NOT_APPLIED',
});

export const giBillTypeLabels = Object.freeze({
  APPLIED_AND_RECEIVED: "I've applied and received GI Bill benefits.",
  SUBMITTED: "I've submitted but haven't received a decision yet.",
  STARTED: "I've started the process but haven't submitted yet.",
  NOT_APPLIED: "I haven't applied for GI Bill benefits.",
});

export const characterOfDischargeTypes = Object.freeze({
  HONORABLE: 'HONORABLE',
  UNDER_HONORABLE_CONDITIONS_GENERAL: 'UNDER_HONORABLE_CONDITIONS_GENERAL',
  UNDER_OTHER_THAN_HONORABLE_CONDITIONS:
    'UNDER_OTHER_THAN_HONORABLE_CONDITIONS',
  BAD_CONDUCT: 'BAD_CONDUCT',
  DISHONORABLE: 'DISHONORABLE',
  UNCHARACTERIZED: 'UNCHARACTERIZED',
  NOT_SURE: 'NOT_SURE',
});

export const characterOfDischargeTypeLabels = Object.freeze({
  HONORABLE: 'Honorable',
  UNDER_HONORABLE_CONDITIONS_GENERAL: 'Under Honorable Conditions (General)',
  UNDER_OTHER_THAN_HONORABLE_CONDITIONS:
    'Under Other Than Honorable Conditions',
  BAD_CONDUCT: 'Bad Conduct',
  DISHONORABLE: 'Dishonorable',
  UNCHARACTERIZED: 'Uncharacterized',
  NOT_SURE: "I'm not sure",
});

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
        expectedSeparationTypes.UP_TO_3_MONTHS,
        expectedSeparationTypes.MORE_THAN_3_MONTHS_LESS_THAN_6_MONTHS,
        blankType.BLANK,
      ],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [
        separationTypes.UP_TO_6_MONTHS,
        separationTypes.UP_TO_1_YEAR,
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
  {
    name: 'Servicemembers Group Life Insurance (SGLI)',
    category: categories.LIFE_INSURANCE,
    id: 'SGL',
    description:
      "Find out how to convert your SGLI coverage to a Veterans' Group Life Insurance (VGLI) or commercial policy. Learn about other options for coverage if you have service-connected disabilities. In some cases, you must act within 120 days of separation to ensure no lapse in coverage.",
    isTimeSensitive: true,
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
    learnMoreURL: 'https://www.va.gov/life-insurance/options-eligibility/sgli',
    applyNowURL: '',
  },
  {
    name: 'Disability compensation',
    category: categories.DISABILITY,
    id: 'DIS',
    description:
      'VA disability compensation (pay) offers a monthly tax-free payment to Veterans who got sick or injured while serving in the military and to Veterans whose service made an existing condition worse. You may qualify for VA disability benefits for physical conditions (like a chronic illness or injury) and mental health conditions (like PTSD) that developed before, during, or after service. Find out how to apply for and manage the Veterans disability benefits you’ve earned.',
    isTimeSensitive: true,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.FINANCIAL,
        goalTypes.MENTAL,
        goalTypes.PHYSICAL,
        goalTypes.PLAN,
        goalTypes.UNDERSTAND,
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
        characterOfDischargeTypes.BAD_CONDUCT,
        characterOfDischargeTypes.NOT_SURE,
      ],
      [mappingTypes.DISABILITY_RATING]: [
        disabilityTypes.STARTED,
        disabilityTypes.NOT_APPLIED,
      ],
      [mappingTypes.GI_BILL]: [anyType.ANY],
    },
    learnMoreURL: 'https://www.va.gov/disability/',
    applyNowURL:
      'https://www.va.gov/disability/file-disability-claim-form-21-526ez/introduction',
  },
  {
    name: 'VA-backed home loan Certificate of Eligibility',
    category: categories.HOUSING,
    id: 'COE',
    description:
      'VA housing assistance can help Veterans, service members, and their surviving spouses to buy a home or refinance a loan. We also offer benefits and services to help you build, improve, or keep your current home. Find out how to apply for and manage the Veterans housing assistance benefits you’ve earned.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.HOUSING,
        goalTypes.PLAN,
        goalTypes.UNDERSTAND,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [
        militaryServiceTimeServedTypes.UP_TO_6_MONTHS,
        militaryServiceTimeServedTypes.UP_TO_1_YEAR,
        militaryServiceTimeServedTypes.UP_TO_2_YEARS,
        militaryServiceTimeServedTypes.UP_TO_3_YEARS,
        militaryServiceTimeServedTypes.OVER_3_YEARS,
      ],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.HONORABLE,
        characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
        characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
        characterOfDischargeTypes.UNCHARACTERIZED,
        characterOfDischargeTypes.BAD_CONDUCT,
        characterOfDischargeTypes.NOT_SURE,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
      [mappingTypes.GI_BILL]: [anyType.ANY],
    },
    learnMoreURL:
      'https://www.va.gov/housing-assistance/home-loans/eligibility/',
    applyNowURL:
      'https://www.va.gov/housing-assistance/home-loans/how-to-request-coe/',
  },
  {
    name: 'VA health care',
    category: categories.HEALTHCARE,
    id: 'VAH',
    description:
      'With VA health care, you’re covered for regular checkups with your primary care provider and appointments with specialists (like cardiologists, gynecologists, and mental health providers). You can access Veterans health care services like home health and geriatric (elder) care, and you can get medical equipment, prosthetics, and prescriptions. Find out how to apply for and manage the health care benefits you’ve earned.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.FAMILY,
        goalTypes.MENTAL,
        goalTypes.PHYSICAL,
        goalTypes.PLAN,
        goalTypes.UNDERSTAND,
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
        characterOfDischargeTypes.BAD_CONDUCT,
        characterOfDischargeTypes.NOT_SURE,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
      [mappingTypes.GI_BILL]: [anyType.ANY],
    },
    learnMoreURL: 'https://www.va.gov/health-care/',
    applyNowURL: 'https://www.va.gov/health-care/how-to-apply/',
  },
];
