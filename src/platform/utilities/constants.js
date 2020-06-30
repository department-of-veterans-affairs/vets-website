// Relative imports.
import environment from 'platform/utilities/environment';

// TODO: Rename this to something that makes more sense
export const requestStates = {
  notCalled: 'not called',
  pending: 'pending',
  succeeded: 'succeeded',
  failed: 'failed',
};

export const getCernerUrl = path => {
  const root = environment.isProduction()
    ? 'https://patientportal.myhealth.va.gov/'
    : 'https://ehrm-va-test.patientportal.us.healtheintent.com/';

  return `${root}${path}`;
};
