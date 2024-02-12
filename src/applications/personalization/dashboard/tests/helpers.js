import environment from '~/platform/utilities/environment';

export const shouldMockApiRequest = () =>
  environment.isLocalhost() && !window.Cypress && !window.VetsGov.pollTimeout;
