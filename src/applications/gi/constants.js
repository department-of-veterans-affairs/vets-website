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

export const LC_TABS = {
  test: 'test',
  admin: 'admin',
};

export const INSTITUTION_TYPES = [
  'Public',
  'For profit',
  'Private',
  'Foreign',
  'Flight',
  'Correspondence',
  'High school',
];

export const INSTITUTION_TYPES_DICTIONARY = {
  Public: 'Public',
  'For profit': 'For-profit',
  Private: 'Private',
  Foreign: 'Foreign',
  Flight: 'Flight',
  Correspondence: 'Correspondence',
  'High school': 'High School',
};

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
      'The school didn’t provide you a total cost of your school loan.',
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

export const POST_911_ARRAY = [
  { optionValue: 'veteran', optionLabel: 'Veteran' },
  { optionValue: 'active duty', optionLabel: 'Active Duty' },
  {
    optionValue: 'national guard / reserves',
    optionLabel: 'National Guard / Reserves',
  },
];

export const FRY_SCHOLARSHIP_ARRAY = [
  { optionValue: 'spouse', optionLabel: 'Surviving Spouse' },
  { optionValue: 'child', optionLabel: 'Child' },
];

export const MONTGOMERY_GI_BILL_ARRAY = [
  { optionValue: 'veteran', optionLabel: 'Veteran' },
  { optionValue: 'active duty', optionLabel: 'Active Duty' },
];

export const SELECT_RESERVE_GI_BILL_ARRAY = [
  {
    optionValue: 'national guard / reserves',
    optionLabel: 'National Guard / Reserves',
  },
];

export const VETERAN_READINESS_ARRAY = [
  { optionValue: 'veteran', optionLabel: 'Veteran' },
];

export const SURVIVOR_AND_DEPENDENT_ARRAY = [
  { optionValue: 'spouse', optionLabel: 'Spouse' },
  { optionValue: 'child', optionLabel: 'Child' },
];

export const yellowRibbonColumns = {
  degree: {
    id: 0,
    description: 'Degree Level',
    key: 'degreeLevel',
  },
  program: {
    id: 1,
    description: 'School or Program',
    key: 'divisionProfessionalSchool',
  },
  students: {
    id: 2,
    description: 'Funding available (for students)',
    key: 'numberOfStudents',
  },
  funding: {
    id: 3,
    description: 'Maximum Yellow Ribbon funding amount (per student, per year)',
    key: 'contributionAmount',
  },
};

export const ERROR_MESSAGES = {
  searchByNameInputEmpty:
    'Please fill in a school, employer, or training provider.',
  searchbyLocationInputEmpty: 'Please fill in a city, state, or postal code.',
  invalidZipCode: 'Please enter a valid postal code.',
  checkBoxFilterEmpty: 'Please select at least one filter.',
};

export const yellowRibbonDegreeLevelTypeHash = {
  AAS: ['Associates'],
  'AAS in Accounting': ['Associates'],
  'AAS/BS - Undergraduate': ['Associates', 'Undergraduate'],
  'AOS - Undergraduate': ['Undergraduate'],
  All: ['All'],
  'All (Arts & Science)': ['All'],
  'All (Bachelor of Arts)': ['All'],
  'All (Biological Sciences Division)': ['All'],
  'All (Brandeis School of Law)': ['All'],
  'All (Chicago Booth)': ['All'],
  'All (College of Arts and Sciences)': ['All'],
  'All (College of Graduate Studies)': ['All'],
  'All (College of Lifelong Learning)': ['All'],
  'All (College of Undergraduate Studies)': ['All'],
  'All (College of Veterinary Medicine)': ['All'],
  'All (Dental School)': ['All'],
  'All (Divinity School)': ['All'],
  'All (Engineering School)': ['All'],
  'All (Financial Planning Program)': ['All'],
  'All (Fine Arts)': ['All'],
  'All (Friendman School of Nutrition Science and Policy)': ['All'],
  'All (Graham School of General Studies)': ['All'],
  'All (HSC Programs)': ['All'],
  'All (Harris School of Public Policy)': ['All'],
  'All (Humanities Division)': ['All'],
  'All (JD, LLM)': ['All'],
  'All (Juris Doctor)': ['All'],
  'All (Law School)': ['All'],
  'All (Meadows School of Arts)': ['All'],
  'All (Nursing School)': ['All'],
  'All (Peabody College)': ['All'],
  'All (Pharmacy)': ['All'],
  'All (Pritzker School of Medicine)': ['All'],
  'All (School of Architecture - Professional)': ['All'],
  'All (School of Architecture/Urban Planning)': ['All'],
  'All (School of Art & Design)': ['All'],
  'All (School of Arts & Sciences)': ['All'],
  'All (School of Business Administration)': ['All'],
  'All (School of Business)': ['All'],
  'All (School of Education)': ['All'],
  'All (School of Engineering)': ['All'],
  'All (School of Information)': ['All'],
  'All (School of Kinesiology)': ['All'],
  'All (School of Law)': ['All'],
  'All (School of Literature, Science, & Arts)': ['All'],
  'All (School of Medicine)': ['All'],
  'All (School of Music, Theatre, and Dance)': ['All'],
  'All (School of Natural Resources)': ['All'],
  'All (School of Nursing)': ['All'],
  'All (School of Nursing/Health)': ['All'],
  'All (School of Pharmacy)': ['All'],
  'All (School of Physical Sciences)': ['All'],
  'All (School of Public Health)': ['All'],
  'All (School of Public Policy)': ['All'],
  'All (School of Social Services Administration)': ['All'],
  'All (School of Social Work)': ['All'],
  'All (Seminary)': ['All'],
  'All (Social Sciences Division)': ['All'],
  'All (Thayer School of Engineering)': ['All'],
  'All (The Flethcher School of Law and Diplomacy)': ['All'],
  'All Medical': ['All'],
  Associates: ['Associates'],
  'Associates (Lakeland College Japan - Associate)': ['Associates'],
  Bachelors: ['Bachelors'],
  Certificate: ['Certificate'],
  Certification: ['Certificate'],
  College: ['Other'],
  Dentistry: ['Other'],
  Diploma: ['Other'],
  Doctoral: ['Doctoral'],
  'Doctoral (All)': ['Doctoral'],
  'Doctoral (CMB)': ['Doctoral'],
  'Doctoral (College of Arts and Sciences)': ['Doctoral'],
  'Doctoral (College of Business)': ['Doctoral'],
  'Doctoral (College of Education)': ['Doctoral'],
  'Doctoral (Dental School)': ['Doctoral'],
  'Doctoral (Education)': ['Doctoral'],
  'Doctoral (Law)': ['Doctoral'],
  'Doctoral (Leadership Studies)': ['Doctoral'],
  'Doctoral (Los Angeles College of Chiropractic)': ['Doctoral'],
  'Doctoral (Medical School)': ['Doctoral'],
  'Doctoral (National College of Education)': ['Doctoral'],
  'Doctoral (Nursing)': ['Doctoral'],
  'Doctoral (Professional Psychology)': ['Doctoral'],
  'Doctoral (School of Education)': ['Doctoral'],
  'Doctoral (School of Law)': ['Doctoral'],
  'Doctoral (School of Medicine)': ['Doctoral'],
  'Doctoral (School of Psychology)': ['Doctoral'],
  'Doctoral (St Ambrose & ACCEL-College of Professional Studies)': ['Doctoral'],
  'Doctoral, School of Law': ['Doctoral'],
  'Doctoral/Graduate': ['Doctoral', 'Graduate'],
  'Doctoral/Professional': ['Doctoral', 'Other'],
  Doctorate: ['Doctoral'],
  'Executive MBA': ['Masters'],
  'Gradauate (Natural Sciences)': ['Graduate'],
  Graduate: ['Graduate'],
  'Graduate & Doctoral': ['Graduate', 'Doctoral'],
  'Graduate (All Non-Law)': ['Graduate'],
  'Graduate (All Students)': ['Graduate'],
  'Graduate (All)': ['Graduate'],
  'Graduate (Architecture)': ['Graduate'],
  'Graduate (Breech School Business Admin)': ['Graduate'],
  'Graduate (Business & Nursing Education)': ['Graduate'],
  'Graduate (Business School)': ['Graduate'],
  'Graduate (Business)': ['Graduate'],
  'Graduate (Caspersen School of Graduate Studies)': ['Graduate'],
  'Graduate (Chester)': ['Graduate'],
  'Graduate (College of Arts and Sciences)': ['Graduate'],
  'Graduate (College of Graduate Studies)': ['Graduate'],
  'Graduate (College of Lifelong Learning)': ['Graduate'],
  'Graduate (Cox School of Business)': ['Graduate'],
  'Graduate (Cox School of Engineering)': ['Graduate'],
  'Graduate (Dedman College)': ['Graduate'],
  'Graduate (Dedman School of Law)': ['Graduate'],
  'Graduate (Doctoral)': ['Graduate'],
  'Graduate (Education)': ['Graduate'],
  'Graduate (Eduction)': ['Graduate'],
  'Graduate (Engineering)': ['Graduate'],
  'Graduate (Executive MBA)': ['Graduate'],
  'Graduate (Graduate College)': ['Graduate'],
  'Graduate (Graduate Studies)': ['Graduate'],
  'Graduate (Int’l Education Mgmt)': ['Graduate'],
  'Graduate (Int’l Envirmental Policy)': ['Graduate'],
  'Graduate (Intl Policy Studies)': ['Graduate'],
  'Graduate (JD)': ['Graduate'],
  'Graduate (Law School)': ['Graduate'],
  'Graduate (Law)': ['Graduate'],
  'Graduate (Loyola College of Arts & Sciences)': ['Graduate'],
  'Graduate (MA Public Administration)': ['Graduate'],
  'Graduate (MBA & Masters)': ['Graduate'],
  'Graduate (MD&Master)': ['Graduate'],
  'Graduate (MFA)': ['Graduate'],
  'Graduate (Master of Education Degree/Master of Education Degree)': [
    'Graduate',
  ],
  'Graduate (Master of Engineering Program)': ['Graduate'],
  'Graduate (Masters)': ['Graduate'],
  'Graduate (Med/Dent/Law/Pharm)': ['Graduate'],
  'Graduate (National College of Education)': ['Graduate'],
  'Graduate (Owen Graduate School of Management)': ['Graduate'],
  'Graduate (Peace Corps Programs)': ['Graduate'],
  'Graduate (Perkins School of Theology)': ['Graduate'],
  'Graduate (Professional Psychology)': ['Graduate'],
  'Graduate (SIT Graduate Institute)': ['Graduate'],
  'Graduate (School of Architecture)': ['Graduate'],
  'Graduate (School of Art)': ['Graduate'],
  'Graduate (School of Arts and Sciences)': ['Graduate'],
  'Graduate (School of Behavioral Science)': ['Graduate'],
  'Graduate (School of Business Administration)': ['Graduate'],
  'Graduate (School of Business)': ['Graduate'],
  'Graduate (School of Communication)': ['Graduate'],
  'Graduate (School of Conflict Transformation)': ['Graduate'],
  'Graduate (School of Continuing and Professional Studies)': ['Graduate'],
  'Graduate (School of Counseling)': ['Graduate'],
  'Graduate (School of Education)': ['Graduate'],
  'Graduate (School of Engineering)': ['Graduate'],
  'Graduate (School of Graduate & Professional Studies)': ['Graduate'],
  'Graduate (School of Jewish Studies)': ['Graduate'],
  'Graduate (School of Law)': ['Graduate'],
  'Graduate (School of Management)': ['Graduate'],
  'Graduate (School of Music)': ['Graduate'],
  'Graduate (School of Nursing)': ['Graduate'],
  'Graduate (School of Occupational Therapy)': ['Graduate'],
  'Graduate (School of Psychology)': ['Graduate'],
  'Graduate (School of Social Work)': ['Graduate'],
  'Graduate (School of Teacher Education)': ['Graduate'],
  'Graduate (School of Theology )': ['Graduate'],
  'Graduate (Sellinger School)': ['Graduate'],
  'Graduate (Seminary)': ['Graduate'],
  'Graduate (Simmons School of Ed & HD)': ['Graduate'],
  'Graduate (Social Work)': ['Graduate'],
  'Graduate (St Ambrose & ACCEL-College of Professional Studies)': ['Graduate'],
  'Graduate (Stuart School of Business)': ['Graduate'],
  'Graduate (T&I)': ['Graduate'],
  'Graduate (TFL)': ['Graduate'],
  'Graduate (TLM)': ['Graduate'],
  'Graduate (The Guildhall)': ['Graduate'],
  'Graduate (Theological School)': ['Graduate'],
  'Graduate (Tuck School of Business)': ['Graduate'],
  'Graduate (UCLA Anderson/MBA)': ['Graduate'],
  'Graduate (University College)': ['Graduate'],
  'Graduate (all but School of Dentistry)': ['Graduate'],
  'Graduate (except Doctoral Physical Therapy)': ['Graduate'],
  'Graduate Certificates': ['Graduate'],
  'Graduate JD': ['Graduate'],
  'Graduate MFA in Creative Writing/ MFA in Interdisciplinary Studies': [
    'Graduate',
  ],
  'Graduate Physician Assistant': ['Graduate'],
  'Graduate School/Continuing Professional Studies': ['Graduate'],
  'Graduate and Professional': ['Graduate', 'Other'],
  'Graduate(School of Business and Leadership)': ['Graduate'],
  'Graduate, Doctoral': ['Graduate', 'Doctoral'],
  'Graduate-NR': ['Graduate'],
  'Graduate/ Doctoral/1st Prof': ['Graduate', 'Doctoral'],
  'Graduate/Doctoral': ['Graduate', 'Doctoral'],
  'Graduate/Doctoral (Center for Urban Sciences)': ['Graduate', 'Doctoral'],
  'Graduate/Doctoral (Gallatin School)': ['Graduate', 'Doctoral'],
  'Graduate/Doctoral (Global Public Health)': ['Graduate', 'Doctoral'],
  'Graduate/Doctoral (Graduate Arts & Sciences)': ['Graduate', 'Doctoral'],
  'Graduate/Doctoral (Graduate School of Arts and Sciences)': [
    'Graduate',
    'Doctoral',
  ],
  'Graduate/Doctoral (Law School)': ['Graduate', 'Doctoral'],
  'Graduate/Doctoral (School of Continuing Ed and Professional Studies)': [
    'Graduate',
    'Doctoral',
  ],
  'Graduate/Doctoral (School of Dentisty)': ['Graduate', 'Doctoral'],
  'Graduate/Doctoral (School of Nursing)': ['Graduate', 'Doctoral'],
  'Graduate/Doctoral (Silver School of Social Work)': ['Graduate', 'Doctoral'],
  'Graduate/Doctoral (Steinhardt School of Education)': [
    'Graduate',
    'Doctoral',
  ],
  'Graduate/Doctoral (Tisch School of the Arts)': ['Graduate', 'Doctoral'],
  'Graduate/Doctorate': ['Graduate', 'Doctoral'],
  'Graduate/Non-Prof': ['Graduate'],
  'Graduate/Ph.D': ['Graduate'],
  'Graduate/Professional': ['Graduate', 'Other'],
  'Graduate/Undergraduate': ['Graduate', 'Undergraduate'],
  Graudate: ['Graduate'],
  'Graudate (TESOL)': ['Graduate'],
  'Graudate/Doctoral': ['Graduate', 'Doctoral'],
  'J.D/Doctoral': ['Doctoral'],
  JD: ['Doctoral'],
  'JD, EMBA, AMBA': ['Doctoral'],
  'Juris Doctor': ['Doctoral'],
  'Juris Doctor (all)': ['Doctoral'],
  'Juris Doctorate': ['Doctoral'],
  'LLM/JD': ['Graduate', 'Doctoral'],
  Law: ['Doctoral'],
  'Law School': ['Doctoral'],
  MD: ['Doctoral'],
  MS: ['Masters'],
  Masters: ['Masters'],
  'Medical Asst AAS': ['Associates'],
  'Medical Lab Tech AAS': ['Associates'],
  Medicine: ['Other'],
  NCD: ['Other'],
  Online: ['Other'],
  Optometry: ['Other'],
  'Other Professional Programs': ['Other'],
  PhD: ['Other'],
  Pharmacy: ['Other'],
  'Post Baccalaureate': ['Other'],
  Private: ['Other'],
  Professional: ['Other'],
  'RT, OTA, PTA': ['Other'],
  Seminary: ['Other'],
  'Traditional Undergraduate': ['Undergraduate'],
  'UG-BA-Graduate': ['Graduate'],
  'Undergrad/Graduate/Doctoral': ['Undergraduate', 'Graduate', 'Doctoral'],
  Undergraduate: ['Undergraduate'],
  'Undergraduate & Graduate': ['Undergraduate', 'Graduate'],
  'Undergraduate & Graduate (Art Institute of Boston)': [
    'Undergraduate',
    'Graduate',
  ],
  'Undergraduate & Graduate (Online)': ['Undergraduate', 'Graduate'],
  'Undergraduate (AAS)': ['Undergraduate'],
  'Undergraduate (ADN)': ['Undergraduate'],
  'Undergraduate (Accounting Systems)': ['Undergraduate'],
  'Undergraduate (Administrative Asst.)': ['Undergraduate'],
  'Undergraduate (Adult Degree Completion)': ['Undergraduate'],
  'Undergraduate (Adult Education Programs)': ['Undergraduate'],
  'Undergraduate (All Adult Education Programs)': ['Undergraduate'],
  'Undergraduate (All UW Oshkosh College)': ['Undergraduate'],
  'Undergraduate (All)': ['Undergraduate'],
  'Undergraduate (Arts and Sciences)': ['Undergraduate'],
  'Undergraduate (Associate Degree)': ['Undergraduate'],
  'Undergraduate (Associate degree)': ['Undergraduate'],
  'Undergraduate (BA Intl Studies)': ['Undergraduate'],
  'Undergraduate (Bachelors)': ['Undergraduate'],
  'Undergraduate (Business Management)': ['Undergraduate'],
  'Undergraduate (Business Technologies)': ['Undergraduate'],
  'Undergraduate (Business)': ['Undergraduate'],
  'Undergraduate (College of Arts and Sciences )': ['Undergraduate'],
  'Undergraduate (College of Arts and Sciences)': ['Undergraduate'],
  'Undergraduate (College of Cont. Studies)': ['Undergraduate'],
  'Undergraduate (College of Liberal Arts)': ['Undergraduate'],
  'Undergraduate (College of Management and Business)': ['Undergraduate'],
  'Undergraduate (College)': ['Undergraduate'],
  'Undergraduate (Continuing Studies)': ['Undergraduate'],
  'Undergraduate (Day College)': ['Undergraduate'],
  'Undergraduate (Day)': ['Undergraduate'],
  'Undergraduate (Digital Graphics)': ['Undergraduate'],
  'Undergraduate (Engineering)': ['Undergraduate'],
  'Undergraduate (Evening)': ['Undergraduate'],
  'Undergraduate (Flight School)': ['Undergraduate'],
  'Undergraduate (Game Design)': ['Undergraduate'],
  'Undergraduate (Information Technology)': ['Undergraduate'],
  'Undergraduate (Lesley College)': ['Undergraduate'],
  'Undergraduate (Liberal Arts/Science/Engineering)': ['Undergraduate'],
  'Undergraduate (Massage Therapy)': ['Undergraduate'],
  'Undergraduate (Medical Assisting)': ['Undergraduate'],
  'Undergraduate (Misenheimer)': ['Undergraduate'],
  'Undergraduate (NR)': ['Undergraduate'],
  'Undergraduate (National College of Education)': ['Undergraduate'],
  'Undergraduate (Office, Project Mang.)': ['Undergraduate'],
  'Undergraduate (Paralegal Studies/CJ)': ['Undergraduate'],
  'Undergraduate (Practical Nursing)': ['Undergraduate'],
  'Undergraduate (SIT Study Abroad)': ['Undergraduate'],
  'Undergraduate (School of Adult Studies)': ['Undergraduate'],
  'Undergraduate (School of Arts & Science)': ['Undergraduate'],
  'Undergraduate (School of Arts & Sciences)': ['Undergraduate'],
  'Undergraduate (School of Business Admin)': ['Undergraduate'],
  'Undergraduate (School of Business)': ['Undergraduate'],
  'Undergraduate (School of Computer Information System)': ['Undergraduate'],
  'Undergraduate (School of Criminal Justice)': ['Undergraduate'],
  'Undergraduate (School of Culinary Arts & Hospitality)': ['Undergraduate'],
  'Undergraduate (School of Culinary Arts and Hospitality)': ['Undergraduate'],
  'Undergraduate (School of Education)': ['Undergraduate'],
  'Undergraduate (School of Health Science)': ['Undergraduate'],
  'Undergraduate (School of Health Sciences)': ['Undergraduate'],
  'Undergraduate (School of Liberal Arts)': ['Undergraduate'],
  'Undergraduate (School of Nursing)': ['Undergraduate'],
  'Undergraduate (School of Professional Studies/Trine Virtual Campus)': [
    'Undergraduate',
  ],
  'Undergraduate (School of Undergraduate)': ['Undergraduate'],
  'Undergraduate (Sellinger School)': ['Undergraduate'],
  'Undergraduate (St Ambrose & ACCEL-College of Professional Studies)': [
    'Undergraduate',
  ],
  'Undergraduate (Traditional - Undergraduate)': ['Undergraduate'],
  'Undergraduate (Traditional)': ['Undergraduate'],
  'Undergraduate (Trinity Arts and Sciences)': ['Undergraduate'],
  'Undergraduate (WEC)': ['Undergraduate'],
  'Undergraduate (assos of occup studies)': ['Undergraduate'],
  'Undergraduate - College': ['Undergraduate'],
  'Undergraduate - NYS Residents (VTA Eligible)': ['Undergraduate'],
  'Undergraduate - NYS Residents (non-VTA eligible)': ['Undergraduate'],
  'Undergraduate : DC': ['Undergraduate'],
  'Undergraduate All (Traditional Campus)': ['Undergraduate'],
  'Undergraduate Certificate': ['Certificate'],
  'Undergraduate and Graduate': ['Undergraduate', 'Graduate'],
  'Undergraduate and Masters': ['Undergraduate', 'Masters'],
  'Undergraduate(Day Program)': ['Undergraduate'],
  'Undergraduate(Loyola College of Arts & Sciences)': ['Undergraduate'],
  'Undergraduate(School of Art Science)': ['Undergraduate'],
  'Undergraduate(School of Business Admin)': ['Undergraduate'],
  'Undergraduate(School of Business and Leadership)': ['Undergraduate'],
  'Undergraduate(School of Computer Info Science)': ['Undergraduate'],
  'Undergraduate(School of Culinary Art and Hospitality Mgt)': [
    'Undergraduate',
  ],
  'Undergraduate(School of Health Science)': ['Undergraduate'],
  'Undergraduate, Biblical Studies': ['Undergraduate'],
  'Undergraduate, Grad': ['Undergraduate', 'Graduate'],
  'Undergraduate, Graduate': ['Undergraduate', 'Graduate'],
  'Undergraduate-Non NYS Residents': ['Undergraduate'],
  'Undergraduate/Certificate': ['Undergraduate', 'Certificate'],
  'Undergraduate/Graduate': ['Undergraduate', 'Graduate'],
  'Undergraduate/Graduate (CPS)': ['Undergraduate', 'Graduate'],
  'Undergraduate/Graduate (Metropolitan School of Professional Studies)': [
    'Undergraduate',
    'Graduate',
  ],
  'Undergraduate/Graduate (Out of State)': ['Undergraduate', 'Graduate'],
  'Undergraduate/Graduate/Doctoral': ['Undergraduate', 'Graduate', 'Doctoral'],
  'Undergraduate: DC': ['Undergraduate'],
};
