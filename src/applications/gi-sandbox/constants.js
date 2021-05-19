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

export const KEY_CODES = Object.freeze({
  enterKey: 13,
});

/**
 * Mapbox init values
 */
export const MapboxInit = {
  zoomInit: 2,
  centerInit: {
    longitude: -99.27246093750001,
    latitude: 40.17887331434698,
  },
};

/**
 * Mapbox api request types
 */

export const TypeList = ['place', 'region', 'postcode', 'locality'];

/**
 * Max search area in miles
 */
export const MAX_SEARCH_AREA = 500;

/**
 * Min radius search area in miles
 */
export const MIN_RADIUS = 10;

/**
 * Defines the ± change in bounding box size for the map when changing zoom
 */
export const BOUNDING_RADIUS = 0.75;

export const TABS = Object.freeze({
  name: 'name',
  location: 'location',
});

export const ariaLabels = Object.freeze({
  learnMore: {
    giBillBenefits: 'Learn more about VA education and training programs',
    post911Chapter33: 'Learn more about Cumulative Post-9/11 service',
    preferredProvider: 'Learn more about Preferred providers',
    montgomeryGIBill:
      'Learn more about how the length of Montgomery GI Bill active-duty service affects your benefits',
    reapActiveDuty:
      'Learn more about how the length of your REAP active-duty service affects your benefits',
    vetTecProgram: 'Learn more about the VET TEC program',
    tuitionAndFees: 'Learn more about the tuition and fees covered by VET TEC',
    scholarships: 'Learn more about what types of scholarships to include',
    paysToProvider: 'Learn more about how we pay providers',
    numberOfStudents:
      'Learn more about how we calculate the number of GI Bill students',
    tuitionFeesPerYear:
      'Learn more about what costs to include for your tuition and fees',
    inStateTuitionFeesPerYear:
      'Learn more about why we ask for in-state tuition and fees',
    yellowRibbonProgram: 'Learn more about the Yellow Ribbon Program',
    calcScholarships: 'Learn more about what to include for scholarships',
    calcEnrolled:
      'Learn more about enrollment status and how it may affect your education benefits',
    calcSchoolCalendar: 'Learn more about school calendar options',
    onlineOnlyDistanceLearning:
      'Learn more about how we calculate your housing allowance based on where you take classes',
    kickerEligible: 'Learn more about the kicker bonus',
    whenUsedGiBill: 'Learn more about your monthly housing allowance rate',
    calcWorking:
      'Learn more about how the number of hours you work affects your housing allowance',
    tuitionFees: 'Learn more about tuition and fee payments, and payment caps',
    housingAllowance:
      'Learn more about how we calculate your housing allowance',
    bookStipend: 'Learn more about how we calculate your annual book stipend',
    cautionaryWarning: 'Learn more about cautionary Warnings',
    majorityOfClasses: 'Learn more about the location-based housing allowance',
    militaryTuitionAssistance:
      'Learn more about how military tuition assistance affects your benefits',
  },
});
