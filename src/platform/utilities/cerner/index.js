// Relative imports.
import environment from 'platform/utilities/environment';

export const CERNER_FACILITY_IDS = ['668', '757'];

export const getCernerURL = path => {
  const root = environment.isProduction()
    ? 'https://patientportal.myhealth.va.gov'
    : 'https://ehrm-va-test.patientportal.us.healtheintent.com';

  return `${root}${path}`;
};
