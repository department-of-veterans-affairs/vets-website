// Relative imports.
import environment from 'platform/utilities/environment';

// Cerner facilities that do not have the `isCerner` flag set to true
export const CERNER_FACILITY_IDS = [
  '463', // Alaska VA
  '531', // Boise, ID
  '648', // Portland, OR
  '653', // Roseburg (Roseburg OR)
  '663', // Puget Sound (Seattle WA)
  '668', // Mann Grandstaff
  '687', // Walla Walla, WA
  '692', // White City, OR
  '757', // Chalmers P. Wylie Veterans Outpatient Clinic
];

// Not all Cerner facilities have the same capabilities. These blocklists are
// used to determine which facilities lack certain capabilities.
// Facilities that are Cerner but do not have Cerner prescription features:
export const CERNER_RX_BLOCKLIST = ['757'];
// Facilities that are Cerner but do not have Cerner secure messaging features:
export const CERNER_MESSAGING_BLOCKLIST = ['757'];
// Facilities that are Cerner but do not have Cerner appointment features:
export const CERNER_APPOINTMENTS_BLOCKLIST = [];
// Facilities that are Cerner but do not have Cerner medical records features:
export const CERNER_MEDICAL_RECORDS_BLOCKLIST = ['757'];
// Facilities that are Cerner but do not have Cerner test and lab results
// features:
export const CERNER_TEST_RESULTS_BLOCKLIST = ['757'];

export const getCernerURL = path => {
  const host = environment.isProduction()
    ? 'https://patientportal.myhealth.va.gov'
    : 'https://ehrm-va-test.patientportal.us.healtheintent.com';

  return `${host}/clear-session?to=${encodeURIComponent(`${host}${path}`)}`;
};

export const appointmentsToolLink =
  '/health-care/schedule-view-va-appointments/appointments';
