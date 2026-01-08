# Benefits Intake Optimization - Aquia Team

## Team Overview

The **Benefits Intake Optimization - Aquia Team** develops and maintains digital forms for VA benefits claims, with a focus on pension, burial, and disability-related forms. Our mission is to modernize the Veterans benefits intake process by creating accessible, user-friendly digital experiences that streamline claims submission and reduce processing time.

## Portfolio

We currently maintain **4 applications** covering various benefits claim types:

| Application                                                           | Form Number      | Purpose                                         |
| --------------------------------------------------------------------- | ---------------- | ----------------------------------------------- |
| [21-0779 Nursing Home Information](#21-0779-nursing-home-information) | VA Form 21-0779  | Nursing home certification for Aid & Attendance |
| [21-2680 House Bound Status](#21-2680-house-bound-status)             | VA Form 21-2680  | Aid & Attendance / Housebound application       |
| [21-4192 Employment Information](#21-4192-employment-information)     | VA Form 21-4192  | Employment info for Individual Unemployability  |
| [21p-530a Interment Allowance](#21p-530a-interment-allowance)         | VA Form 21P-530A | State/tribal burial benefits application        |

## Product Details

### 21-0779 Nursing Home Information

#### Request for Nursing Home Information in Connection with Claim for Aid and Attendance

- **Purpose**: Nursing home officials certify patient care and costs for Aid and Attendance benefits
- **Users**: Nursing home officials, extended care facility administrators
- **Entry**: `21-0779-nursing-home-information`
- **URL**: `/supporting-forms-for-claims/submit-nursing-home-information-form-21-0779`
- **API**: `POST /v0/form210779`
- **Documentation**: [README](./21-0779-nursing-home-information/README.md)

**Key Features**:

- Conditional form flow based on patient type (Veteran vs spouse/parent)
- Medicaid coverage tracking
- Prefill and submit transformers
- Star Wars themed test data

### 21-2680 House Bound Status

#### Examination for Housebound Status or Permanent Need for Regular Aid and Attendance

- **Purpose**: Veterans or caregivers apply for Aid & Attendance or Housebound allowance
- **Users**: Veterans, spouses, children, parents (as caregivers)
- **Entry**: `21-2680-house-bound-status`
- **URL**: `/pension/aid-attendance-housebound/apply-form-21-2680`
- **API**: `POST /v0/form212680`
- **Documentation**: [README](./21-2680-house-bound-status/README.md)

**Key Features**:

- Conditional pages based on claimant relationship
- Hospitalization tracking
- Military address support (APO/FPO/DPO)
- Prefill from user profile
- 5 comprehensive E2E test scenarios

### 21-4192 Employment Information

#### Request for Employment Information in Connection with Claim for Disability Benefits

- **Purpose**: Collect employment data for Total Disability Individual Unemployability (TDIU) claims
- **Users**: Veterans applying for TDIU benefits, VA Regional Offices
- **Entry**: `21-4192-employment-information`
- **URL**: `/disability/eligibility/special-claims/unemployability/submit-employment-information-form-21-4192`
- **API**: `POST /v0/form214192`
- **Documentation**: [README](./21-4192-employment-information/README.md)

**Key Features**:

- Detailed employment history collection
- Reserve/Guard duty status tracking
- Benefits entitlement tracking
- Submit transformer with currency/date formatting
- 4 E2E test scenarios (minimal, maximal, currently employed, duty status)

### 21p-530a Interment Allowance

#### State or Tribal Organization Application for Interment Allowance

- **Purpose**: State/tribal organizations request burial benefits for deceased Veterans
- **Users**: State organizations, tribal organizations
- **Entry**: `21p-530a-interment-allowance`
- **URL**: `/submit-state-interment-allowance-form-21p-530a`
- **API**: `POST /v0/form21p530a`
- **Documentation**: [README](./21p-530a-interment-allowance/README.md)

**Key Features**:

- Organization information collection
- Military service history (List & Loop pattern)
- Previous names tracking (List & Loop pattern)
- Modern CustomPage pattern with Zod validation
- PageTemplate and ReviewPageTemplate components

## Architecture Patterns

Our team uses **two main form patterns** across our applications:

### Traditional RJSF Pattern (21-0779, 21-2680, 21-4192)

- Page-based configuration with `uiSchema` and `schema`
- Platform web component patterns
- Conditional pages using `depends` function
- Prefill and submit transformers
- Platform review page components

**Best for**: Straightforward forms with standard field types

### Modern CustomPage Pattern (21p-530a)

- CustomPage and CustomPageReview components
- Zod validation schemas
- PageTemplate and ReviewPageTemplate components
- List & Loop patterns for arrays
- More flexible React component patterns

**Best for**: Complex forms with custom validation and array handling

## Development Quick Start

### Watch a Single App

```bash
# Watch only the form you're working on
yarn watch --env entry=21-0779-nursing-home-information
yarn watch --env entry=21-2680-house-bound-status
yarn watch --env entry=21-4192-employment-information
yarn watch --env entry=21p-530a-interment-allowance
```

### Watch Multiple Apps

```bash
# Watch specific apps together
yarn watch --env entry=21-0779-nursing-home-information,21-2680-house-bound-status,21-4192-employment-information,21p-530a-interment-allowance

# Watch with auth and static pages
yarn watch --env entry=auth,static-pages,login-page,21-4192-employment-information
# Watch with auth, static pages, and all apps
yarn watch --env entry=auth,static-pages,21-0779-nursing-home-information,21-2680-house-bound-status,21-4192-employment-information,21p-530a-interment-allowance
```

### Testing

```bash
# Unit tests for specific app
yarn test:unit --app-folder benefits-optimization-aquia/21-0779-nursing-home-information
yarn test:unit --app-folder benefits-optimization-aquia/21-2680-house-bound-status
yarn test:unit --app-folder benefits-optimization-aquia/21-4192-employment-information
yarn test:unit --app-folder benefits-optimization-aquia/21p-530a-interment-allowance

# E2E tests (requires yarn watch running first)
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21-0779-nursing-home-information/**/*.cypress.spec.js"
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21-2680-house-bound-status/**/*.cypress.spec.js"
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21-4192-employment-information/**/*.cypress.spec.js"
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21p-530a-interment-allowance/**/*.cypress.spec.js"

# Open Cypress UI
yarn cy:open
```

### Linting

```bash
# Run linter for specific app directory
yarn lint:js src/applications/benefits-optimization-aquia/21-0779-nursing-home-information

# Fix linting issues in changed files
yarn lint:js:changed:fix
```

## Team Conventions

### Code Style

- **File naming**: kebab-case for all files
- **Component exports**: Named exports (except where platform expects defaults)
- **Import pattern**: Use `@bio-aquia` alias with sub-module imports
- **Testing**: Co-located unit tests with `.unit.spec.jsx` extension
- **E2E tests**: Use platform's form-tester utility

### Testing Strategy

All applications follow a consistent testing approach:

- **Minimal test**: Basic required fields only, shortest path
- **Maximal test**: All fields filled, longest path with all conditional pages
- **Scenario tests**: Specific edge cases and conditional logic paths

### Accessibility Standards

- **WCAG 2.2 Level AA** compliance on all forms
- **Section 508** compliance
- **VA Design System** web components for consistency
- **Axe-core** accessibility testing in Cypress tests
- **Keyboard navigation** and screen reader support

### Data Themes

- **21-0779, 21-2680**: Star Wars themed test data (for consistency and fun)
- **21-4192**: Standard test data
- **21p-530a**: Custom test data

## Common Patterns

### Conditional Pages

```javascript
// In form config
pages: {
  conditionalPage: {
    path: 'conditional-page',
    depends: formData => formData?.someField === true,
    uiSchema: conditionalPageUiSchema,
    schema: conditionalPageSchema,
  },
}
```

### Helper Functions

```javascript
// In pages/helpers.js
export const isVeteranClaimant = formData =>
  formData?.claimantRelationship?.relationship === 'veteran';

export const showConditionalPages = formData => !isVeteranClaimant(formData);
```

### Data Transformers

All apps use transformers to handle data flow:

- **Prefill Transformer**: User profile → Form data
- **Submit Transformer**: Form data → API payload

## API Integration

### Endpoints Used

Each form has its own dedicated vets-api endpoint:

- **21-0779**: `POST /v0/form210779`
- **21-2680**: `POST /v0/form212680`
- **21-4192**: `POST /v0/form214192`
- **21p-530a**: `POST /v0/form21p530a`
- **Save-in-Progress**: `/v0/in_progress_forms/{form-id}`
- **User Profile**: `/v0/user` (for prefill)

## Content Widgets

Each form has a content widget that controls the "Submit online" link on its Drupal CMS "about" page (e.g., `/forms/21-0779/`). These widgets check feature flags to show or hide the digital form link, preventing broken links when forms are toggled off.

### Widget Location

```text
src/applications/static-pages/benefits-optimization-aquia/
├── 21-0779/
│   ├── App.js      # React component with feature toggle logic
│   └── entry.js    # Widget creator function
├── 21-2680/
└── 21-4192/
```

### Drupal CMS Configuration

When configuring the React Widget paragraph in Drupal, use these `fieldWidgetType` values:

| Form    | Widget Type   | Feature Flag (vets-api) |
| ------- | ------------- | ----------------------- |
| 21-0779 | `form210779`  | `form_0779_enabled`     |
| 21-2680 | `form212680`  | `form_2680_enabled`     |
| 21-4192 | `form214192`  | `form_4192_enabled`     |

### Widget Behavior

- **Feature flag ON**: Shows "Submit this form online" link to the digital form
- **Feature flag OFF**: Shows "Submit this form by mail" (no link)
- **Loading**: Shows loading indicator while fetching toggle state

### Related Files

- Widget types: `src/platform/site-wide/widgetTypes.js`
- Widget registration: `src/applications/static-pages/static-pages-entry.js`
- Feature flags: `src/platform/utilities/feature-toggles/featureFlagNames.json`

## Dependencies

### Platform Utilities

All apps leverage these platform utilities:

- `platform/forms-system` - VA.gov form system and web components
- `platform/forms/save-in-progress` - Save-in-progress functionality
- `platform/user/selectors` - User authentication state
- `platform/utilities/ui` - UI helpers (focus, scroll)
- `vets-json-schema` - Common form field definitions

## Documentation

Each application has comprehensive documentation:

- **README.md**: Overview, architecture, development guide
- **Form flow**: Detailed page-by-page breakdown
- **Testing**: E2E and unit test documentation
- **API integration**: Transformer and endpoint documentation

## Team Resources

### Communication

- **Slack**: [#benefits-optimization-aquia](https://dsva.slack.com/archives/C09FWT9U1JP) (internal)
- **Team**: Benefits Intake Optimization - Aquia
- **Repository**: `vets-website`

### Related Documentation

- [VA.gov Form System](https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-overview)
- [VA.gov Design System](https://design.va.gov/)
- [Platform Documentation](https://depo-platform-documentation.scrollhelp.site/)

## Contributing

When working on these applications:

1. **Read the app's README** for specific implementation details
2. **Follow team conventions** for code style and testing
3. **Test accessibility** with axe-core
4. **Update documentation** when adding features
5. **Use test data themes** consistently

---

For questions or support, contact the **Benefits Intake Optimization - Aquia Team** via Slack at [#benefits-optimization-aquia](https://dsva.slack.com/archives/C09FWT9U1JP).
