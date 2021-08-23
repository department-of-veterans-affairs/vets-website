# Caregivers 10-10CG

## Description

Mission: Make it easier for Veterans and Caregivers to apply for, track, and manage care-related benefits.

## Slack Channels

- [vsa-caregiver](https://slack.com/app_redirect?channel=CMJ2V70UV)

## Approval Groups

- [VSA BAM 1](https://github.com/orgs/department-of-veterans-affairs/teams/vsa-bam-1-frontend)
- [VSA Caregiver](https://github.com/orgs/department-of-veterans-affairs/teams/vsa-caregiver-frontend)

## Project Documentation

- [Sketch File](????)
- [Project Documents](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/caregivers)

## Good to knows

### Project URLS

``` markdown
/family-member-benefits/apply-for-caregiver-assistance-form-10-10cg/introduction
```

### How to run locally

Follow the standard directions to run the app. The API needs to be running in order to run the app locally.

### Where is the data goin?

The data is going to a system called CARMA.

### VA Forms

We are using version 1 of the forms library, Formation. This is a straight forward standard form. We are using [the vets-json-scheam](https://github.com/department-of-veterans-affairs/vets-json-schema) to validate the shape of the data.  

### What API(s) does this use?

This uses the Caregivers API, the main controller is [here](https://github.com/department-of-veterans-affairs/vets-api/blob/master/app/controllers/v0/caregivers_assistance_claims_controller.rb).

### Feature toggles

We currently have a feature toggle for document uploads, `can_upload_10_10cg_poa`. Its currently conditional enabled for a `Percentage Of Actors`.

### How to test new features?

Currently, there are no lower environments for CARMA. We are currently working through that problem.

Each feature should have unit tests and e2e tests. Since this is an unauthenticated form, we use teh Review Instances to review before merging a PR.

### Useful acronym and terms

- ???
