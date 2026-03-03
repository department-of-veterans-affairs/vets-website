#!/bin/bash

if [[ ! `git log origin/main.. --no-merges` ]]; then
  echo "No commits to push! Add at least one commit to push this branch to origin."
  exit 1
fi

# --- Test Stability Review Reminder ---
# Check if any Cypress e2e test files were changed in commits being pushed
changed_files=$(git diff --name-only origin/main...HEAD)
cypress_files=$(echo "$changed_files" | grep -E '\.cypress\.spec\.(js|jsx)$' || true)

if [[ -n "$cypress_files" ]]; then
  echo ""
  echo "============================================================"
  echo "  ⚠️  CYPRESS E2E TEST STABILITY REVIEW CHECKLIST"
  echo "============================================================"
  echo ""
  echo "  The following Cypress test files have been modified:"
  echo ""
  echo "$cypress_files" | while read -r f; do echo "    • $f"; done
  echo ""
  echo "  Please verify the Test Stability Review steps:"
  echo ""
  echo "  🔁 FLAKY TEST DETECTION"
  echo "  1. Run each test 20-30 times in a loop to detect flaky tests"
  echo "     Wrap describe/it blocks in: for (let i = 0; i < 20; i += 1) { ... }"
  echo "  2. Use cy:open (headed mode) to identify exact point of failure"
  echo "     (cy:run headless mode does not give accurate line numbers)"
  echo ""
  echo "  ⚡ RACE CONDITIONS"
  echo "  3. Use cy.wait('@alias') for all intercepted API calls before assertions"
  echo "  4. Use .should('exist') or .should('be.visible') before .click()"
  echo "  5. Use cy.click({ waitForAnimations: true }) for animated elements"
  echo ""
  echo "  ♿ ACCESSIBILITY (REQUIRED)"
  echo "  6. Call cy.injectAxe() after every page load (cy.visit, cy.wait, cy.click"
  echo "     that loads a new page) BEFORE calling cy.axeCheck()"
  echo "  7. Run axeCheck on the main body of the application on EACH page"
  echo ""
  echo "  🏗️  TEST STRUCTURE & CONVENTIONS"
  echo "  8. Mock ALL API responses before starting the test"
  echo "  9. Each it() block must be independent of other it() blocks"
  echo "  10. Assert that each navigation is successful"
  echo "  11. Separate page navigation from form field input"
  echo "      - Main test file for navigation, assertions, and calling helpers"
  echo "      - Helper file for filling out forms"
  echo ""
  echo "  👤 MOCK USERS & DATA"
  echo "  12. Use cy.login(userData) to simulate signed-in sessions"
  echo "  13. Custom user objects must match the /v0/user API response shape"
  echo "      Copy & modify the default mockUser — don't build from scratch"
  echo "      (see src/platform/testing/e2e/cypress/support/commands/login.js)"
  echo ""
  echo "  🎯 SELECTORS (in order of preference)"
  echo "  14. Prefer Testing Library: findByRole > findByLabelText > findByText"
  echo "  15. Use data-testid as a LAST RESORT (avoid cy.get with CSS selectors)"
  echo ""
  echo "  📖 Full guidelines:"
  echo "     https://depo-platform-documentation.scrollhelp.site/developer-docs/writing-an-end-to-end-test"
  echo "     https://depo-platform-documentation.scrollhelp.site/developer-docs/flaky-test-management-in-cypress"
  echo "     https://depo-platform-documentation.scrollhelp.site/developer-docs/end-to-end-testing-with-cypress"
  echo ""
  echo "============================================================"
  echo ""

  # Prompt for confirmation
  exec < /dev/tty
  read -r -p "  Have you completed the Test Stability Review? (y/n) " answer
  exec <&-

  if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
    echo ""
    echo "  ❌ Push aborted. Please complete the Test Stability Review before pushing."
    echo ""
    exit 1
  fi

  echo ""
  echo "  ✅ Continuing with push..."
  echo ""
fi
