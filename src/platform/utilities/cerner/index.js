// Relative imports.
import environment from 'platform/utilities/environment';

export const CERNER_FACILITY_IDS = ['757'];
export const isCernerLive = !environment.isProduction();

export const getCernerURL = path => {
  const root = environment.isProduction()
    ? encodeURIComponent(
        'https://patientportal.myhealth.va.gov/clear-session?to=https://patientportal.myhealth.va.gov',
      )
    : encodeURIComponent(
        'https://ehrm-va-test.patientportal.us.healtheintent.com/clear-session?to=https://ehrm-va-test.patientportal.us.healtheintent.com',
      );

  return `${root}${path}`;
};

export const appointmentsToolLink =
  '/health-care/schedule-view-va-appointments/appointments';
