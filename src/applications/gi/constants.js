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
  aas: ['Associates'],
  'aas in accounting': ['Associates'],
  'aas/bs - undergraduate': ['Associates', 'Undergraduate'],
  'aos - undergraduate': ['Undergraduate'],
  all: ['All'],
  'all (arts & science)': ['All'],
  'all (bachelor of arts)': ['All'],
  'all (biological sciences division)': ['All'],
  'all (brandeis school of law)': ['All'],
  'all (chicago booth)': ['All'],
  'all (college of arts and sciences)': ['All'],
  'all (college of graduate studies)': ['All'],
  'all (college of lifelong learning)': ['All'],
  'all (college of undergraduate studies)': ['All'],
  'all (college of veterinary medicine)': ['All'],
  'all (dental school)': ['All'],
  'all (divinity school)': ['All'],
  'all (engineering school)': ['All'],
  'all (financial planning program)': ['All'],
  'all (fine arts)': ['All'],
  'all (friendman school of nutrition science and policy)': ['All'],
  'all (graham school of general studies)': ['All'],
  'all (hsc programs)': ['All'],
  'all (harris school of public policy)': ['All'],
  'all (humanities division)': ['All'],
  'all (jd, llm)': ['All'],
  'all (juris doctor)': ['All'],
  'all (law school)': ['All'],
  'all (meadows school of arts)': ['All'],
  'all (nursing school)': ['All'],
  'all (peabody college)': ['All'],
  'all (pharmacy)': ['All'],
  'all (pritzker school of medicine)': ['All'],
  'all (school of architecture - professional)': ['All'],
  'all (school of architecture/urban planning)': ['All'],
  'all (school of art & design)': ['All'],
  'all (school of arts & sciences)': ['All'],
  'all (school of business administration)': ['All'],
  'all (school of business)': ['All'],
  'all (school of education)': ['All'],
  'all (school of engineering)': ['All'],
  'all (school of information)': ['All'],
  'all (school of kinesiology)': ['All'],
  'all (school of law)': ['All'],
  'all (school of literature, science, & arts)': ['All'],
  'all (school of medicine)': ['All'],
  'all (school of music, theatre, and dance)': ['All'],
  'all (school of natural resources)': ['All'],
  'all (school of nursing)': ['All'],
  'all (school of nursing/health)': ['All'],
  'all (school of pharmacy)': ['All'],
  'all (school of physical sciences)': ['All'],
  'all (school of public health)': ['All'],
  'all (school of public policy)': ['All'],
  'all (school of social services administration)': ['All'],
  'all (school of social work)': ['All'],
  'all (seminary)': ['All'],
  'all (social sciences division)': ['All'],
  'all (thayer school of engineering)': ['All'],
  'all (the flethcher school of law and diplomacy)': ['All'],
  'all medical': ['All'],
  associates: ['Associates'],
  'associates (lakeland college japan - associate)': ['Associates'],
  bachelors: ['Bachelors'],
  certificate: ['Certificate'],
  certification: ['Certificate'],
  college: ['Other'],
  dentistry: ['Other'],
  diploma: ['Other'],
  doctoral: ['Doctoral'],
  'doctoral (all)': ['Doctoral'],
  'doctoral (cmb)': ['Doctoral'],
  'doctoral (college of arts and sciences)': ['Doctoral'],
  'doctoral (college of business)': ['Doctoral'],
  'doctoral (college of education)': ['Doctoral'],
  'doctoral (dental school)': ['Doctoral'],
  'doctoral (education)': ['Doctoral'],
  'doctoral (law)': ['Doctoral'],
  'doctoral (leadership studies)': ['Doctoral'],
  'doctoral (los angeles college of chiropractic)': ['Doctoral'],
  'doctoral (medical school)': ['Doctoral'],
  'doctoral (national college of education)': ['Doctoral'],
  'doctoral (nursing)': ['Doctoral'],
  'doctoral (professional psychology)': ['Doctoral'],
  'doctoral (school of education)': ['Doctoral'],
  'doctoral (school of law)': ['Doctoral'],
  'doctoral (school of medicine)': ['Doctoral'],
  'doctoral (school of psychology)': ['Doctoral'],
  'doctoral (st ambrose & accel-college of professional studies)': ['Doctoral'],
  'doctoral, school of law': ['Doctoral'],
  'doctoral/graduate': ['Doctoral', 'Graduate'],
  'doctoral/professional': ['Doctoral', 'Other'],
  doctorate: ['Doctoral'],
  'executive mba': ['Masters'],
  'gradauate (natural sciences)': ['Graduate'],
  graduate: ['Graduate'],
  'graduate & doctoral': ['Graduate', 'Doctoral'],
  'graduate (all non-law)': ['Graduate'],
  'graduate (all students)': ['Graduate'],
  'graduate (all)': ['Graduate'],
  'graduate (architecture)': ['Graduate'],
  'graduate (breech school business admin)': ['Graduate'],
  'graduate (business & nursing education)': ['Graduate'],
  'graduate (business school)': ['Graduate'],
  'graduate (business)': ['Graduate'],
  'graduate (caspersen school of graduate studies)': ['Graduate'],
  'graduate (chester)': ['Graduate'],
  'graduate (college of arts and sciences)': ['Graduate'],
  'graduate (college of graduate studies)': ['Graduate'],
  'graduate (college of lifelong learning)': ['Graduate'],
  'graduate (cox school of business)': ['Graduate'],
  'graduate (cox school of engineering)': ['Graduate'],
  'graduate (dedman college)': ['Graduate'],
  'graduate (dedman school of law)': ['Graduate'],
  'graduate (doctoral)': ['Graduate'],
  'graduate (education)': ['Graduate'],
  'graduate (eduction)': ['Graduate'],
  'graduate (engineering)': ['Graduate'],
  'graduate (executive mba)': ['Graduate'],
  'graduate (graduate college)': ['Graduate'],
  'graduate (graduate studies)': ['Graduate'],
  'graduate (int’l education mgmt)': ['Graduate'],
  'graduate (int’l envirmental policy)': ['Graduate'],
  'graduate (intl policy studies)': ['Graduate'],
  'graduate (jd)': ['Graduate'],
  'graduate (law school)': ['Graduate'],
  'graduate (law)': ['Graduate'],
  'graduate (loyola college of arts & sciences)': ['Graduate'],
  'graduate (ma public administration)': ['Graduate'],
  'graduate (mba & masters)': ['Graduate'],
  'graduate (md&master)': ['Graduate'],
  'graduate (mfa)': ['Graduate'],
  'graduate (master of education degree/master of education degree)': [
    'Graduate',
  ],
  'graduate (master of engineering program)': ['Graduate'],
  'graduate (masters)': ['Graduate'],
  'graduate (med/dent/law/pharm)': ['Graduate'],
  'graduate (national college of education)': ['Graduate'],
  'graduate (owen graduate school of management)': ['Graduate'],
  'graduate (peace corps programs)': ['Graduate'],
  'graduate (perkins school of theology)': ['Graduate'],
  'graduate (professional psychology)': ['Graduate'],
  'graduate (sit graduate institute)': ['Graduate'],
  'graduate (school of architecture)': ['Graduate'],
  'graduate (school of art)': ['Graduate'],
  'graduate (school of arts and sciences)': ['Graduate'],
  'graduate (school of behavioral science)': ['Graduate'],
  'graduate (school of business administration)': ['Graduate'],
  'graduate (school of business)': ['Graduate'],
  'graduate (school of communication)': ['Graduate'],
  'graduate (school of conflict transformation)': ['Graduate'],
  'graduate (school of continuing and professional studies)': ['Graduate'],
  'graduate (school of counseling)': ['Graduate'],
  'graduate (school of education)': ['Graduate'],
  'graduate (school of engineering)': ['Graduate'],
  'graduate (school of graduate & professional studies)': ['Graduate'],
  'graduate (school of jewish studies)': ['Graduate'],
  'graduate (school of law)': ['Graduate'],
  'graduate (school of management)': ['Graduate'],
  'graduate (school of music)': ['Graduate'],
  'graduate (school of nursing)': ['Graduate'],
  'graduate (school of occupational therapy)': ['Graduate'],
  'graduate (school of psychology)': ['Graduate'],
  'graduate (school of social work)': ['Graduate'],
  'graduate (school of teacher education)': ['Graduate'],
  'graduate (school of theology )': ['Graduate'],
  'graduate (sellinger school)': ['Graduate'],
  'graduate (seminary)': ['Graduate'],
  'graduate (simmons school of ed & hd)': ['Graduate'],
  'graduate (social work)': ['Graduate'],
  'graduate (st ambrose & accel-college of professional studies)': ['Graduate'],
  'graduate (stuart school of business)': ['Graduate'],
  'graduate (t&i)': ['Graduate'],
  'graduate (tfl)': ['Graduate'],
  'graduate (tlm)': ['Graduate'],
  'graduate (the guildhall)': ['Graduate'],
  'graduate (theological school)': ['Graduate'],
  'graduate (tuck school of business)': ['Graduate'],
  'graduate (ucla anderson/mba)': ['Graduate'],
  'graduate (university college)': ['Graduate'],
  'graduate (all but school of dentistry)': ['Graduate'],
  'graduate (except doctoral physical therapy)': ['Graduate'],
  'graduate certificates': ['Graduate'],
  'graduate jd': ['Graduate'],
  'graduate mfa in creative writing/ mfa in interdisciplinary studies': [
    'Graduate',
  ],
  'graduate physician assistant': ['Graduate'],
  'graduate school/continuing professional studies': ['Graduate'],
  'graduate and professional': ['Graduate', 'Other'],
  'graduate(school of business and leadership)': ['Graduate'],
  'graduate, doctoral': ['Graduate', 'Doctoral'],
  'graduate-nr': ['Graduate'],
  'graduate/ doctoral/1st prof': ['Graduate', 'Doctoral'],
  'graduate/doctoral': ['Graduate', 'Doctoral'],
  'graduate/doctoral (center for urban sciences)': ['Graduate', 'Doctoral'],
  'graduate/doctoral (gallatin school)': ['Graduate', 'Doctoral'],
  'graduate/doctoral (global public health)': ['Graduate', 'Doctoral'],
  'graduate/doctoral (graduate arts & sciences)': ['Graduate', 'Doctoral'],
  'graduate/doctoral (graduate school of arts and sciences)': [
    'Graduate',
    'Doctoral',
  ],
  'graduate/doctoral (law school)': ['Graduate', 'Doctoral'],
  'graduate/doctoral (school of continuing ed and professional studies)': [
    'Graduate',
    'Doctoral',
  ],
  'graduate/doctoral (school of dentisty)': ['Graduate', 'Doctoral'],
  'graduate/doctoral (school of nursing)': ['Graduate', 'Doctoral'],
  'graduate/doctoral (silver school of social work)': ['Graduate', 'Doctoral'],
  'graduate/doctoral (steinhardt school of education)': [
    'Graduate',
    'Doctoral',
  ],
  'graduate/doctoral (tisch school of the arts)': ['Graduate', 'Doctoral'],
  'graduate/doctorate': ['Graduate', 'Doctoral'],
  'graduate/non-prof': ['Graduate'],
  'graduate/ph.d': ['Graduate'],
  'graduate/professional': ['Graduate', 'Other'],
  'graduate/undergraduate': ['Graduate', 'Undergraduate'],
  graudate: ['Graduate'],
  'graudate (tesol)': ['Graduate'],
  'graudate/doctoral': ['Graduate', 'Doctoral'],
  'j.d/doctoral': ['Doctoral'],
  jd: ['Doctoral'],
  'jd, emba, amba': ['Doctoral'],
  'juris doctor': ['Doctoral'],
  'juris doctor (all)': ['Doctoral'],
  'juris doctorate': ['Doctoral'],
  'llm/jd': ['Graduate', 'Doctoral'],
  law: ['Doctoral'],
  'law school': ['Doctoral'],
  md: ['Doctoral'],
  ms: ['Masters'],
  masters: ['Masters'],
  'medical asst aas': ['Associates'],
  'medical lab tech aas': ['Associates'],
  medicine: ['Other'],
  ncd: ['Other'],
  online: ['Other'],
  optometry: ['Other'],
  'other professional programs': ['Other'],
  phd: ['Other'],
  pharmacy: ['Other'],
  'post baccalaureate': ['Other'],
  private: ['Other'],
  professional: ['Other'],
  'rt, ota, pta': ['Other'],
  seminary: ['Other'],
  'traditional undergraduate': ['Undergraduate'],
  'ug-ba-graduate': ['Graduate'],
  'undergrad/graduate/doctoral': ['Undergraduate', 'Graduate', 'Doctoral'],
  undergraduate: ['Undergraduate'],
  'undergraduate & graduate': ['Undergraduate', 'Graduate'],
  'undergraduate & graduate (art institute of boston)': [
    'Undergraduate',
    'Graduate',
  ],
  'undergraduate & graduate (online)': ['Undergraduate', 'Graduate'],
  'undergraduate (aas)': ['Undergraduate'],
  'undergraduate (adn)': ['Undergraduate'],
  'undergraduate (accounting systems)': ['Undergraduate'],
  'undergraduate (administrative asst.)': ['Undergraduate'],
  'undergraduate (adult degree completion)': ['Undergraduate'],
  'undergraduate (adult education programs)': ['Undergraduate'],
  'undergraduate (all adult education programs)': ['Undergraduate'],
  'undergraduate (all uw oshkosh college)': ['Undergraduate'],
  'undergraduate (all)': ['Undergraduate'],
  'undergraduate (arts and sciences)': ['Undergraduate'],
  'undergraduate (associate degree)': ['Undergraduate'],
  'undergraduate (ba intl studies)': ['Undergraduate'],
  'undergraduate (bachelors)': ['Undergraduate'],
  'undergraduate (business management)': ['Undergraduate'],
  'undergraduate (business technologies)': ['Undergraduate'],
  'undergraduate (business)': ['Undergraduate'],
  'undergraduate (college of arts and sciences )': ['Undergraduate'],
  'undergraduate (college of arts and sciences)': ['Undergraduate'],
  'undergraduate (college of cont. studies)': ['Undergraduate'],
  'undergraduate (college of liberal arts)': ['Undergraduate'],
  'undergraduate (college of management and business)': ['Undergraduate'],
  'undergraduate (college)': ['Undergraduate'],
  'undergraduate (continuing studies)': ['Undergraduate'],
  'undergraduate (day college)': ['Undergraduate'],
  'undergraduate (day)': ['Undergraduate'],
  'undergraduate (digital graphics)': ['Undergraduate'],
  'undergraduate (engineering)': ['Undergraduate'],
  'undergraduate (evening)': ['Undergraduate'],
  'undergraduate (flight school)': ['Undergraduate'],
  'undergraduate (game design)': ['Undergraduate'],
  'undergraduate (information technology)': ['Undergraduate'],
  'undergraduate (lesley college)': ['Undergraduate'],
  'undergraduate (liberal arts/science/engineering)': ['Undergraduate'],
  'undergraduate (massage therapy)': ['Undergraduate'],
  'undergraduate (medical assisting)': ['Undergraduate'],
  'undergraduate (misenheimer)': ['Undergraduate'],
  'undergraduate (nr)': ['Undergraduate'],
  'undergraduate (national college of education)': ['Undergraduate'],
  'undergraduate (office, project mang.)': ['Undergraduate'],
  'undergraduate (paralegal studies/cj)': ['Undergraduate'],
  'undergraduate (practical nursing)': ['Undergraduate'],
  'undergraduate (sit study abroad)': ['Undergraduate'],
  'undergraduate (school of adult studies)': ['Undergraduate'],
  'undergraduate (school of arts & science)': ['Undergraduate'],
  'undergraduate (school of arts & sciences)': ['Undergraduate'],
  'undergraduate (school of business admin)': ['Undergraduate'],
  'undergraduate (school of business)': ['Undergraduate'],
  'undergraduate (school of computer information system)': ['Undergraduate'],
  'undergraduate (school of criminal justice)': ['Undergraduate'],
  'undergraduate (school of culinary arts & hospitality)': ['Undergraduate'],
  'undergraduate (school of culinary arts and hospitality)': ['Undergraduate'],
  'undergraduate (school of education)': ['Undergraduate'],
  'undergraduate (school of health science)': ['Undergraduate'],
  'undergraduate (school of health sciences)': ['Undergraduate'],
  'undergraduate (school of liberal arts)': ['Undergraduate'],
  'undergraduate (school of nursing)': ['Undergraduate'],
  'undergraduate (school of professional studies/trine virtual campus)': [
    'Undergraduate',
  ],
  'undergraduate (school of undergraduate)': ['Undergraduate'],
  'undergraduate (sellinger school)': ['Undergraduate'],
  'undergraduate (st ambrose & accel-college of professional studies)': [
    'Undergraduate',
  ],
  'undergraduate (traditional - undergraduate)': ['Undergraduate'],
  'undergraduate (traditional)': ['Undergraduate'],
  'undergraduate (trinity arts and sciences)': ['Undergraduate'],
  'undergraduate (wec)': ['Undergraduate'],
  'undergraduate (assos of occup studies)': ['Undergraduate'],
  'undergraduate - college': ['Undergraduate'],
  'undergraduate - nys residents (vta eligible)': ['Undergraduate'],
  'undergraduate - nys residents (non-vta eligible)': ['Undergraduate'],
  'undergraduate : dc': ['Undergraduate'],
  'undergraduate all (traditional campus)': ['Undergraduate'],
  'undergraduate certificate': ['Certificate'],
  'undergraduate and graduate': ['Undergraduate', 'Graduate'],
  'undergraduate and masters': ['Undergraduate', 'Masters'],
  'undergraduate(day program)': ['Undergraduate'],
  'undergraduate(loyola college of arts & sciences)': ['Undergraduate'],
  'undergraduate(school of art science)': ['Undergraduate'],
  'undergraduate(school of business admin)': ['Undergraduate'],
  'undergraduate(school of business and leadership)': ['Undergraduate'],
  'undergraduate(school of computer info science)': ['Undergraduate'],
  'undergraduate(school of culinary art and hospitality mgt)': [
    'Undergraduate',
  ],
  'undergraduate(school of health science)': ['Undergraduate'],
  'undergraduate, biblical studies': ['Undergraduate'],
  'undergraduate, grad': ['Undergraduate', 'Graduate'],
  'undergraduate, graduate': ['Undergraduate', 'Graduate'],
  'undergraduate-non nys residents': ['Undergraduate'],
  'undergraduate/certificate': ['Undergraduate', 'Certificate'],
  'undergraduate/graduate': ['Undergraduate', 'Graduate'],
  'undergraduate/graduate (cps)': ['Undergraduate', 'Graduate'],
  'undergraduate/graduate (metropolitan school of professional studies)': [
    'Undergraduate',
    'Graduate',
  ],
  'undergraduate/graduate (out of state)': ['Undergraduate', 'Graduate'],
  'undergraduate/graduate/doctoral': ['Undergraduate', 'Graduate', 'Doctoral'],
  'undergraduate: dc': ['Undergraduate'],
};

export const DISTANCE_DROPDOWN_OPTIONS = [
  { value: '5', label: 'within 5 miles' },
  { value: '15', label: 'within 15 miles' },
  { value: '25', label: 'within 25 miles' },
  { value: '50', label: 'within 50 miles' },
  { value: '75', label: 'within 75 miles' },
];

export const lacpCategoryList = [
  'all',
  'license',
  'certification',
  'prep course',
];
