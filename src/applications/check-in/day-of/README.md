# Check in Application

- [Check in Application](#check-in-application)
  - [Description](#description)
  - [Slack Channels](#slack-channels)
  - [Approval Groups](#approval-groups)
  - [Project Documentation](#project-documentation)
  - [Good to knows](#good-to-knows)
    - [Project URLS](#project-urls)
    - [What version of the api are we using?](#what-version-of-the-api-are-we-using)
    - [How to run locally](#how-to-run-locally)
    - [Enable local type checking with jsconfig (Optional)](#enable-local-type-checking-with-jsconfig-optional)
    - [Run locally for a BE developer](#run-locally-for-a-be-developer)
      - [Useful Commands](#useful-commands)
      - [Current Feature toggles to enable](#current-feature-toggles-to-enable)
      - [Steps to see the app](#steps-to-see-the-app)
    - [How to run with Codespaces](#how-to-run-with-codespaces)
      - [Setup](#setup)
      - [Public sharing](#public-sharing)
    - [Where is the data coming from?](#where-is-the-data-coming-from)
    - [Why is this not a VA forms app (formation)](#why-is-this-not-a-va-forms-app-formation)
    - [What API(s) does this use?](#what-apis-does-this-use)
    - [Feature toggles](#feature-toggles)
      - [Current toggles](#current-toggles)
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
/health-care/appointment-check-in/verify
/health-care/appointment-check-in/contact-information
/health-care/appointment-check-in/details
/health-care/appointment-check-in/see-staff
/health-care/appointment-check-in/complete
/health-care/appointment-check-in/error
```

### What version of the api are we using?

Currently, we are using the `v2` of the API. The mocks in [api/mocks](/api/mocks) show the the current structure and routes used.

### How to run locally

Follow the standard directions to run the app. The API needs to be running in order to run the app locally. Currently I would use the mock api in `src/applications/check-in/api/local-mock-api` using the directions in the [README](https://github.com/department-of-veterans-affairs/vets-website/blob/main/README.md#running-a-mock-api-for-local-development). This makes development easier since creating a valid token is tedious.

### Enable local type checking with jsconfig (Optional)

The `utils` directory of the check-in application contains JSDoc comments to improve editor feedback and autocomplete functionality. To enable advanced type checking, copy the `jsconfig-example.json` file in the root of the check-in folder and rename it to be `jsconfig.json`. The new file will automatically be excluded form the git repo by the gitignore file.

Note that JSDoc comments are only included when the editor cannot not correctly infer types. Any objects, function arguments, or return types that can be successfully inferred from the code are not necessary.

### Run locally for a BE developer

#### Useful Commands

To run locally for a BE developer, you can use the following commands

| Command | Description |
|---------|-------------|
| yarn && yarn build:webpack --env.scaffold | Installs the dependancies and builds the app |
| yarn watch | Runs the app in watch mode |

#### Current Feature toggles to enable

Be sure to have the follow toggles set correctly.

- `check_in_experience_enabled`

#### Steps to see the app

1. Git pull the latest version of `vets-website`
2. Build the front-end using the command `yarn && yarn build:webpack --env.scaffold`
3. Run the app locally using the command `yarn watch`
4. Go to `http://localhost:3001/health-care/appointment-check-in/?id=[SOME VALID GUID]` in your browser

### How to run with Codespaces

#### Setup

[Codespaces](https://docs.github.com/en/codespaces) is available for VA project development, and provides a convenient way to create a functional environment for testing a branch or collaborative review. To set up a codespace, follow the [instructions here](https://depo-platform-documentation.scrollhelp.site/developer-docs/Using-GitHub-Codespaces.1909063762.html). (Note that you can lower the setup time to ~6-7 minutes by creating a setting on your Github account to skip the content build) You may then run the app locally using Codespace's default port forwarding setup.

#### Public sharing

To share an app instance using the mock API running on Codespaces publicly, use these steps:

- Create the codespace as above and wait for it to build
- Start the mock API in a Codespace terminal: `yarn mock-api --responses src/applications/check-in/api/local-mock-api/phase.3.js`
- Start the app in another Codespace terminal: `yarn watch --env api="https://${CODESPACE_NAME}-3000.githubpreview.dev" --env entry=check-in`
- Go to the "Ports" tab and make both port 3000 and 3001 public by right-clicking and selecting Privacy -> Public:
  <img width="999" alt="Screen Shot 2021-10-13 at 2 35 24 PM" src="https://user-images.githubusercontent.com/101649/137209007-c38ea216-1450-47f5-8d4a-7873f5cf82e1.png">
- Hover over the "Local Address" on the line for port 3001 and click the globe icon to open the public URL in your browser.

### Where is the data coming from?

The data is coming from CHIP which abstracts away the where exactly the data is coming from. Vets-API talks to CHIP and handles the communication.

### Why is this not a VA forms app (formation)

Even though this my look like a form, the first iteration of the VA form system would have been to been too heavily modified and gutted to make our use case work. We are thinking about using the new version when its ready.

### What API(s) does this use?

We are currently using the endpoints that are mocked in `src/applications/check-in/api/local-mock-api`.

### Useful acronym and terms

- CHIP - New API that is a central point for all the health data access. Bascially a wrapper around VistA and other internal nasty APIs.
- LoROTA - Low Risk Authorization Service. This is how we are managing and verifying a user is who they say they are. Currently its a token based system that is essentially a shared short term data storage
- Pre- Check in - The name of this app when talking to non techincal folks
- Day of Check in - The is the future work of many of forms
- VeText - This is the service that sends and receives text messages for the user.
- VistA - This is a legacy but powerful health recond system that the VA uses. This is slowly being replace by Cerner.
