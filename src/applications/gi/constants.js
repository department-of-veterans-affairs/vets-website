/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */

export const PAGE_TITLE = 'GI Bill® CT Redesign Sandbox';

export const NAV_WIDTH = 951;

// WAIT_INTERVAL is in milliseconds.
export const WAIT_INTERVAL = 333;

// ELIGIBILITY_LIFESPAN is in milliseconds
export const ELIGIBILITY_LIFESPAN = 3600000;

// QUERY_LIFESPAN is in milliseconds
export const QUERY_LIFESPAN = 3600000;

// SMALL_SCREEN_WIDTH is in pixels
export const SMALL_SCREEN_WIDTH = 481;

export const PREVIOUS_URL_PUSHED_TO_HISTORY = 'PREVIOUS_URL_PUSHED_TO_HISTORY';

export const MINIMUM_RATING_COUNT = 5;

// Max search area distance in miles
export const MAX_SEARCH_AREA_DISTANCE = 150;

export const KEY_CODES = Object.freeze({
  enterKey: 13,
});

/**
 * Mapbox init values
 * Lat/long are for Turkey Creek, NE
 * This combined with zoomInit value cause map to show continental USA before user searches
 */
export const MapboxInit = {
  zoomInit: 3,
  centerInit: {
    longitude: -99.27246093750001,
    latitude: 40.17887331434698,
  },
};

/**
 * Mapbox api request types
 */

export const TypeList = ['place', 'region', 'postcode', 'locality'];

export const TABS = Object.freeze({
  name: 'name',
  location: 'location',
});

export const INSTITUTION_TYPES = [
  'Public',
  'For profit',
  'Private',
  'Foreign',
  'Flight',
  'Correspondence',
  'High school',
];

export const ariaLabels = Object.freeze({
  learnMore: {
    accreditation:
      'Learn more about the different accreditation types and why it matters',
    allCampusComplaints: 'Learn more about student complaints',
    bookStipend: 'Learn more about the book stipend',
    calcEnrolled:
      'Learn more about enrollment status and how it may affect your education benefits',
    calcWorking:
      'Learn more about how the number of hours you work affects your housing allowance',
    calcScholarships: 'Learn more about what to include for scholarships',
    calcSchoolCalendar: 'Learn more about school calendar options',
    cautionFlags:
      'Learn more about why caution flags might appear on an institution profile',
    cautionaryWarning: 'Learn more about cautionary Warnings',
    eightKeys: 'Learn more about 8 Keys to Veteran Success',
    facilityCode: 'Learn more about the VA facility code',
    giBillBenefits: 'Learn more about VA education and training programs',
    housingAllowance: 'Learn more about how housing allowance is determined',
    independentStudy: 'Learn more about Independent study',
    inState: 'Learn more about qualifying for in-state tuition.',
    inStateTuitionFeesPerYear:
      'Learn more about why we ask for in-state tuition and fees',
    ipedsCode: 'Learn more about the ED IPEDS code',
    kickerEligible: 'Learn more about the kicker bonus',
    majorityOfClasses: 'Learn more about the location-based housing allowance',
    militaryTrainingCredit: 'Learn more about credit for military training',
    militaryTuitionAssistance: 'Learn more about Military Tuition Assistance',
    numberOfStudents:
      'Learn more about how we calculate the number of GI Bill students',
    onlineOnlyDistanceLearning:
      'Learn more about how we calculate your housing allowance based on where you take classes',
    opeCode: 'Learn more about the ED OPE code',
    paysToProvider: 'Learn more about how we pay providers',
    post911Chapter33: 'Learn more about Cumulative Post-9/11 service',
    preferredProvider: 'Learn more about Preferred providers',
    principlesOfExcellence: 'Learn more about Principles of Excellence',
    priorityEnrollment: 'Learn more about priority enrollment',
    montgomeryGIBill:
      'Learn more about how the length of Montgomery GI Bill active-duty service affects your benefits',
    reapActiveDuty:
      'Learn more about how the length of your REAP active-duty service affects your benefits',
    scholarships: 'Learn more about what types of scholarships to include',
    singlePoint: 'Learn more about single point of contact for Veterans',
    sizeOfInstitution: 'Learn more about institution size',
    specializedMission: 'Learn more about community filters',
    studentVeteranGroup: 'Learn more about Student Veteran Groups',
    tuitionAndFees: 'Learn more about the tuition and fees covered by VET TEC',
    tuitionFees: 'Learn more about tuition and fees',
    tuitionFeesPerYear:
      'Learn more about what costs to include for your tuition and fees',
    vetSuccess: 'Learn more about VetSuccess on Campus',
    vetTecProgram: 'Learn more about the VET TEC program',
    whenUsedGiBill: 'Learn more about your monthly housing allowance rate',
    yellowRibbonProgram:
      'Learn more about what is covered by the Yellow Ribbon program and who can use it',
  },
});

export const complaintData = [
  {
    key: 'financial',
    definition: 'The school is charging you a higher tuition or extra fees.',
    type: 'Financial Concern',
  },
  {
    key: 'quality',
    definition: 'The school doesn’t have qualified teachers.',
    type: 'Quality of Education',
  },
  {
    key: 'refund',
    definition: 'The school won’t refund your GI Bill payment.',
    type: 'Refund Issues',
  },
  {
    key: 'marketing',
    definition:
      'The school made inaccurate claims about the quality of its education or its school requirements.',
    type: 'Recruiting/Marketing Practices',
  },
  {
    key: 'accreditation',
    definition: 'The school is unable to get or keep accreditation.',
    type: 'Accreditation',
  },
  {
    key: 'degreeRequirements',
    definition:
      'The school added new hour or course requirements after you enrolled.',
    type: 'Change in degree plan/requirements',
  },
  {
    key: 'studentLoans',
    definition:
      'The school didn’t provide you total a cost of your school loan.',
    type: 'Student Loans',
  },
  {
    key: 'grades',
    definition:
      'The school didn’t give you a copy of its grade policy or it changed its grade policy in the middle of the year.',
    type: 'Grade Policy',
  },
  {
    key: 'creditTransfer',
    definition: 'The school isn’t accredited for transfer of credits.',
    type: 'Transfer of Credits',
  },
  {
    key: 'job',
    definition:
      'The school made promises to you about job placement or salary after graduation.',
    type: 'Post-Graduation Job Opportunities',
    totalKey: 'jobs',
  },
  {
    key: 'transcript',
    definition: 'The school won’t release your transcripts.',
    type: 'Release of Transcripts',
  },
  {
    key: 'other',
    definition: '',
    type: 'Other',
  },
  {
    type: 'Total Complaints',
    totals: ['facilityCode', 'mainCampusRollUp'],
  },
];

const CTRatingsHeaders = {
  m1: 'Learning Experience',
  m2: 'GI Bill Support',
  m3: 'Veteran Community',
  m4: 'Overall Experience',
  m5: 'for furture use',
  m6: 'for furture use',
  m7: 'for furture use',
};

const CTRatingsQuestions = {
  q1Long: `Instructors' knowledge in the subject being taught`,
  q1: 'Instructor knowledge',
  q2Long: `Instructors' ability to engage with students around course content`,
  q2: 'Instructor engagement',
  q3Long: `Support of course materials in meeting learning objectives`,
  q3: 'Course material support',
  q4Long: `Contribution of school-supplied technology and/or facilities to successful learning experience`,
  q4: 'Successful learning experience',
  q5Long: `Contribution of learning experience to skills needed for career journey`,
  q5: 'Contribution career learning experience',
  q6Long: `Did you interact with the School Certifying Officials `,
  q7Long: `Supportiveness of School Certifying Officials `,
  q7: 'Support of school officials',
  q8Long: `Availability of School Certifying Officials`,
  q8: 'Availability of school officials',
  q9Long: `School's timely completion of VA enrollment documentation`,
  q9: 'Timely completion of VA documents',
  q10Long: `Helpfulness of school-provided information about GI Bill, other VA benefits`,
  q10: 'Helpfulness of school',
  q11Long: `Extent of school's support for its Veteran community`,
  q11: 'Extent support school',
  q12Long: `Extent of support from others in the school's Veteran community`,
  q12: 'Extent support others',
  q13: `Overall learning experience`,
  q14: `Overall school experience`,
  q15: `for future use`,
  q16: `for future use`,
  q17: `for future use`,
  q18: `for future use`,
  q19: `for future use`,
  q20: `for future use`,
};

export const CTRatingsHeaderQuestions = [
  {
    title: {
      heading: CTRatingsHeaders.m1,
      m1Avg: '0',
    },
    questions: [
      {
        question: CTRatingsQuestions.q1,
        q1Avg: '0',
        q1Count: 0,
      },
      {
        question: CTRatingsQuestions.q2,
        q2Avg: '0',
        q2Count: 0,
      },
      {
        question: CTRatingsQuestions.q3,
        q3Avg: '0',
        q3Count: 0,
      },
      {
        question: CTRatingsQuestions.q4,
        q4Avg: '0',
        q4Count: 0,
      },
      {
        question: CTRatingsQuestions.q5,
        q5Avg: '0',
        q5Count: 0,
      },
    ],
  },
  {
    title: {
      heading: CTRatingsHeaders.m2,
      m2Avg: '0',
    },
    questions: [
      {
        question: CTRatingsQuestions.q7,
        q7Avg: '0',
        q7Count: 0,
      },
      {
        question: CTRatingsQuestions.q8,
        q7Avg: '0',
        q7Count: 0,
      },
      {
        question: CTRatingsQuestions.q9,
        q9Avg: '0',
        q9Count: 0,
      },
      {
        question: CTRatingsQuestions.q10,
        q10Avg: '0',
        q10Count: 0,
      },
    ],
  },
  {
    title: {
      heading: CTRatingsHeaders.m3,
      m3Avg: '0',
    },
    questions: [
      {
        question: CTRatingsQuestions.q11,
        q11Avg: '0',
        q11Count: 0,
      },
      {
        question: CTRatingsQuestions.q12,
        q12Avg: '0',
        q12Count: 0,
      },
    ],
  },
  {
    title: {
      heading: CTRatingsHeaders.m4,
      m4Avg: '0',
    },
    questions: [
      {
        question: CTRatingsQuestions.q13,
        q13Avg: '0',
        q13Count: 0,
      },
      {
        question: CTRatingsQuestions.q14,
        q14Avg: '0',
        q14Count: 0,
      },
    ],
  },
];
export const filterKeys = [
  'schools',
  'excludeCautionFlags',
  'accredited',
  'studentVeteran',
  'yellowRibbonScholarship',
  'employers',
  'vettec',
  'preferredProvider',
  'specialMissionHbcu',
  'specialMissionMenonly',
  'specialMissionWomenonly',
  'specialMissionRelaffil',
  'specialMissionHSI',
  'specialMissionNANTI',
  'specialMissionANNHI',
  'specialMissionAANAPII',
  'specialMissionPBI',
  'specialMissionTRIBAL',
];
