import { URLS } from './urls';

export const categories = {
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

export const whenToApplySortOrder = {
  'Up to 2 years before you separate from service': 1,
  'Up to 180 days before you separate from service': 2,
  'Before you separate from service': 3,
  'Up to 180 days before you separate from service or up to 1 year after you separate from service': 4,
  'Up to 1 year and 120 days after you separate from service': 5,
  'Before or after you separate from service': 6,
  'After you separate from service': 7,
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

export const WHEN_TO_APPLY = Object.freeze({
  BEFORE_SEPARATION: 'beforeSeparation',
  AFTER_SEPARATION: 'afterSeparation',
});

export const timeServedLabels = Object.freeze({
  LESS_THAN_4_MONTHS: 'Less than 4 months',
  FOUR_MONTHS_TO_3_YEARS: '4 months to less than 3 years',
  THREE_YEARS_TO_10_YEARS: '3 years to less than 10 years',
  TEN_YEARS_TO_20_YEARS: '10 years to less than 20 years',
  OVER_20_YEARS: '20 or more years',
});

export const timeServedTypes = Object.freeze({
  LESS_THAN_4_MONTHS: 'LESS_THAN_4_MONTHS',
  FOUR_MONTHS_TO_3_YEARS: 'FOUR_MONTHS_TO_3_YEARS',
  THREE_YEARS_TO_10_YEARS: 'THREE_YEARS_TO_10_YEARS',
  TEN_YEARS_TO_20_YEARS: 'TEN_YEARS_TO_20_YEARS',
  OVER_20_YEARS: 'OVER_20_YEARS',
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

export const militaryBranchComponentTypes = Object.freeze({
  ACTIVE_DUTY: 'ACTIVE_DUTY',
  NATIONAL_GUARD_SERVICE: 'NATIONAL_GUARD_SERVICE',
  RESERVE_SERVICE: 'RESERVE_SERVICE',
});

export const militaryBranchComponentTypeLabels = Object.freeze({
  ACTIVE_DUTY: 'Active-duty service',
  NATIONAL_GUARD_SERVICE: 'National Guard service',
  RESERVE_SERVICE: 'Reserve service',
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
  BRANCH_COMPONENT: 'branchComponents',
  LENGTH_OF_TITLE_TEN_SERVICE: 'titleTenTimeServed',
  TITLE_TEN_ACTIVE_DUTY: 'titleTenActiveDuty',
};
export const BENEFITS_LIST = [
  {
    name: 'GI Bill benefits',
    category: categories.EDUCATION,
    id: 'GIB',
    description:
      "Gl Bill benefits can help you pay for school and cover expenses while you're training for a job.",
    whenToApplyDescription: 'Before or after you separate from service',
    whenToApplyNote:
      'If you separated before January 1, 2013, you can use this benefit up to 15 years after separation.',
    whenToApply: [
      WHEN_TO_APPLY.BEFORE_SEPARATION,
      WHEN_TO_APPLY.AFTER_SEPARATION,
    ],
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.UNDERSTAND, goalTypes.SCHOOL],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
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
    learnMoreURL: URLS.GIB_LEARN,
  },
  {
    name: 'DOD SkillBridge program',
    category: categories.EMPLOYMENT,
    id: 'SBP',
    description:
      'The DOD SkillBridge program can help you gain valuable civilian work experience through specific industry training, apprenticeships, or internships.',
    whenToApplyDescription: 'Up to 180 days before you separate from service',
    whenToApply: [WHEN_TO_APPLY.BEFORE_SEPARATION],
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.RETIREMENT,
        goalTypes.CAREER,
        goalTypes.UNDERSTAND,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
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
    learnMoreURL: URLS.DBP_LEARN,
  },
  {
    name: 'Educational and career counseling (Chapter 36)',
    category: categories.EMPLOYMENT,
    id: 'ECC',
    description:
      'You can apply for free educational and career guidance, planning, and resources through the Personalized Career Planning and Guidance (PCPG) program. Your dependents may also be eligible for this benefit.',
    whenToApplyDescription:
      'Up to 180 days before you separate from service or up to 1 year after you separate from service',
    whenToApply: [
      WHEN_TO_APPLY.BEFORE_SEPARATION,
      WHEN_TO_APPLY.AFTER_SEPARATION,
    ],
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.SCHOOL,
        goalTypes.CAREER,
        goalTypes.RETIREMENT,
        goalTypes.UNDERSTAND,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [yesNoType.YES],
      // Any branch component is valid, but NATIONAL_GUARD_SERVICE and RESERVE_SERVICE also require TITLE_TEN_ACTIVE_DUTY to qualify for this benefit.
      // Due to how the benefit eligibility logic currently works, having National_Guard_SERVICE and RESERVE_SERVICE explicitly listed bi-passes TITLE_TEN_ACTIVE_DUTY as a requirement.
      // So, they are not explicitly listed as valid branch components. TITLE_TEN_ACTIVE_DUTY implicity makes them valid options. This true for several benefits.
      [mappingTypes.BRANCH_COMPONENT]: [
        militaryBranchComponentTypes.ACTIVE_DUTY,
      ],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [
        expectedSeparationTypes.UP_TO_3_MONTHS,
        expectedSeparationTypes.MORE_THAN_3_MONTHS_LESS_THAN_6_MONTHS,
      ],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [
        separationTypes.UP_TO_3_MONTHS,
        separationTypes.UP_TO_6_MONTHS,
        separationTypes.UP_TO_1_YEAR,
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
    isQualified: responses => {
      return (
        responses[mappingTypes.GOALS] &&
        (responses[mappingTypes.BRANCH_COMPONENT] ||
          responses[mappingTypes.TITLE_TEN_ACTIVE_DUTY]) &&
        (responses[mappingTypes.EXPECTED_SEPARATION] ||
          responses[mappingTypes.SEPARATION]) &&
        responses[mappingTypes.CHARACTER_OF_DISCHARGE]
      );
    },
    learnMoreURL: URLS.ECC_LEARN,
  },
  {
    name: "Veterans' Preference in federal hiring",
    category: categories.EMPLOYMENT,
    id: 'FHV',
    description:
      'You may be entitled to preference during the hiring process for federal government jobs. You can also get access to other resources to help you find a career in the federal government.',
    whenToApplyDescription: 'After you separate from service',
    whenToApply: [WHEN_TO_APPLY.AFTER_SEPARATION],
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.RETIREMENT,
        goalTypes.CAREER,
        goalTypes.UNDERSTAND,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
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
    learnMoreURL: URLS.FHV_LEARN,
  },
  {
    name: 'Support for your Veteran-owned small business',
    category: categories.EMPLOYMENT,
    id: 'SVC',
    description:
      'If you have a Veteran-owned small business, you may qualify for advantages when bidding on government contracts—along with access to other resources and support—through the Veteran Small Business Certification program (VetCert).',
    whenToApplyDescription: 'After you separate from service',
    whenToApply: [WHEN_TO_APPLY.AFTER_SEPARATION],
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.CAREER, goalTypes.UNDERSTAND],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [anyType.ANY],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL: URLS.SVC_LEARN,
  },
  {
    name: 'Transition Assistance Program (TAP)',
    category: categories.MORE_SUPPORT,
    id: 'TAP',
    description:
      'The TAP program provides information, services, and training to help you plan for your transition and meet your post-military goals.',
    whenToApplyDescription: 'Up to 2 years before you separate from service',
    whenToApply: [WHEN_TO_APPLY.BEFORE_SEPARATION],
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.RETIREMENT, goalTypes.UNDERSTAND],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [yesNoType.YES],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [anyType.ANY],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL: URLS.TAP_LEARN,
  },
  {
    name: 'Veteran Readiness and Employment',
    category: categories.EDUCATION,
    id: 'VRE',
    description:
      'Veteran Readiness and Employment (VR&E) can help you explore employment options. It can also help you with education or training needs. You must have a service-connected disability that limits your ability to work or prevents you from working to be eligible for this program.',
    whenToApplyDescription: 'Before or after you separate from service',
    whenToApply: [
      WHEN_TO_APPLY.BEFORE_SEPARATION,
      WHEN_TO_APPLY.AFTER_SEPARATION,
    ],
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.CAREER, goalTypes.UNDERSTAND],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
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
    learnMoreURL: URLS.VRE_LEARN,
  },
  {
    name: 'VetSuccess on Campus (VSOC)',
    category: categories.EDUCATION,
    id: 'VSC',
    description:
      "If you're transitioning from military to college life, VSOC counselors can help you with vocational testing and career counseling. You can also get faster access to certain VA benefits while you're attending college.",
    whenToApplyDescription: 'Before or after you separate from service',
    whenToApply: [
      WHEN_TO_APPLY.BEFORE_SEPARATION,
      WHEN_TO_APPLY.AFTER_SEPARATION,
    ],
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.SCHOOL,
        goalTypes.CAREER,
        goalTypes.UNDERSTAND,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
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
    learnMoreURL: URLS.VSC_LEARN,
  },
  {
    name: 'Disability housing grant',
    category: categories.HOUSING,
    id: 'DHS',
    description:
      'If you have certain service-connected disabilities, you can apply for a housing grant to help you buy or change a home to meet your needs.',
    whenToApplyDescription: 'Before or after you separate from service',
    whenToApply: [
      WHEN_TO_APPLY.BEFORE_SEPARATION,
      WHEN_TO_APPLY.AFTER_SEPARATION,
    ],
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.FINANCIAL,
        goalTypes.RETIREMENT,
        goalTypes.UNDERSTAND,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
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
    learnMoreURL: URLS.DHS_LEARN,
  },
  {
    name: 'Veterans Pension benefits',
    category: categories.PENSION,
    id: 'VAP',
    description:
      'The Veterans Pension program provides monthly payments to wartime Veterans who meet certain requirements.',
    whenToApplyDescription: 'After you separate from service',
    whenToApply: [WHEN_TO_APPLY.AFTER_SEPARATION],
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.FINANCIAL,
        goalTypes.RETIREMENT,
        goalTypes.UNDERSTAND,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [
        timeServedTypes.FOUR_MONTHS_TO_3_YEARS,
        timeServedTypes.THREE_YEARS_TO_10_YEARS,
        timeServedTypes.TEN_YEARS_TO_20_YEARS,
        timeServedTypes.OVER_20_YEARS,
      ],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [yesNoType.YES],
      // NATIOAL_GUARD_SERVICE and RESERVE_SERVICE are also valid. See note on "Educational and career counseling (Chapter 36)".
      [mappingTypes.BRANCH_COMPONENT]: [
        militaryBranchComponentTypes.ACTIVE_DUTY,
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
    isQualified: responses => {
      return (
        responses[mappingTypes.GOALS] &&
        ((responses[mappingTypes.BRANCH_COMPONENT] &&
          responses[mappingTypes.LENGTH_OF_SERVICE]) ||
          responses[mappingTypes.TITLE_TEN_ACTIVE_DUTY]) &&
        responses[mappingTypes.CHARACTER_OF_DISCHARGE]
      );
    },
    learnMoreURL: URLS.VAP_LEARN,
  },
  {
    name: 'VA mental health services',
    category: categories.HEALTH_CARE,
    id: 'MHC',
    description:
      "You can use VA mental health services for post-traumatic stress disorder (PTSD), psychological effects of military sexual trauma (MST), depression, grief, anxiety, and other needs. You can use some services even if you're not enrolled in VA health care.",
    whenToApplyDescription: 'Before or after you separate from service',
    whenToApply: [
      WHEN_TO_APPLY.BEFORE_SEPARATION,
      WHEN_TO_APPLY.AFTER_SEPARATION,
    ],
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.HEALTH, goalTypes.UNDERSTAND],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.HONORABLE,
        characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
        characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
        characterOfDischargeTypes.BAD_CONDUCT,
        characterOfDischargeTypes.UNCHARACTERIZED,
        characterOfDischargeTypes.NOT_SURE,
        characterOfDischargeTypes.STILL_SERVING,
      ],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL: URLS.MHC_LEARN,
  },
  {
    name: 'Foreign Medical Program',
    category: categories.HEALTH_CARE,
    id: 'FMP',
    description:
      "If you're a Veteran who gets medical care outside the U.S. for a service-connected condition, we may cover the cost of your care.",
    whenToApplyDescription: 'After you separate from service',
    whenToApply: [WHEN_TO_APPLY.AFTER_SEPARATION],
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.HEALTH, goalTypes.UNDERSTAND],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [
        characterOfDischargeTypes.HONORABLE,
        characterOfDischargeTypes.UNDER_HONORABLE_CONDITIONS_GENERAL,
        characterOfDischargeTypes.UNDER_OTHER_THAN_HONORABLE_CONDITIONS,
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
    learnMoreURL: URLS.FMP_LEARN,
  },
  {
    name: "Veterans' Group Life Insurance (VGLI)",
    category: categories.LIFE_INSURANCE,
    id: 'VGL',
    description:
      "With Veterans' Group Life Insurance (VGLI), you may be able to keep your life insurance coverage after you leave the military.",
    whenToApplyDescription:
      'Up to 1 year and 120 days after you separate from service',
    whenToApply: [WHEN_TO_APPLY.AFTER_SEPARATION],
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.RETIREMENT,
        goalTypes.UNDERSTAND,
        goalTypes.PLAN,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
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
    learnMoreURL: URLS.VGL_LEARN,
  },
  {
    name: 'Veterans Affairs Life Insurance (VALife)',
    category: categories.LIFE_INSURANCE,
    id: 'VAL',
    description:
      'VALife provides low-cost coverage to Veterans with service-connected disabilities. You must already have a VA service-connected disability rating to be approved.',
    whenToApplyDescription: 'After you separate from service',
    whenToApply: [WHEN_TO_APPLY.AFTER_SEPARATION],
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.RETIREMENT,
        goalTypes.UNDERSTAND,
        goalTypes.PLAN,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
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
    learnMoreURL: URLS.VAL_LEARN,
  },
  {
    name: 'Disability compensation',
    category: categories.DISABILITY,
    id: 'DIS',
    description:
      'You may qualify for VA disability benefits for physical conditions (like a chronic illness or injury) and mental health conditions (like PTSD) that developed before, during, or after service.',
    whenToApplyDescription: 'Before or after you separate from service',
    whenToApply: [
      WHEN_TO_APPLY.BEFORE_SEPARATION,
      WHEN_TO_APPLY.AFTER_SEPARATION,
    ],
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.FINANCIAL,
        goalTypes.RETIREMENT,
        goalTypes.HEALTH,
        goalTypes.UNDERSTAND,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
      [mappingTypes.BRANCH_COMPONENT]: [anyType.ANY],
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
    learnMoreURL: URLS.DIS_LEARN,
  },
  {
    name: 'VA-backed home loans',
    category: categories.HOUSING,
    id: 'COE',
    description:
      "If you're approved, a VA-backed home loan can help you buy, build, improve, or refinance a home. A VA-backed home loan may offer better terms than a traditional loan.",
    whenToApplyDescription: 'Before or after you separate from service',
    whenToApply: [
      WHEN_TO_APPLY.BEFORE_SEPARATION,
      WHEN_TO_APPLY.AFTER_SEPARATION,
    ],
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.RETIREMENT, goalTypes.UNDERSTAND],
      [mappingTypes.LENGTH_OF_SERVICE]: [
        timeServedTypes.FOUR_MONTHS_TO_3_YEARS,
        timeServedTypes.THREE_YEARS_TO_10_YEARS,
        timeServedTypes.TEN_YEARS_TO_20_YEARS,
        timeServedTypes.OVER_20_YEARS,
      ],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [yesNoType.YES],
      // NATIOAL_GUARD_SERVICE and RESERVE_SERVICE are also valid. See note on "Educational and career counseling (Chapter 36)".
      [mappingTypes.BRANCH_COMPONENT]: [
        militaryBranchComponentTypes.ACTIVE_DUTY,
      ],
      [mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE]: [
        timeServedTypes.FOUR_MONTHS_TO_3_YEARS,
        timeServedTypes.THREE_YEARS_TO_10_YEARS,
        timeServedTypes.TEN_YEARS_TO_20_YEARS,
        timeServedTypes.OVER_20_YEARS,
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
    isQualified: responses => {
      return (
        responses[mappingTypes.GOALS] &&
        ((responses[mappingTypes.BRANCH_COMPONENT] &&
          responses[mappingTypes.LENGTH_OF_SERVICE]) ||
          (responses[mappingTypes.TITLE_TEN_ACTIVE_DUTY] &&
            responses[mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE])) &&
        responses[mappingTypes.CHARACTER_OF_DISCHARGE]
      );
    },
    learnMoreURL: URLS.COE_LEARN,
  },
  {
    name: 'VA health care',
    category: categories.HEALTH_CARE,
    id: 'VAH',
    description:
      "With VA health care, you're covered for regular checkups with your primary care provider and appointments with specialists (like cardiologists, gynecologists, and mental health providers). You can also access health care services like home health and geriatric (elder) care, medical equipment, and prescriptions.",
    whenToApplyDescription: 'After you separate from service',
    whenToApply: [WHEN_TO_APPLY.AFTER_SEPARATION],
    mappings: {
      [mappingTypes.GOALS]: [
        goalTypes.RETIREMENT,
        goalTypes.HEALTH,
        goalTypes.UNDERSTAND,
      ],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [yesNoType.YES],
      // NATIOAL_GUARD_SERVICE and RESERVE_SERVICE are also valid. See note on "Educational and career counseling (Chapter 36)".
      [mappingTypes.BRANCH_COMPONENT]: [
        militaryBranchComponentTypes.ACTIVE_DUTY,
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
    isQualified: responses => {
      return (
        responses[mappingTypes.GOALS] &&
        (responses[mappingTypes.BRANCH_COMPONENT] ||
          responses[mappingTypes.TITLE_TEN_ACTIVE_DUTY]) &&
        responses[mappingTypes.CHARACTER_OF_DISCHARGE]
      );
    },
    learnMoreURL: URLS.VAH_LEARN,
  },
  {
    name: 'VA national cemetery burial',
    category: categories.BURIALS,
    id: 'BUR',
    description:
      'Veterans, service members, and some family members may be eligible for burial in a VA national cemetery.',
    whenToApplyDescription: 'Before or after you separate from service',
    whenToApply: [
      WHEN_TO_APPLY.BEFORE_SEPARATION,
      WHEN_TO_APPLY.AFTER_SEPARATION,
    ],
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.UNDERSTAND, goalTypes.PLAN],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [yesNoType.YES],
      // NATIOAL_GUARD_SERVICE and RESERVE_SERVICE are also valid. See note on "Educational and career counseling (Chapter 36)".
      [mappingTypes.BRANCH_COMPONENT]: [
        militaryBranchComponentTypes.ACTIVE_DUTY,
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
    isQualified: responses => {
      return (
        responses[mappingTypes.GOALS] &&
        (responses[mappingTypes.TITLE_TEN_ACTIVE_DUTY] ||
          responses[mappingTypes.BRANCH_COMPONENT]) &&
        responses[mappingTypes.CHARACTER_OF_DISCHARGE]
      );
    },
    learnMoreURL: URLS.BUR_LEARN,
  },
  {
    name: 'VA national cemetery burial',
    category: categories.BURIALS,
    id: 'BRG',
    description:
      'Reserves or National Guard members that became disabled or die from an injury or certain cardiovascular disorders caused - or made worse - by their service during a period of inactive-duty training may qualify for burial in a VA National Cemetery.',
    whenToApplyDescription: 'Before or after you separate from service',
    whenToApply: [
      WHEN_TO_APPLY.BEFORE_SEPARATION,
      WHEN_TO_APPLY.AFTER_SEPARATION,
    ],
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.UNDERSTAND, goalTypes.PLAN],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [yesNoType.NO],
      [mappingTypes.BRANCH_COMPONENT]: [
        militaryBranchComponentTypes.NATIONAL_GUARD_SERVICE,
        militaryBranchComponentTypes.RESERVE_SERVICE,
      ],
      [mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE]: [anyType.ANY],
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
    learnMoreURL: URLS.BUR_LEARN,
  },
  {
    name: 'Transfer your GI Bill benefits',
    category: categories.EDUCATION,
    id: 'TGI',
    description:
      'You may be able to transfer your unused Post-9/11 GI Bill benefits to your spouse or dependent children. Learn more about this process and how to request a transfer of benefits.',
    whenToApplyDescription: 'Before you separate from service',
    whenToApply: [WHEN_TO_APPLY.BEFORE_SEPARATION],
    mappings: {
      [mappingTypes.GOALS]: [goalTypes.SCHOOL, goalTypes.UNDERSTAND],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
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
    learnMoreURL: URLS.TGI_LEARN,
  },
  {
    name: 'Apply for a discharge upgrade',
    category: categories.MORE_SUPPORT,
    id: 'DCU',
    description:
      'You can get customized step-by-step instructions on how to apply for a discharge upgrade or correction. If we approve your discharge upgrade, you may be eligible for additional VA benefits.',
    whenToApplyDescription: 'After you separate from service',
    whenToApply: [WHEN_TO_APPLY.AFTER_SEPARATION],
    mappings: {
      [mappingTypes.GOALS]: [anyType.ANY],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
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
    learnMoreURL: URLS.DCU_LEARN,
  },
  {
    name: "State Veterans' benefits",
    category: categories.MORE_SUPPORT,
    id: 'SVB',
    description:
      "You and your family may be eligible for Veterans' benefits provided by your state. Each state has their own list of benefits and resources that they provide.",
    whenToApplyDescription: 'Before or after you separate from service',
    whenToApply: [
      WHEN_TO_APPLY.BEFORE_SEPARATION,
      WHEN_TO_APPLY.AFTER_SEPARATION,
    ],
    mappings: {
      [mappingTypes.GOALS]: [anyType.ANY],
      [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
      [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
      [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
      [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
      [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
      [mappingTypes.SEPARATION]: [anyType.ANY],
      [mappingTypes.CHARACTER_OF_DISCHARGE]: [anyType.ANY],
      [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
    },
    learnMoreURL: URLS.SVB_LEARN,
  },
  // {
  //   name: 'Employment Navigator & Partnership Program',
  //   category: categories.EMPLOYMENT,
  //   id: 'ENPP',
  //   description:
  //     'If you’re leaving active service soon or recently discharged, you and your spouse can get one-on-one career assistance through ENPP. An Employment Navigator can help you find and secure a meaningful post-separation career. Select the learn more link for a list of locations where this program is available.',
  //   whenToApply: [
  //     WHEN_TO_APPLY.BEFORE_SEPARATION,
  //     WHEN_TO_APPLY.AFTER_SEPARATION,
  //   ],
  //   mappings: {
  //     [mappingTypes.GOALS]: [
  //       goalTypes.RETIREMENT,
  //       goalTypes.CAREER,
  //       goalTypes.UNDERSTAND,
  //       goalTypes.PLAN,
  //     ],
  //     [mappingTypes.LENGTH_OF_SERVICE]: [anyType.ANY],
  //     [mappingTypes.TITLE_TEN_ACTIVE_DUTY]: [anyType.ANY],
  //     [mappingTypes.LENGTH_OF_TITLE_TEN_SERVICE]: [anyType.ANY],
  //     [mappingTypes.CURRENTLY_SERVING]: [anyType.ANY],
  //     [mappingTypes.EXPECTED_SEPARATION]: [anyType.ANY],
  //     [mappingTypes.PREVIOUS_SERVICE]: [anyType.ANY],
  //     [mappingTypes.SEPARATION]: [
  //       separationTypes.UP_TO_3_MONTHS,
  //       separationTypes.UP_TO_6_MONTHS,
  //       separationTypes.UP_TO_1_YEAR,
  //     ],
  //     [mappingTypes.CHARACTER_OF_DISCHARGE]: [anyType.ANY],
  //     [mappingTypes.DISABILITY_RATING]: [anyType.ANY],
  //   },
  //   learnMoreURL: URLS.ENPP_LEARN,
  // },
];
