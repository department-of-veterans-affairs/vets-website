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

When the FE conditionally routes to different API endpoints, the Cypress intercept path **must match what the FE actually calls**, not what seems logically correct from a business perspective.

```javascript
// ✅ CORRECT — FE routes based on isRxRenewalDraft, which is true when rxError is set
// Even for the 404 error path, the renewal endpoint is used
cy.intercept('POST', `${Paths.INTERCEPT.MESSAGES_RENEWAL}`, {}).as('sentMessage');
```

```javascript
// ❌ WRONG — The test logic says "no redirectPath" so you might think standard endpoint,
// but isRxRenewalDraft is still true (derived from rxError), so FE calls renewal endpoint
cy.intercept('POST', `${Paths.INTERCEPT.MESSAGES}`, {}).as('sentMessage');
```

**Key intercept paths:**
| Path | Constant | When used |
|---|---|---|
| `/messaging/messages` | `Paths.INTERCEPT.MESSAGES` | Standard message send |
| `/messaging/messages/renewal` | `Paths.INTERCEPT.MESSAGES_RENEWAL` | RX renewal send (ALL renewal paths, including 404/error) |

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
