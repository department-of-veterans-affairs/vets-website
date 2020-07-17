import ENVIRONMENTS from 'site/constants/environments';

export const eauthEnvironmentPrefixes = {
  [ENVIRONMENTS.LOCALHOST]: 'pint.',
  [ENVIRONMENTS.VAGOVDEV]: 'int.',
  [ENVIRONMENTS.VAGOVSTAGING]: 'sqa.',
  [ENVIRONMENTS.VAGOVPROD]: '',
};
