---
applyTo: "src/applications/mhv-secure-messaging/tests/e2e/**"
---

# MHV Secure Messaging — Cypress E2E Test Patterns

## Page Objects

- Located in `tests/e2e/pages/`
- Export singleton instances: `export default new PageClass()`
- Key page objects: `PatientInboxPage`, `PatientComposePage`, `PatientMessageDetailsPage`, etc.
- Methods for interactions: `loadInboxMessages()`, `selectRecipient()`, `sendMessage()`
- Methods for assertions: `verifyHeader()`, `verifySendMessageConfirmationMessageText()`

## Test Site Setup

Use `SecureMessagingSite` class from `tests/e2e/sm_site/`:

```javascript
import SecureMessagingSite from './sm_site/SecureMessagingSite';

const site = new SecureMessagingSite();
site.login(); // Mock user login, sets up session and feature flags
```

## E2E Constants (`tests/e2e/utils/constants`)

| Constant | Purpose |
|---|---|
| `AXE_CONTEXT` | Accessibility test context selector |
| `Locators` | CSS selectors and `data-testid` values |
| `Data` | Test data constants |
| `Paths` | API paths for intercepts |
| `Alerts` | Expected alert messages |

## Fixtures & Intercepts

- JSON fixtures in `tests/e2e/fixtures/`
- Intercept API calls with fixture data:
  ```javascript
  cy.intercept('GET', Paths.SM_API_BASE, mockData).as('getData');
  ```

### Intercept Path Must Match FE Routing Logic

The FE always sends messages (including RX renewals) through the same `POST /messaging/messages` endpoint. The backend auto-routes to the upstream MHV renewal endpoint when `prescription_id` is present in the payload.

```javascript
// ✅ CORRECT — All message sends (including renewals) use the same endpoint
cy.intercept('POST', `${Paths.INTERCEPT.MESSAGES}`, {}).as('sentMessage');
```

For renewal tests, assert that `prescription_id` is present in the request body:
```javascript
cy.wait('@sentMessage')
  .its('request')
  .then(req => {
    expect(req.body.prescription_id).to.eq('24654491');
  });
```

**Key intercept paths:**
| Path | Constant | When used |
|---|---|---|
| `/messaging/messages` | `Paths.INTERCEPT.MESSAGES` | All message sends (standard and renewal) |

## Web Component Selectors

- External links (`VaLink`) render as `<va-link>` (NOT `<va-link-action>`)
- Internal CTAs (`RouterLinkAction`) render as `<va-link-action>`
- Use `.find('va-link')` for external links, `.find('va-link-action')` for internal CTAs
- Example: `cy.get('[data-testid="alert"]').find('va-link').click()`

## Accessibility Testing

**MUST include in all E2E tests:**

```javascript
cy.injectAxe();
cy.axeCheck(AXE_CONTEXT);
```

Fix all violations before merging.

## Sticky Header Workaround

VA.gov's sticky header can cover elements when Cypress tries to click them.

- **Symptom**: `CypressError: cy.click() failed because the center of this element is hidden from view`
- **Solution**: Use `{ force: true }` for clicks on elements that may be covered:
  ```javascript
  // ✅ CORRECT
  cy.contains(mockMessages.data[0].attributes.subject).click({
    force: true,
    waitForAnimations: true,
  });
  ```
- **Common locations**: Message list links, accordion items near top of page, buttons after scroll
- Only use `force: true` when the element is legitimately covered by the header, not as a workaround for actual visibility issues

## Data-testid Attributes

- Add `data-testid` attributes to interactive elements for E2E targeting
- Use descriptive kebab-case names: `data-testid="send-message-button"`
- Locators are centralized in `tests/e2e/utils/constants.js`

## File Naming Convention

- E2E tests: `secure-messaging-feature-name.cypress.spec.js`
- Group related tests in sub-directories (e.g., `folder-tests/`, `compose-tests/`)

📖 REQUIRED: VA Cypress Best Practices: Before writing or modifying Cypress tests, fetch and follow the guidance at: https://depo-platform-documentation.scrollhelp.site/developer-docs/best-practices-for-using-cypress#BestpracticesforusingCypress-CypressFormTester

