/**
 * @module constants
 * @description Constants for VA Form 21-2680 - Examination for Housebound Status or Aid & Attendance
 */

/**
 * Main title for the form application
 * @constant {string}
 */
export const TITLE =
  'Apply for Aid and Attendance benefits or Housebound allowance';

/**
 * Subtitle displaying the form number
 * @constant {string}
 */
export const SUBTITLE =
  'Examination for Housebound Status or Permanent Need for Regular Aid and Attendance (VA Form 21-2680)';

/**
 * ADL assistance options (Item 27)
 * @constant {Object}
 */
export const ADL_OPTIONS = {
  BATHING: 'bathing',
  TOILETING: 'toileting',
  TRANSFERRING: 'transferring',
  EATING: 'eating_self_feeding',
  DRESSING: 'dressing',
  HYGIENE: 'hygiene',
  AMBULATING: 'ambulating_in_home',
  MEDICATION: 'medication_management',
  OTHER: 'other',
};

/**
 * Locomotion aid options (Item 37)
 * @constant {Object}
 */
export const LOCOMOTION_AIDS = {
  CANES: 'canes',
  BRACES: 'braces',
  CRUTCHES: 'crutches',
  ASSISTANCE_PERSON: 'assistance_of_another_person',
};

/**
 * Distance options (Item 37)
 * @constant {Object}
 */
export const DISTANCE_OPTIONS = {
  ONE_BLOCK: '1_block',
  FIVE_SIX_BLOCKS: '5_6_blocks',
  ONE_MILE: '1_mile',
  OTHER: 'other',
};

/**
 * API Endpoints
 * @constant {Object}
 */
export const API_ENDPOINTS = {
  downloadPdf: '/form212680/download_pdf',
};
