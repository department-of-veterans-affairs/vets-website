# Claims Status E2E Testing

## Introduction
- In November 2025 the E2E tests for the `claims-status` application were rewritten to improve coverage, maintainability, and scalability while modernizing the E2E tests
- This README for `claims-status` E2E testing is to align the team on best practices gathered from Cypress, VA Platform, and the team

## Directory Structure

```
tests/
├── claim-letters/       # Claim letters page tests
├── details/             # Detail page tests
│   ├── appeals/         # Appeals detail page tests
│   └── claims/          # Claims detail page tests
├── shared/              # Cross-cutting tests (loading states, etc.)
└── your-claims/         # List page tests

support/
├── fixtures/            # Test data factories by endpoint
│   ├── appeals.js       # Appeal data for /v0/appeals
│   ├── benefitsClaims.js # Claim data for /v0/benefits_claims
│   ├── claimLetters.js  # Claim letter data for /v0/claim_letters
│   └── stemClaims.js    # STEM claim data for /v0/education_benefits_claims/stem_claim_status
└── helpers/             # Reusable test utilities
    ├── mocks.js         # API mocking (mockFeatureToggles)
    ├── setup.js         # Test setup (setupClaimTest, setupAppealTest)
    └── assertions.js    # Common assertions
```

## Writing Tests

### Element Selection

- **Prefer `cy.findByRole()`** for interactive and structural elements (buttons, links, headings, navigation, etc.) - checks semantics, visibility, and accessibility
- **Use `cy.findByText()`** for static text content (paragraphs, labels, non-interactive text) - also has visibility check built-in
- **Use `cy.contains()`** when text spans multiple elements (e.g., `<p>Call us at <va-telephone>...</va-telephone></p>`) - `findByText` only matches text within a single element. Always add `.should('be.visible')` since `contains` doesn't check visibility.
- **Other `.should()` use cases**: `.should('not.exist')` for conditional UI, `.should('have.attr', 'href', '/path')` for links
- **Tip**: Check element roles via Developer Tools > Elements Tab > Accessibility Tab
- **Remember**: If important UI elements lack roles, consider improving semantics (e.g., use `<h2>` instead of styled `<span>` for headings)

### Test Organization

Organize tests into sub-folders (`details`, `shared`, `your-claims`, etc) rather than having them all at root. Use focused helper functions instead of page objects.

#### `describe()` vs `context()`

While technically identical (both are aliases from Mocha), we use them for different semantic purposes:

- **`describe()`**: Groups tests by feature or functionality
  ```javascript
  describe('Claim type titles', () => {
    it('should display burial claim title', () => {})
  })
  ```

- **`context()`**: Groups tests by preconditions or states, using "when..." or "given..." wording
  ```javascript
  context('when claim is open', () => {
    it('should display In Progress badge', () => {})
  })
  ```

This convention improves test readability and clearly communicates the test's purpose and conditions.

### Setup Helpers

Use setup helpers in `support/helpers/setup.js` to encapsulate common test initialization patterns. For example, `setupClaimTest({ claim, path })` handles the API intercept, page visit, and axe injection in one call—keeping individual tests focused on assertions.

### Test Fixtures

**Only expose parameters when tests need them:**
```javascript
// Good: Only expose what tests actually vary
export const createTrackedItem = ({
  displayName = 'Medical Records Request',
} = {}) => ({
  id: 1,
  status: 'NEEDED_FROM_YOU',
  displayName,
  // ...
});
```

### Data-Driven Tests

Use `forEach` to test multiple variations without duplicating test logic. Define an array of test cases with inputs and expected outputs, then iterate:

```javascript
const phases = [
  { status: 'CLAIM_RECEIVED', expected: 'Step 1 of 5: Claim received' },
  { status: 'INITIAL_REVIEW', expected: 'Step 2 of 5: Initial review' },
];

phases.forEach(({ status, expected }) => {
  it(`should display ${expected}`, () => {
    setupClaimTest({ claim: createBenefitsClaim({ status }) });
    cy.findByText(expected);
    cy.axeCheck();
  });
});
```

### Feature Flag Testing

Group feature flag tests in a dedicated `describe` block using named parameters:

```javascript
describe('Feature flag: cstShowDocumentUploadStatus', () => {
  context('when enabled', () => {
    beforeEach(() => {
      mockFeatureToggles({ showDocumentUploadStatus: true });
    });

    it('should show the new behavior', () => {
      // Test enabled behavior
    });
  });

  context('when disabled', () => {
    beforeEach(() => {
      mockFeatureToggles({ showDocumentUploadStatus: false });
    });

    it('should show the old behavior', () => {
      // Test disabled behavior
    });
  });
});
```

#### Permanently Enabled Flags

The following flags are permanently enabled in production and should **not** have "disabled" tests.

- `claim_letters_access`
- `cst_claim_phases`
- `cst_include_ddl_5103_letters`
- `cst_include_ddl_boa_letters`
- `cst_timezone_discrepancy_mitigation`
- `stem_automated_decision`

These are set as defaults in `support/helpers/mocks.js` via `mockFeatureToggles()`.

### Path Constants

Define path constants at the top of test files for reusable URL segments:

```javascript
const OVERVIEW_PATH = 'overview';
const NEEDED_FROM_OTHERS_PATH = 'needed-from-others/123456';

// Usage
setupClaimTest({ claim: createBenefitsClaim(), path: OVERVIEW_PATH });
```

### Syntax Notes

Minor preferences for consistency:

- **`findByText` doesn't need `.should('be.visible')`** - visibility check is built-in
- **Prefer full text match over regex** - use regex only when text contains dynamic values
- **Minimal fixture props** - only expose parameters that tests actually vary
- **Flatten single-it contexts** - if a `context()` has only one `it()`, merge the condition into the `it()` description

## Code Coverage

Use branch coverage as our primary coverage metric. It measures whether we test all decision paths (if/else, switch cases), not just whether code executes.

Note: Code coverage requires this PR to be merged - https://github.com/department-of-veterans-affairs/vets-website/pull/39252

### How to Run

```bash
# Clear cache and old coverage data
rm -rf .babelcache config/.nyc_output coverage

# Start dev server with coverage
CODE_COVERAGE=true yarn watch --env entry=claims-status

# Wait for: "webpack compiled successfully"

# In a separate terminal, run E2E tests (takes 5-10 minutes)
CODE_COVERAGE=true yarn cy:run --spec "src/applications/claims-status/tests/e2e/**/*.cypress.spec.js"

# Generate coverage report
npx nyc report --reporter=html --reporter=json-summary --reporter=text

# View HTML report
open coverage/index.html
```

### Progress

| Stage                                                                                 | % Stmts | % Branch | % Funcs | % Lines |
| --------------------------------------------------------------------------------------| ------- | -------- | ------- | ------- |
| Initial                                                                               | 75.07   | 62.43    | 82.86   | 75.13   |
| [First PR](https://github.com/department-of-veterans-affairs/vets-website/pull/40123) | 76.58   | 64.54    | 83.61   | 76.62   |
| [Second PR](https://github.com/department-of-veterans-affairs/vets-website/pull/40467) | 78.94   | 69.34    | 85.33   | 78.88   |
| [Third PR](https://github.com/department-of-veterans-affairs/vets-website/pull/40825) | 80.13   | 70.10    | 86.22   | 80.09   |
| [Fourth PR](https://github.com/department-of-veterans-affairs/vets-website/pull/40909) | 81.68   | 73.36    | 87.54   | 81.64   |


### Next Priority

| Priority | File                       | Branch % | Uncovered Lines                     |
| -------- | -------------------------- | -------- | ----------------------------------- |
| 1        | appeals-v2-helpers.jsx     | 27.96    | 1646-1965,1984-1986,2022,2056,2069  |
| 2        | Decision.jsx               | 53.84    | 12,15,43,57                         |
| 3        | AppealsV2StatusPage.jsx    | 64.70    | 64-72,86-87                         |
| 4        | helpers.js                 | 68.53    | 1493-1495,1500,1522,1531,1562,1620  |
| 5        | FilesReceived.jsx          | 82.22    | 29,54,100                           |
| 6        | Standard5103NoticePage.jsx | 0        | 20-86                               |
| 7        | StemClaimStatusPage.jsx    | 0        | 15-88                               |
| 8        | StemDeniedDetails.jsx      | 0        | 15-221                              |

## Reference

### Cypress Best Practices

Source: [Cypress Best Practices](https://docs.cypress.io/app/core-concepts/best-practices)

1. Test specs in isolation and take control of your application's state ([source](https://docs.cypress.io/app/core-concepts/best-practices#Organizing-Tests-Logging-In-Controlling-State))
   1. DON'T share page objects
   2. DON'T use UI to build up state
   3. Set state directly: intercept api calls, set redux state, set time of the system
2. Use `data-*` attributes to provide context to your selectors and isolate them from CSS or JS changes ([source](https://docs.cypress.io/app/core-concepts/best-practices#Organizing-Tests-Logging-In-Controlling-State))
   1. Never: `cy.get('.btn.btn-large').click()` - coupled to styling
   2. Depends: `cy.contains('Submit').click()` - coupled to text content
   3. Always: `cy.get('[data-testid="submit"]').click()` - not coupled to styling or content of an element
   4. `data-testid` vs `contains` rule - If the content changed would you want the test to fail?
      1. If the answer is yes: then use `contains`
      2. If the answer is no: then use `data-testid` attribute
3. Cypress and Testing Library: Cypress philosophy aligns closely with Testing Library's ethos and approach to writing tests ([source](https://docs.cypress.io/app/core-concepts/best-practices#Cypress-and-Testing-Library))
   1. You can use the Cypress Testing Library package (installed in vets-website) to use the familiar testing library methods (like findByRole, findByLabelText, etc...) to select elements in Cypress specs
4. Use closures (`.then`) to access what Commands yield you ([source](https://docs.cypress.io/app/core-concepts/variables-and-aliases))
   1. You rarely have to ever use const, let, or var in Cypress. If you're using them, you will want to do some refactoring.
   2. You cannot assign or work with the return values of any Cypress command. Commands are enqueued and run asynchronously
   3. To access what each Cypress command yields you use .then()
   4. The one exception to this rule is when you are dealing with mutable objects (that change state). When things change state you often want to compare an object's previous value to the next value.
      ```
      cy.fixture('users.json').then((users) => {
         const user = users[0]
         cy.get('header').should('contain', user.name)
      })
      ```
5. Use Aliases to store what Commands yield you ([source](https://docs.cypress.io/app/core-concepts/variables-and-aliases))
   1. To alias something you'd like to share use the .as() command:
      ```
      beforeEach(() => {
         // alias the users fixtures
         cy.fixture('users.json').as('users')
      })

      it('utilize users in some way', function () {
        // use the special '@' syntax to access aliases
        cy.get('@users').then((users) => {
          const user = users[0]
          cy.get('header').should('contain', user.name)
        })
      })
      ```
   2. Can use an alias where you would use const or let:
      ```
      cy.get('table').find('tr').as('rows')
      // Every time we reference @rows, Cypress re-runs the queries leading up to the alias definition preventing stale elements
      cy.get('@rows').first().click()
      ```
   3. Aliases can also be used with cy.intercept() ensuring your application makes the intended requests and waiting for your server to send the response:
      ```
      cy.intercept('POST', '/users', { id: 123 }).as('postUser')
      cy.get('form').submit()
      cy.wait('@postUser').then(({ request }) => {
         expect(request.body).to.have.property('name', 'Brian')
      })
      cy.contains('Successfully created user: Brian')
      ```
6. Tests should always be able to be run independently from one another and still pass ([source](https://docs.cypress.io/app/core-concepts/best-practices#Cypress-and-Testing-Library))
   1. Change `it` to `it.only` on the test and re-run to prove its isolated from other tests.
7. Can add multiple assertions per test ([source](https://docs.cypress.io/app/core-concepts/best-practices#Cypress-and-Testing-Library))
   1. In unit tests there is no big performance penalty splitting up multiple tests because they run really fast
   2. Cypress runs a series of async lifecycle events that reset state between tests and resetting tests is much slower than adding more assertions
8. Clean up state before tests run ([source](https://docs.cypress.io/app/core-concepts/best-practices#Using-after-Or-afterEach-Hooks))
   1. Cypress automatically enforces test isolation by clearing state before each test
   2. Stubs, spies, and intercepts are not removed at the end of a test but the beginning of the next one. Adding an afterEach would clear it making debugging harder.
   3. Code put in a before or beforeEach hook will always run prior to the test - even if you refreshed Cypress in the middle of an existing one
9. Use route aliases or assertions to guard Cypress from proceeding until an explicit condition is met ([source](https://docs.cypress.io/app/core-concepts/best-practices#Using-after-Or-afterEach-Hooks))
   1. Almost never need to use cy.wait() for an arbitrary amount of time
   2. `cy.request('http://localhost:8080/db/seed'); cy.wait(5000)`: wait is unnecessary since `cy.request()` command will not resolve until it receives a response from your server
   3. Can wait explicitly for an aliased route:
      ```
      cy.intercept('GET', '/users', [{ name: 'Maggy' }, { name: 'Joan' }]).as('getUsers')
      cy.get('[data-testid="fetch-users"]').click()
      cy.wait('@getUsers') // <--- wait explicitly for this route to finish
      cy.get('table tr').should('have.length', 2)
      ```
10. Accessibility Testing ([source](https://docs.cypress.io/app/guides/accessibility-testing))

### Platform Practices

Source: [Platform Best Practices - Unit and e2e Tests](https://depo-platform-documentation.scrollhelp.site/developer-docs/platform-best-practices-unit-and-e2e-tests#PlatformBestPractices-Unitande2eTests-Cypresse2eTesting)

- `cy.injectAxe()` and `cy.axeCheck()` is required in every test
