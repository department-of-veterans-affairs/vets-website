// Helper function to query va-button elements by text attribute
// This is exported as a standalone function instead of a prototype extension
// to ensure compatibility with jsdom/happy-dom testing environments
export function vaButtonGetByText(container, buttonText) {
  return container.querySelector(`va-button[text="${buttonText}"]`);
}
