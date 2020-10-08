// Relative imports.
import environment from 'platform/utilities/environment';

export const CERNER_FACILITY_IDS = ['757', '668'];
export const isCernerLive = !environment.isProduction();

export const getCernerURL = path => {
  const host = environment.isProduction()
    ? 'https://patientportal.myhealth.va.gov'
    : 'https://ehrm-va-test.patientportal.us.healtheintent.com';

  return `${host}/clear-session?to=${encodeURIComponent(`${host}${path}`)}`;
};

export const appointmentsToolLink =
  '/health-care/schedule-view-va-appointments/appointments';
