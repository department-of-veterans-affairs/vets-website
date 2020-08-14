// Relative imports.
import environment from 'platform/utilities/environment';

export const CERNER_FACILITY_IDS = ['757'];
export const isCernerLive = !environment.isProduction();

export const getCernerURL = path => {
  const root = environment.isProduction()
    ? 'https://patientportal.myhealth.va.gov'
    : 'https://ehrm-va-test.patientportal.us.healtheintent.com';

  return `${root}${path}`;
};
