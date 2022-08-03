# 10-10EZ

## Description

Mission: Make it easier for Veterans and Caregivers to apply for, track, and manage care-related benefits.

## Slack Channels

- [vsa-caregiver](https://slack.com/app_redirect?channel=CMJ2V70UV)

## Approval Groups

- [VSA BAM 1](https://github.com/orgs/department-of-veterans-affairs/teams/vsa-bam-1-frontend)
- [VSA Caregiver](https://github.com/orgs/department-of-veterans-affairs/teams/vsa-caregiver-frontend)

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

Follow the standard directions to run the app. The API needs to be running in order to run the app locally.

### VA Forms

We are using version 1 of the forms library, Formation. This is a straight forward standard form. We are using [the vets-json-scheam](https://github.com/department-of-veterans-affairs/vets-json-schema) to validate the shape of the data.  

### What API(s) does this use?

The data ends up in the ESR (Enrollment).

Not sure what Vets-API endpoints are used.

### Feature toggles

* We have a feature toggle to enable an American Indian question, `hca_american_indian_enabled`, showing a page where we ask if a veteran is recognized as an American Indian or Alaska Native.
* We have a feature toggle to enable a shortened form, `hca_short_form_enabled`, for users with or self discloser of high disability.
* We have a feature toggle to enable an override of enrollment status, `hca_enrollment_status_override_enabled`, to allow multiple submissions with same user.

### How to test new features?

Each feature should have unit tests and e2e tests. We can use the Review Instances to review before merging a PR.

### Useful acronym and terms

- ???
