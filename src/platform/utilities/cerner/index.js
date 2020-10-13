// Relative imports.
import environment from 'platform/utilities/environment';

// Cerner facilities that do not have the `isCerner` flag set to true
// 757: Chalmers P. Wylie Veterans Outpatient Clinic
export const CERNER_FACILITY_IDS = ['757'];

// Not all Cerner facilities have the same capabilities. These blocklists are
// used to determine which facilities lack certain capabilities.
// Facilities that are Cerner but do not have Cerner prescription features:
export const CERNER_RX_BLOCKLIST = ['757'];
// Facilities that are Cerner but do not have Cerner secure messaging features:
export const CERNER_MESSAGING_BLOCKLIST = ['757'];
// Facilities that are Cerner but do not have Cerner appointment features:
export const CERNER_APPOINTMENTS_BLOCKLIST = [];

export const getCernerURL = path => {
  const host = environment.isProduction()
    ? 'https://patientportal.myhealth.va.gov'
    : 'https://ehrm-va-test.patientportal.us.healtheintent.com';

  return `${host}/clear-session?to=${encodeURIComponent(`${host}${path}`)}`;
};

export const appointmentsToolLink =
  '/health-care/schedule-view-va-appointments/appointments';
