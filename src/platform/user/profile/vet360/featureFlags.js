import environment from 'platform/utilities/environment';

const featureFlags = Object.freeze({
  receiveTextMessages: !environment.isProduction(),
});

export default featureFlags;
