import environment from 'platform/utilities/environment';
import ENVIRONMENTS from '../../../site/constants/environments';

export const eauthEnvironmentPrefixes = {
  [ENVIRONMENTS.LOCALHOST]: 'pint.',
  [ENVIRONMENTS.VAGOVDEV]: 'int.',
  [ENVIRONMENTS.VAGOVSTAGING]: 'sqa.',
  [ENVIRONMENTS.VAGOVPROD]: '',
};

export const ssoKeepAliveEndpoint = () => {
  const envPrefix = eauthEnvironmentPrefixes[environment.BUILDTYPE];
  return `https://${envPrefix}eauth.va.gov/keepalive`;
};
