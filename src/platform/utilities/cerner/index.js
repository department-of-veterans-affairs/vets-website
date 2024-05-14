// Relative imports.
import environment from 'platform/utilities/environment';

export const getCernerURL = (path, useSingleLogoutPaths = false) => {
  const host = environment.isProduction()
    ? 'https://patientportal.myhealth.va.gov'
    : 'https://staging-patientportal.myhealth.va.gov';

  if (useSingleLogoutPaths) {
    return `${host}${path}?authenticated=true`;
  }

  return `${host}${path}?authenticated=true`;
};

export const appointmentsToolLink = '/my-health/appointments';
