// Re-apply this extension in beforeEach to handle jsdom 16+ constructor isolation
// Each JSDOM instance has its own HTMLElement prototype, so we must add methods
// to the current window's HTMLElement, not the one at module load time.
beforeEach(() => {
  if (global.HTMLElement && !global.HTMLElement.prototype.vaButtonGetByText) {
    global.HTMLElement.prototype.vaButtonGetByText = function vaButtonGetByText(
      buttonText,
    ) {
      return this.querySelector(`va-button[text="${buttonText}"]`);
    };
  }
});
