import environment from 'platform/utilities/environment';

const featureFlags = Object.freeze({
  directDeposit: !environment.isProduction(),
});

export default featureFlags;
