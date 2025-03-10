const categories = {
  BURIALS: 'Burials and memorials',
  EDUCATION: 'Education',
  EMPLOYMENT: 'Careers and Employment',
  MORE_SUPPORT: 'More Support',
  HEALTH_CARE: 'Health Care',
  HOUSING: 'Housing Assistance',
  DISABILITY: 'Disability',
  LIFE_INSURANCE: 'Life Insurance',
  PENSION: 'Pension',
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
  SCHOOL: 'SCHOOL',
  RETIREMENT: 'RETIREMENT',
  CAREER: 'CAREER',
  HEALTH: 'HEALTH',
  UNDERSTAND: 'UNDERSTAND',
  PLAN: 'PLAN',
});

export const goalTypeLabels = Object.freeze({
  FINANCIAL: 'Get financial support for a service-connected condition',
  SCHOOL: 'Go back to school',
  RETIREMENT: 'Plan for my transition or retirement',
  CAREER: 'Start a new career',
  HEALTH: 'Take care of my health and well-being',
  UNDERSTAND: 'Understand my benefits',
  PLAN: "Plan for my and my family's future",
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

export const militaryBranchTypes = Object.freeze({
  AIR_FORCE: 'AIR_FORCE',
  ARMY: 'ARMY',
  COAST_GUARD: 'COAST_GUARD',
  MARINE_CORPS: 'MARINE_CORPS',
  NAVY: 'NAVY',
  SPACE_FORCE: 'SPACE_FORCE',
});

export const militaryBranchTypeLabels = Object.freeze({
  AIR_FORCE: 'Air Force',
  ARMY: 'Army',
  COAST_GUARD: 'Coast Guard',
  MARINE_CORPS: 'Marine Corps',
  NAVY: 'Navy',
  SPACE_FORCE: 'Space Force',
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

// TODO: When PTEMSVT-411 passes staging remove logic in favor of the object with a DENIED key
export const disabilityTypes = Object.freeze({
  APPLIED_AND_RECEIVED: 'APPLIED_AND_RECEIVED',
  DENIED: 'DENIED',
  STARTED: 'STARTED',
  NOT_APPLIED: 'NOT_APPLIED',
});

export const disabilityTypeLabels = Object.freeze({
  APPLIED_AND_RECEIVED: "I've filed a disability claim and received a rating.",
  DENIED: "I've filed a disability claim, but my claim was denied.",
  STARTED: "I've filed a disability claim, but haven't received a rating yet.",
  NOT_APPLIED: "I haven't filed a disability claim.",
});

export const characterOfDischargeTypes = Object.freeze({
  HONORABLE: 'HONORABLE',
  UNDER_HONORABLE_CONDITIONS_GENERAL: 'UNDER_HONORABLE_CONDITIONS_GENERAL',
  UNDER_OTHER_THAN_HONORABLE_CONDITIONS:
    'UNDER_OTHER_THAN_HONORABLE_CONDITIONS',
  BAD_CONDUCT: 'BAD_CONDUCT',
  DISHONORABLE: 'DISHONORABLE',
  UNCHARACTERIZED: 'UNCHARACTERIZED',
  STILL_SERVING: 'STILL_SERVING',
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
  STILL_SERVING: "I'm still serving",
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
};

export const BENEFITS_LIST = [
  {
    name: 'GI Bill benefits',
    category: categories.EDUCATION,
    id: 'GIB',
    description:
      "If you're a Veteran and you meet certain requirements, GI Bill benefits can help you pay for school and cover expenses while you’re training for a job.",
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.UNDERSTAND, goalTypes.SCHOOL],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.HONORABLE,
        characterOfDischargeTypes.STILL_SERVING,
        blankType.BLANK,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL: 'https://www.va.gov/education/about-gi-bill-benefits/',
    applyNowURL: 'https://www.va.gov/education/how-to-apply/',
  },
  {
    name: 'DOD SkillBridge program',
    category: categories.EMPLOYMENT,
    id: 'SBP',
    description:
      "If you're a service member in your last 180 days of service, the DOD Skillbridge program can help you gain valuable civilian work experience through specific industry training, apprenticeships, or internships.",
    isTimeSensitive: true,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.RETIREMENT,
        goalTypes.CAREER,
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
        characterOfDischargeTypes.STILL_SERVING,
        blankType.BLANK,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL: 'https://skillbridge.osd.mil/program-overview.htm',
    applyNowURL: '',
  },
  {
    name: 'Educational and career counseling (Chapter 36)',
    category: categories.EMPLOYMENT,
    id: 'ECC',
    description:
      'If you’re leaving active service soon or have been discharged within the past year, you can apply for free educational and career guidance, planning, and resources.',
    isTimeSensitive: true,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.SCHOOL,
        goalTypes.CAREER,
        goalTypes.RETIREMENT,
        goalTypes.UNDERSTAND,
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
        characterOfDischargeTypes.STILL_SERVING,
        blankType.BLANK,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
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
    name: "Veterans' Preference in federal hiring",
    category: categories.EMPLOYMENT,
    id: 'FHV',
    description:
      "Veterans' Preference gives eligible Veterans preference over other applicants in federal hiring. If you're a Veteran or transitioning service member, learn about the federal hiring process and get resources to help you find a career in the federal government.",
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.RETIREMENT,
        goalTypes.CAREER,
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
        characterOfDischargeTypes.STILL_SERVING,
        blankType.BLANK,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL: 'https://www.opm.gov/fedshirevets/',
    applyNowURL: '',
  },
  {
    name: 'Support for your Veteran-owned small business',
    category: categories.EMPLOYMENT,
    id: 'SVC',
    description:
      'If you have a Veteran-owned small business, you may qualify for advantages when bidding on government contracts—along with access to other resources and support—through the Veteran Small Business Certification program (VetCert).',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.CAREER, goalTypes.UNDERSTAND],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [anyType.ANY],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
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
      "If you're a transitioning service member, the TAP program provides information, services, and training to help you plan for your transition and meet your post-military goals.",
    isTimeSensitive: true,
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.RETIREMENT, goalTypes.UNDERSTAND],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [yesNoType.YES],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [anyType.ANY],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL: 'https://www.dodtap.mil/dodtap/app/home',
    applyNowURL: '',
  },
  {
    name: 'Veteran Readiness and Employment (Chapter 31)',
    category: categories.EDUCATION,
    id: 'VRE',
    description:
      'If you have a service-connected disability that limits your ability to work or prevents you from working, Veteran Readiness and Employment (VR&E) can help you explore employment options and address education or training needs.',
    isTimeSensitive: true,
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.CAREER, goalTypes.UNDERSTAND],
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
        characterOfDischargeTypes.STILL_SERVING,
        characterOfDischargeTypes.BAD_CONDUCT,
        blankType.BLANK,
      ],
      [mappingTypes.DISABILITY_RATING]: [
        disabilityTypes.APPLIED_AND_RECEIVED,
        disabilityTypes.STARTED,
      ],
    },
    learnMoreURL:
      'https://www.va.gov/careers-employment/vocational-rehabilitation/',
    applyNowURL:
      'https://www.va.gov/careers-employment/vocational-rehabilitation/how-to-apply',
  },
  {
    name: 'VetSuccess on Campus (VSOC)',
    category: categories.EMPLOYMENT,
    id: 'VSC',
    description:
      "If you're a Veteran or service member transitioning from military to college life, VSOC counselors can help you with vocational testing, career counseling, or getting faster access to certain VA benefits while you’re attending college.",
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.SCHOOL,
        goalTypes.CAREER,
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
        characterOfDischargeTypes.STILL_SERVING,
        blankType.BLANK,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL: 'https://www.va.gov/careers-employment/vetsuccess-on-campus/',
    applyNowURL: '',
  },
  {
    name: 'Disability housing grant',
    category: categories.HOUSING,
    id: 'DHS',
    description:
      'We offer housing grants for Veterans and service members with certain service-connected disabilities so they can buy or change a home to meet their needs and live more independently. Changing a home might involve installing ramps or widening doorways. Find out if you’re eligible for a disability housing grant—and how to apply.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.FINANCIAL,
        goalTypes.RETIREMENT,
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
        characterOfDischargeTypes.BAD_CONDUCT,
        characterOfDischargeTypes.UNCHARACTERIZED,
        characterOfDischargeTypes.NOT_SURE,
        characterOfDischargeTypes.STILL_SERVING,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL:
      'https://www.va.gov/housing-assistance/disability-housing-grants/',
    applyNowURL:
      'https://www.va.gov/housing-assistance/disability-housing-grants/how-to-apply/',
  },
  {
    name: 'Veterans Pension',
    category: categories.PENSION,
    id: 'VAP',
    description:
      'The Veterans Pension program provides monthly payments to wartime Veterans who meet certain age or disability requirements, and who have income and net worth within certain limits.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.FINANCIAL,
        goalTypes.RETIREMENT,
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
        characterOfDischargeTypes.BAD_CONDUCT,
        characterOfDischargeTypes.UNCHARACTERIZED,
        characterOfDischargeTypes.NOT_SURE,
        characterOfDischargeTypes.STILL_SERVING,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL: 'https://www.va.gov/pension/eligibility/',
    applyNowURL: 'https://www.va.gov/pension/how-to-apply/',
  },
  {
    name: 'VA mental health services',
    category: categories.HEALTH_CARE,
    id: 'MHC',
    description:
      'Find out how to access VA mental health services for posttraumatic stress disorder (PTSD), psychological effects of military sexual trauma (MST), depression, grief, anxiety, and other needs. You can use some services even if you’re not enrolled in VA health care.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.HEALTH, goalTypes.UNDERSTAND],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.HONORABLE,
        characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
        characterOfDischargeTypes.BAD_CONDUCT,
        characterOfDischargeTypes.UNCHARACTERIZED,
        characterOfDischargeTypes.NOT_SURE,
        characterOfDischargeTypes.STILL_SERVING,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL:
      'https://www.va.gov/health-care/health-needs-conditions/mental-health/',
    applyNowURL: '',
  },
  {
    name: 'Foreign Medical Program',
    category: categories.HEALTH_CARE,
    id: 'FMP',
    description:
      "If you're a Veteran who gets medical care outside the U.S. for a service-connected condition, we may cover the cost of your care. Select Learn More below to find out how the Foreign Medical Program works and how to register.",
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.HEALTH, goalTypes.UNDERSTAND],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.HONORABLE,
        characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
        characterOfDischargeTypes.BAD_CONDUCT,
        characterOfDischargeTypes.UNCHARACTERIZED,
        characterOfDischargeTypes.NOT_SURE,
        characterOfDischargeTypes.STILL_SERVING,
      ],
      [mappingTypes.DISABILITY_RATING]: [
        disabilityTypes.APPLIED_AND_RECEIVED,
        disabilityTypes.STARTED,
      ],
    },
    learnMoreURL: 'https://www.va.gov/health-care/foreign-medical-program/',
    applyNowURL:
      'https://www.va.gov/health-care/foreign-medical-program/register-form-10-7959f-1/introduction',
  },
  {
    name: "Veterans' Group Life Insurance (VGLI)",
    category: categories.LIFE_INSURANCE,
    id: 'VGL',
    description:
      "With Veterans’ Group Life Insurance (VGLI), you may be able to keep your life insurance coverage after you leave the military for as long as you continue to pay the premiums. You can start a new VGLI application or you can convert Servicemembers' Group Life Insurance (SGLI) to VGLI.",
    isTimeSensitive: true,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.RETIREMENT,
        goalTypes.UNDERSTAND,
        goalTypes.PLAN,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [
        separationTypes.UP_TO_3_MONTHS,
        separationTypes.UP_TO_6_MONTHS,
        separationTypes.UP_TO_1_YEAR,
        separationTypes.UP_TO_2_YEARS,
      ],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [anyType.ANY],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL: 'https://www.va.gov/life-insurance/options-eligibility/vgli',
    applyNowURL: '',
  },
  {
    name: 'Veterans Affairs Life Insurance (VALife)',
    category: categories.LIFE_INSURANCE,
    id: 'VAL',
    description:
      "Note: You must already have a VA service-connected disability rating to be approved for Veterans Affairs Life Insurance (VALife). VALife provides low-cost coverage to Veterans with service-connected disabilities. Find out if you're eligible and how to apply.",
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.RETIREMENT,
        goalTypes.UNDERSTAND,
        goalTypes.PLAN,
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
        characterOfDischargeTypes.BAD_CONDUCT,
        characterOfDischargeTypes.NOT_SURE,
        characterOfDischargeTypes.UNCHARACTERIZED,
        characterOfDischargeTypes.STILL_SERVING,
      ],
      [mappingTypes.DISABILITY_RATING]: [
        disabilityTypes.STARTED,
        disabilityTypes.APPLIED_AND_RECEIVED,
      ],
    },
    learnMoreURL:
      'https://www.va.gov/life-insurance/options-eligibility/valife',
    applyNowURL: 'https://insurance.va.gov/VALIFE/Fiduciary/',
  },
  {
    name: 'Disability compensation',
    category: categories.DISABILITY,
    id: 'DIS',
    description:
      'VA disability compensation (pay) offers a monthly tax-free payment to Veterans who got sick or injured while serving in the military and to Veterans whose service made an existing condition worse. You may qualify for VA disability benefits for physical conditions (like a chronic illness or injury) and mental health conditions (like PTSD) that developed before, during, or after service. Find out how to apply for and manage the Veterans disability benefits you’ve earned.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.FINANCIAL,
        goalTypes.RETIREMENT,
        goalTypes.HEALTH,
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
        characterOfDischargeTypes.STILL_SERVING,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL: 'https://www.va.gov/disability/',
    applyNowURL: 'https://www.va.gov/disability/how-to-file-a-claim',
  },
  {
    name: 'VA-backed home loans',
    category: categories.HOUSING,
    id: 'COE',
    description:
      'VA-backed home loans can help Veterans, service members, and their survivors to buy, build, improve, or refinance a home. In most cases, you’ll still need to find a private lender and have sufficient income and credit for the amount you want to borrow. But a VA-backed home loan may offer better terms than with a traditional loan from a private bank, mortgage company, or credit union.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.RETIREMENT, goalTypes.UNDERSTAND],
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
        characterOfDischargeTypes.STILL_SERVING,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL: 'https://www.va.gov/housing-assistance/home-loans/',
    applyNowURL:
      'https://www.va.gov/housing-assistance/home-loans/how-to-request-coe/',
  },
  {
    name: 'VA health care',
    category: categories.HEALTH_CARE,
    id: 'VAH',
    description:
      'With VA health care, you’re covered for regular checkups with your primary care provider and appointments with specialists (like cardiologists, gynecologists, and mental health providers). You can access Veterans health care services like home health and geriatric (elder) care, and you can get medical equipment, prosthetics, and prescriptions. Find out how to apply for and manage the health care benefits you’ve earned.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.RETIREMENT,
        goalTypes.HEALTH,
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
        characterOfDischargeTypes.STILL_SERVING,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL: 'https://www.va.gov/health-care/',
    applyNowURL: 'https://www.va.gov/health-care/how-to-apply/',
  },
  {
    name: 'VA national cemetery burial',
    category: categories.BURIALS,
    id: 'BUR',
    description:
      'Veterans, service members, and some family members may be eligible for burial in a VA national cemetery. Find out if you, or a person you’re planning a burial for, can get this benefit.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.UNDERSTAND],
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
        characterOfDischargeTypes.STILL_SERVING,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL: 'https://www.va.gov/burials-memorials/eligibility/',
    applyNowURL: 'https://www.va.gov/burials-memorials/pre-need-eligibility/',
  },
  {
    name: 'Transfer your GI Bill benefits',
    category: categories.EDUCATION,
    id: 'TGI',
    description:
      'You may be able to transfer your unused Post-9/11 GI Bill benefits to your spouse or dependent children. Learn more about this process and how to request a transfer of benefits.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.SCHOOL, goalTypes.UNDERSTAND],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [yesNoType.YES],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.HONORABLE,
        characterOfDischargeTypes.STILL_SERVING,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL:
      'https://www.va.gov/education/transfer-post-9-11-gi-bill-benefits/',
    applyNowURL: '',
  },
  {
    name: 'Apply for a discharge upgrade',
    category: categories.MORE_SUPPORT,
    id: 'DCU',
    description:
      'Select the learn more link and answer a series of questions to get customized step-by-step instructions on how to apply for a discharge upgrade or correction. If we approve your discharge upgrade, you may be eligible for additional VA benefits.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [anyType.ANY],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
        characterOfDischargeTypes.BAD_CONDUCT,
        characterOfDischargeTypes.DISHONORABLE,
        characterOfDischargeTypes.NOT_SURE,
        characterOfDischargeTypes.STILL_SERVING,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL: 'https://www.va.gov/discharge-upgrade-instructions/',
    applyNowURL: '',
  },
  {
    name: "State Veterans' Benefits",
    category: categories.MORE_SUPPORT,
    id: 'SVB',
    description:
      'Each state has their own list of benefits and resources that they provide at a state level to veterans and their family members. This link contains a listing of VA approved resources outside the Department.',
    isTimeSensitive: false,
    mappings: {
      [mappingTypes.GOALS]: [anyType.ANY],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [anyType.ANY],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL:
      'https://discover.va.gov/external-resources/?_resource_type=state-veterans-affairs-office',
    applyNowURL: '',
  },
];
