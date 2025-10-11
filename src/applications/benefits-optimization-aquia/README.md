# Benefits Optimization - Aquia (BIO-AQ)

Collection of VA benefit form applications and shared utilities for the Benefits Intake Optimization - Aquia team.

## Overview

This directory contains VA benefit form applications built on the VA.gov forms platform, along with a shared utilities library. All applications follow consistent patterns, use the VA Design System, and are WCAG 2.2 AA compliant.

## Applications

### Form 21-0779: Nursing Home Information

Request for nursing home information in connection with Aid and Attendance benefits.

- **Path**: `21-0779-nursing-home-information/`
- **OMB Number**: 2900-0652
- **Documentation**: [21-0779 README](./21-0779-nursing-home-information/README.md)

### Form 21-2680: Housebound Status Examination

Medical examination form for Aid and Attendance or Housebound benefit claims (completed by physician).

- **Path**: `21-2680-house-bound-status/`
- **Documentation**: [21-2680 README](./21-2680-house-bound-status/README.md)

### Form 21-4192: Employment Information

Request for employment information in connection with disability benefit claims.

- **Path**: `21-4192-employment-information/`
- **Documentation**: [21-4192 README](./21-4192-employment-information/README.md)

### Form 21P-530A: Interment Allowance

Application for burial allowance and related benefits (under development).

- **Path**: `21p-530a-interment-allowance/`

## Shared Utilities

Reusable components, hooks, schemas, and utilities used across all BIO-AQ applications.

- **Path**: `shared/`
- **Documentation**: [Shared Utilities README](./shared/README.md)

The shared library includes form components, validation schemas, React hooks, data processors, and error handling utilities. See the [shared utilities documentation](./shared/README.md) for complete details on available modules and usage patterns.

## Development

### Running Individual Applications

Each application can be run independently:

```bash
# Build specific app
yarn build --entry=21-0779-nursing-home-information

# Watch specific app (no authentication)
yarn watch --env entry=21-0779-nursing-home-information

# Watch with authentication (always include: auth,static-pages,login-page,terms-of-use)
yarn watch --env entry=auth,static-pages,login-page,terms-of-use,21-0779-nursing-home-information
```

**Note**: When running with authentication, always include all four components: `auth,static-pages,login-page,terms-of-use`

### Running All BIO-AQ Applications

When working on shared utilities, run all applications together to see changes across the entire suite:

```bash
# Watch all BIO-AQ apps with authentication (includes: auth,static-pages,login-page,terms-of-use)
yarn watch --env entry=auth,static-pages,login-page,terms-of-use,21-0779-nursing-home-information,21p-530a-interment-allowance,21-4192-employment-information,21-2680-house-bound-status

# Build all BIO-AQ apps
yarn build --entry=21-0779-nursing-home-information,21p-530a-interment-allowance,21-4192-employment-information,21-2680-house-bound-status

# Run unit tests for all BIO-AQ apps
yarn test:unit --app-folder benefits-optimization-aquia/21-0779-nursing-home-information --app-folder benefits-optimization-aquia/21p-530a-interment-allowance --app-folder benefits-optimization-aquia/21-4192-employment-information --app-folder benefits-optimization-aquia/21-2680-house-bound-status

# Run all Cypress tests for BIO-AQ apps
yarn cy:run --spec "src/applications/benefits-optimization-aquia/**/tests/*.cypress.spec.js"
```

### Testing

```bash
# Run unit tests for specific app
yarn test:unit --app-folder benefits-optimization-aquia/21-0779-nursing-home-information

# Run Cypress E2E tests
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21-0779-nursing-home-information/**/*.cypress.spec.js"

# Run shared utilities tests
yarn test:unit src/applications/benefits-optimization-aquia/shared/
```

### Code Style

**File Naming**: Use `kebab-case` for all files and directories

```bash
# Examples
form-field.jsx
use-form-section.js
veteran-identification.jsx
```

**Exports**: Use named exports (avoid default exports)

```javascript
// ✅ Correct
export const FormField = ({ name, value }) => { /* ... */ };
export const useFormSection = (options) => { /* ... */ };

// ❌ Avoid
export default FormField;
```

**Imports**: Use absolute paths with `@bio-aquia` alias (avoid relative imports)

```javascript
// ✅ Correct - Absolute imports from shared utilities
import { FormField, SSNField } from '@bio-aquia/shared/components/atoms';
import { useFormSection } from '@bio-aquia/shared/hooks';
import { personalInfoSchema } from '@bio-aquia/shared/schemas';

// ✅ Correct - Absolute imports within application
import { formConfig } from '@bio-aquia/21-0779-nursing-home-information/config';

// ❌ Avoid - Relative imports
import { FormField } from '../../../shared/components/atoms/form-field';
import { formConfig } from './config/form';
```

**Module Organization**: Prefer colocation with barrel exports for clean imports

```bash
# Module structure with colocation
shared/components/atoms/
├── form-field/
│   ├── form-field.jsx           # Component implementation
│   ├── form-field.unit.spec.jsx # Tests colocated with component
│   └── index.js                  # Barrel export
├── ssn-field/
│   ├── ssn-field.jsx
│   ├── ssn-field.unit.spec.jsx
│   └── index.js
└── index.js                      # Parent barrel export
```

```javascript
// ✅ Correct - Relative imports allowed in barrel files for tree-shaking
// shared/components/atoms/form-field/index.js
export { FormField } from './form-field';

// shared/components/atoms/index.js
export { FormField } from './form-field/form-field';
export { SSNField } from './ssn-field/ssn-field';
export { DateField } from './date-field/date-field';

// ✅ Correct - Application code imports from barrel using absolute path
// veteran-identification.jsx
import { FormField, SSNField } from '@bio-aquia/shared/components/atoms';
```

**Colocation Benefits**:

- Tests live next to implementation
- Self-contained, portable modules
- Easy to locate related files
- Scalable architecture

## Architecture

Each application follows consistent directory structure and integrates with the VA.gov forms platform (save-in-progress, Redux state management, prefill, authentication). BIO-AQ applications enhance the platform with Zod validation, VA component adapters, and reusable patterns.

See individual application READMEs for detailed architecture and implementation documentation.

## Documentation

### Application READMEs

- [Form 21-0779: Nursing Home Information](./21-0779-nursing-home-information/README.md)
- [Form 21-2680: Housebound Status Examination](./21-2680-house-bound-status/README.md)
- [Form 21-4192: Employment Information](./21-4192-employment-information/README.md)
- [Shared Utilities](./shared/README.md)

### External Resources

- [VA.gov Forms System](https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-overview)
- [VA Design System](https://design.va.gov/)
- [VA Developer Portal](https://developer.va.gov/)

## Team & Support

**Team**: Benefits Intake Optimization - Aquia

**Slack**: #benefits-optimization-aquia
