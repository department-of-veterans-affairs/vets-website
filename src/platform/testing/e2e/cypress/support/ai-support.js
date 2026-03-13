/**
 * Enhanced Cypress support: command log and console error capture on failure.
 *
 * Adds to the standard support/index.js:
 *   1. Command log capture — the full Cypress sidebar as text on failure
 *   2. Browser console error capture — JS errors that prevent rendering
 *   3. Screenshot path prediction — co-located with the command log output
 *
 * This bridges the gap between the rich browser-side state and the lossy
 * CLI error output that Cypress reporters provide.
 *
 * Loaded by the standard support/index.js when the enhanced runner is active
 * (detected via CYPRESS_ENHANCED_RUNNER env var).
 */

// ---------------------------------------------------------------------------
// Command log capture
// ---------------------------------------------------------------------------

let currentTestLogs = [];
let consoleErrors = [];

// Collect every command log entry as it happens (browser-side event)
Cypress.on('log:added', attrs => {
  const entry = {
    name: attrs.name,
    message: typeof attrs.message === 'string' ? attrs.message : '',
    state: attrs.state,
    type: attrs.type,
  };

  if (
    ['command', 'parent', 'child', 'assertion'].includes(
      attrs.instrument || attrs.type,
    )
  ) {
    currentTestLogs.push(entry);
  }
});

// Update log state when it changes (e.g., assertion retries that eventually fail)
Cypress.on('log:changed', attrs => {
  const existing = currentTestLogs.find(
    l =>
      l.name === attrs.name &&
      l.message === (typeof attrs.message === 'string' ? attrs.message : ''),
  );
  if (existing) {
    existing.state = attrs.state;
  }
});

// Reset logs before each test
Cypress.on('test:before:run', () => {
  currentTestLogs = [];
  consoleErrors = [];
});

// ---------------------------------------------------------------------------
// Browser console error capture
// ---------------------------------------------------------------------------

// Capture console.error calls from the app under test
Cypress.on('window:before:load', win => {
  const originalError = win.console.error;
  // eslint-disable-next-line no-param-reassign
  win.console.error = (...args) => {
    const msg = args
      .map(a => (typeof a === 'string' ? a : JSON.stringify(a)))
      .join(' ');
    // Skip noisy/known noise
    if (!msg.includes('Download the React DevTools') && !msg.includes('act(')) {
      consoleErrors.push(
        msg.length > 500 ? `${msg.substring(0, 500)}...` : msg,
      );
    }
    originalError.apply(win.console, args);
  };

  // Also capture unhandled promise rejections
  win.addEventListener('unhandledrejection', event => {
    const msg = event.reason
      ? event.reason.message || String(event.reason)
      : 'Unknown rejection';
    consoleErrors.push(
      `[unhandledrejection] ${
        msg.length > 500 ? `${msg.substring(0, 500)}...` : msg
      }`,
    );
  });
});

// ---------------------------------------------------------------------------
// Dump everything on failure
// ---------------------------------------------------------------------------

afterEach(function captureCommandLog() {
  const test = this.currentTest;
  if (test.state === 'failed') {
    // Filter out code-coverage noise from command logs
    const filteredLogs = currentTestLogs.filter(
      entry =>
        !entry.message.includes('__coverage__') &&
        !entry.message.includes('code-coverage'),
    );

    // Build a text representation of the command log (like the sidebar)
    const logLines = filteredLogs.map(entry => {
      let prefix = '    ';
      if (entry.state === 'failed') prefix = 'FAIL';
      else if (entry.state === 'passed') prefix = ' ok ';
      const msg = entry.message ? `: ${entry.message}` : '';
      return `  ${prefix} ${entry.name}${msg}`;
    });

    const errMsg = test.err
      ? `${test.err.name || 'Error'}: ${test.err.message}`
      : 'Unknown error';

    // Predict screenshot path for this test
    const specBasename = Cypress.spec.relative.replace(/\//g, ' -- ');
    const screenshotName = `${specBasename} -- ${test.fullTitle()} (failed).png`;
    const screenshotDir = 'cypress/screenshots';

    const sections = [
      '',
      `--- FAILED: ${test.fullTitle()} ---`,
      `Error: ${errMsg}`,
      '',
      'Command log:',
      ...logLines,
    ];

    // Add console errors if any were captured
    if (consoleErrors.length > 0) {
      sections.push('');
      sections.push('Console errors:');
      // Dedupe and limit
      const unique = [...new Set(consoleErrors)].slice(0, 10);
      unique.forEach(e => sections.push(`  ${e}`));
    }

    // Add screenshot path
    sections.push('');
    sections.push(`Screenshot: ${screenshotDir}/${screenshotName}`);

    sections.push('---');
    sections.push('');

    cy.task('log', sections.join('\n'), { log: false });
  }
});
