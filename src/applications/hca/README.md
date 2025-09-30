# 10-10EZ

## Description

Mission: Make it easier for Veterans to apply for enrollment in VA health-related benefits.

## Slack Channels

- [1010-health-apps](https://slack.com/app_redirect?channel=CMJ2V70UV)

## Approval Groups

- [Health Apps Frontend](https://github.com/orgs/department-of-veterans-affairs/teams/health-apps-frontend)
- [Health Apps Backend](https://github.com/orgs/department-of-veterans-affairs/teams/vfs-10-10)

## Project Documentation

- [Figma File](https://www.figma.com/file/UljiHam46o5DItC5iDgmPd/10-10EZ)
- [Content Source or Truth](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/caregivers/10-10EZ/10-10EZ-application-copy.md)
- [Project Documents](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/health-care/application/va-application)
- [Product Outline](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/teams/vsa/teams/health-benefits/healthcare-application/product-outline.md)

### Project URLS

```markdown
/health-care/apply-for-health-care-form-10-10ez/
```

### How to run locally

Follow the standard directions to run the app. Vets API needs to be running in order to run the app locally.

### VA Forms

We are using version 1 of the forms library, Formation. This is a straight forward standard form. We are using [the vets-json-schema](https://github.com/department-of-veterans-affairs/vets-json-schema) to validate the shape of the data.

### What API(s) does this use?

This uses the Health Care Application API, the main controller is [here](https://github.com/department-of-veterans-affairs/vets-api/blob/master/app/controllers/v0/health_care_applications_controller.rb).

- [`/v0/health_care_applications`](https://department-of-veterans-affairs.github.io/va-digital-services-platform-docs/api-reference/#/benefits_forms/addHealthCareApplication) - Form submission API
- [`/v0/hca_attachments`](https://department-of-veterans-affairs.github.io/va-digital-services-platform-docs/api-reference/#/benefits_forms/postHealthCareApplicationAttachment) - File upload API for discharge documents
- [`/v0/health_care_applications/enrollment_status`](https://department-of-veterans-affairs.github.io/va-digital-services-platform-docs/api-reference/#/benefits_forms/enrollmentStatusHealthCareApplication) - Enrollment status fetch API
- [`/v0/health_care_applications/rating_info`](https://department-of-veterans-affairs.github.io/va-digital-services-platform-docs/api-reference/#/benefits_forms/getDisabilityRating) - Disability rating fetch API
- [`/v0/health_care_applications/facilities`](https://department-of-veterans-affairs.github.io/va-digital-services-platform-docs/api-reference/#/benefits_forms/getFacilities) - Retrieve a list of active healthcare facilities
- [`/v0/health_care_applications/download_pdf`](https://department-of-veterans-affairs.github.io/va-digital-services-platform-docs/api-reference/#/benefits_forms/post_v0_health_care_applications_download_pdf) - Download a pre-filled 10-10EZ PDF form upon submission receipt.

### Feature toggles

- We have a feature toggle to enable an override of enrollment status, `hca_enrollment_status_override_enabled`, to allow multiple submissions with same user.
- We have a feature toggle to enable DataDog's browser monitoring for the application, `hca_browser_monitoring_enabled`.

### How to test new features?

Each feature should have unit tests and e2e tests. We can use the Review Instances to review before merging a PR.

### Useful acronym and terms

- TERA - Toxic Exposure Risk Activity
