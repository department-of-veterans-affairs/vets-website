# VR&E 28-1900 Form App

This app implements the online Application for Veteran Readiness and Employment benefits. It lives in vets-website and is built with the VA Forms Library using Web Component Fields and Patterns.

## What this is

A standard Forms Library application that follows the VA.gov form flow: Introduction → Form pages → Review → Submit → Confirmation. It uses the Forms Library’s web component patterns and fields, not the legacy vets-json-schema. If you are updating or extending the form, lean on web component and patterns first.

## Run it locally

Clone and set up the VA.gov frontend per platform docs, then install dependencies.
Start the webpack dev server for this app using the manifest entryName. If you need login, save in progress, feature toggles, or real submission, run vets-api locally or mock endpoints.

**Examples:**

```bash
# from vets-website

yarn install

yarn mock-api --responses src/applications/vre/28-1900/tests/fixtures/mocks/local-mock-responses.js

yarn watch --env entry=28-1900-chapter-31

# unit tests for this app

yarn test:unit --app-folder vre/28-1900

# open Cypress runner

yarn cy:open
```
Full setup details and common commands are in the repo README and platform docs.

## Architecture

**Forms Library + web components**

Use web component patterns when possible. Patterns package standardized schema, uiSchema, labels, and validation. Examples:

- `addressSchema`
- `addressUI`
- `phoneSchema`
- `phoneUI`

When a pattern does not cover your need, use a web component field.
Design and accessibility guidance for forms is in the VA Design System. Follow its patterns for steps, review, and confirmation pages.

## Adding or changing fields

**Prefer a pattern**: import from `web-component-patterns` and spread schema/uiSchema into your page definition.

**If no pattern exists**: use a web component field from `web-component-fields` and supply validation where needed. Only write custom fields if absolutely necessary, and follow Design System guidance.

## Tests

**Unit tests**: found in `tests/unit` 

**E2E tests**: Cypress specs found in `tests/e2e` 

## Operational notes

**Entry name**: build/watch by passing `entryName` from `manifest.json`

**Mocking**: use local mock API for `/v0/user`, feature toggles, and submission endpoint

**Design alignment**: defer to Design System patterns and Web Component documentation

**Production check**: confirm public flow on staging 28-1900 page when validating releases

## References

- [VA Forms Library overview](https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-overview) (form flow, RJSF integration)
- [Web Component Fields and Patterns](https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-web-component-fields-and-patterns) from the Forms Library
- Design System guidance for forms and patterns
- vets-website README and commands
- [Staging VR&E 28-1900 application page](https://staging.va.gov/careers-employment/vocational-rehabilitation/apply-vre-form-28-1900) on VA.gov

If you need deeper platform help, use the “Get help” links in the platform docs.