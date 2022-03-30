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
    specializedMission: 'Learn more about specialized mission',
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
