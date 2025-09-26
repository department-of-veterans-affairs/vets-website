# VA Form 21-4192 - Request for Employment Information

## Application for Employment Information in Connection with Claim for Disability Benefits

This application is for veterans or their representatives to request employment information in connection with a claim for disability benefits.

## Team

Benefits Intake Optimization - Aquia Team

## Getting Started

### Development

```bash
# Run build for this single app
yarn build --entry=21-4192-employment-information

# Watch only this application
yarn watch --env entry=21-4192-employment-information

# Watch with authentication and static pages
yarn watch --env entry=auth,static-pages,login-page,21-4192-employment-information

# Run unit tests
yarn test:unit --app-folder benefits-optimization-aquia/21-4192-employment-information

# Run Cypress tests
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21-4192-employment-information/**/*.cypress.spec.js"
```

### Local Development URL

- <http://localhost:3001/21-4192-employment-information>

## Form Structure

The form follows the VA.gov form system (RJSF) patterns and is organized into the following chapters:

1. **Personal Information**

   - Name and date of birth
   - Identification information (SSN/VA file number)

2. **Mailing Address**

   - Current mailing address

3. **Contact Information**
   - Phone and email address

## Important Files

- `config/form.js` - Main form configuration
- `manifest.json` - Application manifest
- `constants.js` - Form title and subtitle
- `containers/introduction-page.jsx` - Form introduction page
- `containers/confirmation-page.jsx` - Form confirmation page
- `pages/` - Individual form page configurations

## Dependencies

This form uses:

- VA.gov Design System components
- Platform form system (RJSF)
- Redux for state management
- React Router for routing

## Production Deployment

This form has `continuousDeployment: false` set in `config/changed-apps-build.json` to prevent automatic deployment to production while under development.
