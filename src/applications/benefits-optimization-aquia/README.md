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

See the [21-0779 README](./21-0779-nursing-home-information/README.md) for detailed form flow, conditional logic, and testing information.

### 21-2680 House Bound Status

#### Examination for Housebound Status or Permanent Need for Regular Aid and Attendance

- **Purpose**: Veterans or caregivers apply for Aid & Attendance or Housebound allowance
- **Users**: Veterans, spouses, children, parents (as caregivers)
- **Entry**: `21-2680-house-bound-status`
- **URL**: `/pension/aid-attendance-housebound/apply-form-21-2680`
- **API**: `POST /v0/form212680`
- **Documentation**: [README](./21-2680-house-bound-status/README.md)

See the [21-2680 README](./21-2680-house-bound-status/README.md) for detailed form flow, conditional logic, print-and-upload workflow, and testing information.

### 21-4192 Employment Information

#### Request for Employment Information in Connection with Claim for Disability Benefits

- **Purpose**: Collect employment data for Total Disability Individual Unemployability (TDIU) claims
- **Users**: Veterans applying for TDIU benefits, VA Regional Offices
- **Entry**: `21-4192-employment-information`
- **URL**: `/disability/eligibility/special-claims/unemployability/submit-employment-information-form-21-4192`
- **API**: `POST /v0/form214192`
- **Documentation**: [README](./21-4192-employment-information/README.md)

See the [21-4192 README](./21-4192-employment-information/README.md) for detailed form flow, conditional logic, employment status handling, and testing information.

### 21p-530a Interment Allowance

#### State or Tribal Organization Application for Interment Allowance

- **Purpose**: State/tribal organizations request burial benefits for deceased Veterans
- **Users**: State organizations, tribal organizations
- **Entry**: `21p-530a-interment-allowance`
- **URL**: `/submit-state-interment-allowance-form-21p-530a`
- **API**: `POST /v0/form21p530a`
- **Documentation**: [README](./21p-530a-interment-allowance/README.md)

See the [21p-530a README](./21p-530a-interment-allowance/README.md) for detailed form flow, List & Loop patterns, modern CustomPage architecture, and testing information.

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

For general setup and development instructions, see the [vets-website README](../../../README.md).

### Watch a Single App

```bash
# Watch only the form you're working on
yarn watch --env entry=auth,static-pages,login-page,21-0779-nursing-home-information
yarn watch --env entry=auth,static-pages,login-page,21-2680-house-bound-status
yarn watch --env entry=auth,static-pages,login-page,21-4192-employment-information
yarn watch --env entry=auth,static-pages,login-page,21p-530a-interment-allowance
```
Watch more:
```
yarn watch --env entry=auth,static-pages,dashboard,find-forms,login-page,21-2680-house-bound-status,21-0779-nursing-home-information,21-4192-employment-information,21p-530a-interment-allowance
```
### Testing

See individual form READMEs for specific test commands and scenarios:
- [21-0779 Testing](./21-0779-nursing-home-information/README.md#testing)
- [21-2680 Testing](./21-2680-house-bound-status/README.md#testing)
- [21-4192 Testing](./21-4192-employment-information/README.md#testing)
- [21p-530a Testing](./21p-530a-interment-allowance/README.md#testing)

For general testing documentation, see:
- [vets-website Unit Testing](../../../README.md#unit-tests)
- [vets-website E2E Testing](../../../README.md#end-to-end-e2e--browser-tests)

## Team Conventions

### Code Style

- **File naming**: kebab-case for all files
- **Component exports**: Named exports (except where platform expects defaults)
- **Import pattern**: Use `@bio-aquia` alias with sub-module imports
- **Testing**: Co-located unit tests with `.unit.spec.jsx` extension
- **E2E tests**: Use platform's form-tester utility

### Testing Strategy

All applications follow a consistent testing approach with minimal and maximal test scenarios. See individual form READMEs for specific test scenarios and data themes.

### Accessibility Standards

- **WCAG 2.2 Level AA** compliance on all forms
- **Section 508** compliance
- **VA Design System** web components for consistency
- **Axe-core** accessibility testing in Cypress tests
- **Keyboard navigation** and screen reader support

## Common Patterns

### Conditional Pages

All forms use conditional logic with the `depends` function to show/hide pages based on form data. See individual form READMEs for specific conditional logic implementation.

### Data Transformers

Forms use transformers to handle data flow:
- **Prefill Transformer**: User profile → Form data
- **Submit Transformer**: Form data → API payload

See individual form READMEs for transformer implementation details.

### API Integration

Each form has its own dedicated vets-api endpoint:
- **21-0779**: `POST /v0/form210779`
- **21-2680**: `POST /v0/form212680` (print-and-upload workflow)
- **21-4192**: `POST /v0/form214192`
- **21p-530a**: `POST /v0/form21p530a`

All forms use Save-in-Progress: `/v0/in_progress_forms/{form-id}`

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
