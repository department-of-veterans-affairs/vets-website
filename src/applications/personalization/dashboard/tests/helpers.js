import environment from 'platform/utilities/environment';

const shouldMockApiRequest =
  environment.isLocalhost && !window.Cypress && !window.VetsGov.pollTimeout;
