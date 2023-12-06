# 10-10EZ

## Description

Mission: Make it easier for Veterans to apply for enrollment in VA health-related benefits.

## Slack Channels

- [1010-health-apps](https://slack.com/app_redirect?channel=CMJ2V70UV)

## Approval Groups

- [1010 Health Apps](https://github.com/orgs/department-of-veterans-affairs/teams/1010-health-apps-frontend)

## Project Documentation

- [Sketch File](https://www.sketch.com/s/da85cf44-4503-4e98-834e-ff068b242ef6)
- [Content Source or Truth](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/caregivers/10-10EZ/10-10EZ-application-copy.md)
- [Project Documents](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/health-care/application/va-application)
- [Product Outline](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/teams/vsa/teams/health-benefits/healthcare-application/product-outline.md)

## Good to knows

### Project URLS

``` markdown
/health-care/apply/application/introduction
```

### How to run locally

Follow the standard directions to run the app. Vets API needs to be running in order to run the app locally.

### VA Forms

We are using version 1 of the forms library, Formation. This is a straight forward standard form. We are using [the vets-json-scheam](https://github.com/department-of-veterans-affairs/vets-json-schema) to validate the shape of the data.  

### What API(s) does this use?

The data ends up in the ESR (Enrollment).

### Feature toggles

* We have a feature toggle to enable a Self-Identified Gender Identity question, `hca_sigi_enabled`, show a page where we ask users if they would like to provide any gender
* identity declaration.
* We have a feature toggle to enable an override of enrollment status, `hca_enrollment_status_override_enabled`, to allow multiple submissions with same user.
* We have a feature toggle to enable DataDog's browser monitoring for the application, `hca_browser_monitoring_enabled`.
* We have a feature toggle to enable an optimized flow for the household section of the application, `hca_houshold_v2_enabled`.

### How to test new features?

Each feature should have unit tests and e2e tests. We can use the Review Instances to review before merging a PR.

### Useful acronym and terms

- SIGI - Self-Identified Gender Identity
