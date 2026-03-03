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
  echo "  🧪 CYPRESS E2E TEST STABILITY CHECK"
  echo "============================================================"
  echo ""
  echo "  The following Cypress test files have been modified:"
  echo ""
  echo "$cypress_files" | while read -r f; do echo "    • $f"; done
  echo ""

  # Build the comma-separated spec list for cy:run
  spec_list=""
  while IFS= read -r f; do
    if [[ -n "$f" ]]; then
      if [[ -z "$spec_list" ]]; then
        spec_list="$f"
      else
        spec_list="$spec_list,$f"
      fi
    fi
  done <<< "$cypress_files"

  # Run changed Cypress specs automatically
  echo "  🔄 Running changed Cypress specs to verify stability..."
  echo ""

  if ! yarn cy:run --spec "$spec_list"; then
    echo ""
    echo "============================================================"
    echo "  ❌ CYPRESS TESTS FAILED — push blocked."
    echo ""
    echo "  Fix the failing tests before pushing. Tips:"
    echo ""
    echo "  • Use cy:open to see the exact point of failure"
    echo "  • Check for race conditions (missing cy.wait, assertions before data loads)"
    echo "  • Ensure cy.injectAxe() is called before cy.axeCheck() after page loads"
    echo "  • Use .should('exist') or .should('be.visible') before .click()"
    echo ""
    echo "  📖 Full guidelines:"
    echo "     https://depo-platform-documentation.scrollhelp.site/developer-docs/writing-an-end-to-end-test"
    echo "     https://depo-platform-documentation.scrollhelp.site/developer-docs/flaky-test-management-in-cypress"
    echo "     https://depo-platform-documentation.scrollhelp.site/developer-docs/end-to-end-testing-with-cypress"
    echo "============================================================"
    echo ""
    exit 1
  fi

  echo ""
  echo "  ✅ All Cypress tests passed. Continuing with push..."
  echo ""
fi
