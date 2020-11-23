export function createPreferenceBody(preferences, emailAddress) {
  return {
    ...preferences,
    emailAddress,
    notificationFrequency: 'Each new message',
    emailAllowed: true,
  };
}
