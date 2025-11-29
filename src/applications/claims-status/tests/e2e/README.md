# Claims Status E2E Testing

## Introduction
- In November 2025 the E2E tests for the `claims-status` application were rewritten to improve coverage, maintainability, and scalability while modernizing the E2E tests
- This README for `claims-status` E2E testing is to align the team on best practices gathered from Cypress, VA Platform, and the team

## Highlighted Cypress Best Practices
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

## Highlighted Platform Practices
Source: [Platform Best Practices - Unit and e2e Tests](https://depo-platform-documentation.scrollhelp.site/developer-docs/platform-best-practices-unit-and-e2e-tests#PlatformBestPractices-Unitande2eTests-Cypresse2eTesting)

- `cy.injectAxe()` and `cy.axeCheck()` is required in every test

## Team Conventions
- Organize tests into sub-folders (`details`, `shared`, `your-claims`, etc) rather than having them all at root
- Use focused helper functions instead of page objects and organize them into sub-folders by purpose (`api-mocks`, `setup`, `interactions`, `assertions`)
- **Prefer `cy.findByRole()`** for interactive and structural elements (buttons, links, headings, navigation, etc.) - checks semantics, visibility, and accessibility
- **Use `cy.findByText()`** for static text content (paragraphs, labels, non-interactive text) - this is correct! Not everything needs a role
- **Tip**: Check element roles via Developer Tools > Elements Tab > Accessibility Tab
- **Remember**: If important UI elements lack roles, consider improving semantics (e.g., use `<h2>` instead of styled `<p>` for headings)

### Test Organization: `describe()` vs `context()`

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

### Feature Flag Testing

Group feature flag tests in a dedicated `describe` block with a `mockFeatures` helper function:

```javascript
describe('Feature flag: cstShowDocumentUploadStatus', () => {
  const mockFeatures = enabled => [
    { name: 'cst_show_document_upload_status', value: enabled },
  ];

  context('when enabled', () => {
    beforeEach(() => {
      mockBaseEndpoints({ features: mockFeatures(true) });
    });

    it('should show the new behavior', () => {
      // Test enabled behavior
    });
  });

  context('when disabled', () => {
    beforeEach(() => {
      mockBaseEndpoints({ features: mockFeatures(false) });
    });

    it('should show the old behavior', () => {
      // Test disabled behavior
    });
  });
});
```

### Test Fixtures

Fixtures in `support/fixtures.js` create mock data for tests. They follow these practices:

**Only expose parameters when tests need them:**
```javascript
// Good: No parameters needed yet - just hardcoded defaults
export const createTrackedItem = () => ({
  id: 1,
  status: 'NEEDED_FROM_YOU',
  friendlyName: 'Medical records',
  // ...
});

// Good: Only expose what tests actually vary
export const createFailedSubmission = ({
  failedDate = '2025-01-15T12:00:00.000Z',
} = {}) => ({
  id: 12345,           // Hardcoded - tests don't care
  uploadStatus: 'FAILED', // Hardcoded - always the same
  failedDate,          // Exposed - tests have changed this
  // ...
});
```

## E2E Code Coverage
Note: Code coverage requires this PR to be merged - https://github.com/department-of-veterans-affairs/vets-website/pull/39252

### How to Run Coverage

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

### Current Coverage

Use branch coverage as our primary coverage metric because it measures whether we test all decision paths (if/else, switch cases), not just whether code executes. This is a more rigorous standard than statement or line coverage.

| Metric | Description | Before | Current | Change |
|--------|-------------|---------------|---------------------|--------|
| **Branches** | Decision paths (if/else, switch cases) executed | 62.43% | 64.6% | +2.17% |
| **Statements** | Individual executable statements run during tests | 75.07% | 76.66% | +1.59% |
| **Functions** | Functions called during test execution | 82.86% | 83.94% | +1.08% |
| **Lines** | Lines of code executed during tests | 75.13% | 76.62% | +1.49% |

### First Rewrite PR Impact
https://github.com/department-of-veterans-affairs/vets-website/pull/40123

| File | Before | After | Improvement |
|------|--------|-------|-------------|
| **Test cases** | 6 | 42 | +36 |
| **Branches** | 62.43% | 64.6% | +2.17% |
| `AppealListItem.jsx` | 31.57% | 94.73% | **+63.16%** |
| `ClaimsListItem.jsx` | 66.66% | 95.23% | **+28.57%** |
| `YourClaimsPageV2.jsx` | 81.96% | 90.16% | **+8.2%** |
| `claimsV2.js` (reducer) | 53.33% | 73.33% | **+20%** |
| `actions/index.js` | 58.75% | 66.19% | **+7.44%** |
