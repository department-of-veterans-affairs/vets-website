# Check in Application

- [Check in Application](#check-in-application)
  - [Description](#description)
  - [Slack Channels](#slack-channels)
  - [Approval Groups](#approval-groups)
  - [Project Documentation](#project-documentation)
  - [Good to knows](#good-to-knows)
    - [Project URLS](#project-urls)
    - [How to run locally](#how-to-run-locally)
    - [Where is the data coming from?](#where-is-the-data-coming-from)
    - [Why is this not a VA forms app (formation)](#why-is-this-not-a-va-forms-app-formation)
    - [What API(s) does this use?](#what-apis-does-this-use)
    - [Feature toggles](#feature-toggles)
    - [How to test this?](#how-to-test-this)
    - [Useful acronym and terms](#useful-acronym-and-terms)

## Description

This application for for veterans to check into their health appointments the day of care. This is half of the experience. The other have is a QR and a series of text messages (see full diagrams).

This is a multi-team project and questions are highly encouraged. There are several periodic team sync meetings. Follow up with your PM to make sure you are in all the meetings.

## Slack Channels

- [Check In Experience](https://slack.com/app_redirect?channel=C022AC2STBM)

## Approval Groups

- [Health Care Experience Team](https://github.com/orgs/department-of-veterans-affairs/teams/vsa-healthcare-experience)
- [Health Care System Team](https://github.com/orgs/department-of-veterans-affairs/teams/va-cto-health-products)

## Project Documentation

- [Sketch File](https://www.sketch.com/s/e79a827e-42cf-4a82-b554-874c75b5c70e)
- [Project Documents](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/health-care/checkin)
- [Architecture Diagrams](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/health-care/checkin/engineering/phase-2/architecture)

## Good to knows

### Project URLS

``` markdown
/health-care/appointment-check-in/?id=xxxxxx
/health-care/appointment-check-in/update-information
/health-care/appointment-check-in/details
/health-care/appointment-check-in/see-staff
/health-care/appointment-check-in/complete
/health-care/appointment-check-in/error
```

### How to run locally

Follow the standard directions to run the app. The API needs to be running in order to run the app locally. Currently I would use the mock api in `src/applications/check-in/api/local-mock-api` using the directions in the [README](https://github.com/department-of-veterans-affairs/vets-website/blob/master/README.md#running-a-mock-api-for-local-development). This will make developer easier since creating a valid token is tedious.

### Where is the data coming from?

The data is coming from CHIP which abstracts away the where exactly the data is coming from. Vets-API talks to CHIP and handles the communication.

### Why is this not a VA forms app (formation)

Even though this my look like a form, the first iteration of the VA form system would have been to been too heavily modified and gutted to make our use case work. We are thinking about using the new version when its ready.

### What API(s) does this use?

We are currently using the endpoints that are mocked in `src/applications/check-in/api/local-mock-api`.

### Feature toggles

We are currently using an HOC located at `src/applications/check-in/containers/withFeatureFlip.jsx` to control the feature flips. The whole app is wrapped around one, and each new feature should have its own toggle.

### How to test this?

Each feature should have unit tests and e2e tests.

For testing in staging, use the instructions at [https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/checkin/engineering/qa/test-data-setup.md](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/checkin/engineering/qa/test-data-setup.md).

### Useful acronym and terms

- CHIP - New API that is a central point for all the health data access. Bascially a wrapper around VistA and other internal nasty APIs.
- LoROTA - Low Risk Authorization Service. This is how we are managing and verifying a user is who they say they are. Currently its a token based system that is essentially a shared short term data storage
- Pre- Check in - The name of this app when talking to non techincal folks
- Day of Check in - The is the future work of many of forms
- VeText - This is the service that sends and receives text messages for the user.
- VistA - This is a legacy but powerful health recond system that the VA uses. This is slowly being replace by Cerner.
