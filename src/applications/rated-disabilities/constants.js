import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const DISABLED_ENVIRONMENTS = ['localhost'];
// This should only be set to `true` to enable RUM locally
// Otherwise this should be `false`
const overrideChecks = false;

export const canUseRUM = () => {
  const env = environment.vspEnvironment();

  const alreadyInitialized = Boolean(window.DD_RUM?.getInitConfiguration());
  const inTestEnv = window.Cypress || window.Mocha;
  const inDisabledEnv = DISABLED_ENVIRONMENTS.includes(env);

  return !alreadyInitialized && !inTestEnv && !inDisabledEnv;
};

// This is used in useDataDogRum
export const enableRUM = () => {
  return canUseRUM() || overrideChecks;
};
