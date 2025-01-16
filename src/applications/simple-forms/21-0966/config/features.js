import environment from 'platform/utilities/environment';

export function useNewConfirmationPage() {
  return environment.isLocalhost() || environment.isDev();
}
