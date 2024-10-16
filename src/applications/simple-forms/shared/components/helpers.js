export function isTest() {
  return !!(
    window?.Cypress ||
    window?.Mocha ||
    process?.env?.NODE_ENV === 'test'
  );
}
