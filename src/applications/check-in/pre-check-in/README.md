# Pre Check in Application

- [Check in Application](#check-in-application)
  - [Description](#description)
  - [Slack Channels](#slack-channels)
  - [Approval Groups](#approval-groups)
  - [Project Documentation](#project-documentation)
  - [Good to knows](#good-to-knows)
    - [Project URLS](#project-urls)
    - [How to run locally](#how-to-run-locally)
    - [How to run with Codespaces](#how-to-run-with-codespaces)
    - [Where is the data coming from?](#where-is-the-data-coming-from)
    - [Why is this not a VA forms app (formation)](#why-is-this-not-a-va-forms-app-formation)
    - [What API(s) does this use?](#what-apis-does-this-use)
    - [Feature toggles](#feature-toggles)
    - [How to test this?](#how-to-test-this)
    - [Useful acronym and terms](#useful-acronym-and-terms)

## Description

// TODO: fill this doc in with ticket number<https://github.com/department-of-veterans-affairs/va.gov-team/issues/32743>

## Slack Channels

- [Check In Experience](https://slack.com/app_redirect?channel=C022AC2STBM)

## Approval Groups

- [Health Care Experience Team](https://github.com/orgs/department-of-veterans-affairs/teams/vsa-healthcare-experience)
- [Health Care System Team](https://github.com/orgs/department-of-veterans-affairs/teams/va-cto-health-products)

## Project Documentation

// TODO: fill this doc in with ticket number<https://github.com/department-of-veterans-affairs/va.gov-team/issues/32743>

## Good to knows

### Project URLS

// TODO: fill this doc in with ticket number<https://github.com/department-of-veterans-affairs/va.gov-team/issues/32743>

### What version of the api are we using?

// TODO: fill this doc in with ticket number<https://github.com/department-of-veterans-affairs/va.gov-team/issues/32743>

### How to run locally

Follow the standard directions to run the app. The API needs to be running in order to run the app locally. Currently I would use the mock api in `src/applications/check-in/api/local-mock-api` using the directions in the [README](https://github.com/department-of-veterans-affairs/vets-website/blob/master/README.md#running-a-mock-api-for-local-development). This makes development easier since creating a valid token is tedious.

### Enable local type checking with jsconfig (Optional)

The `utils` directory of the check-in application contains JSDoc comments to improve editor feedback and autocomplete functionality. To enable advanced type checking, copy the `jsconfig-example.json` file in the root of the check-in folder and rename it to be `jsconfig.json`. The new file will automatically be excluded form the git repo by the gitignore file.

Note that JSDoc comments are only included when the editor cannot not correctly infer types. Any objects, function arguments, or return types that can be successfully inferred from the code are not necessary.

### How to run with Codespaces

#### Setup

[Codespaces](https://docs.github.com/en/codespaces) is available for VA project development, and provides a convenient way to create a functional environment for testing a branch or collaborative review. To set up a codespace, follow the [instructions here](https://depo-platform-documentation.scrollhelp.site/developer-docs/Using-GitHub-Codespaces.1909063762.html). (Note that you can lower the setup time to ~6-7 minutes by creating a setting on your Github account to skip the content build) You may then run the app locally using Codespace's default port forwarding setup.

#### Public sharing

To share an app instance using the mock API running on Codespaces publicly, use these steps:

- Create the codespace as above and wait for it to build
- Start the mock API in a Codespace terminal: `yarn mock-api --responses src/applications/check-in/api/local-mock-api/phase.3.js`
- Start the app in another Codespace terminal: `yarn watch --env.api="https://${CODESPACE_NAME}-3000.githubpreview.dev" --env.entry check-in`
- Go to the "Ports" tab and make both port 3000 and 3001 public by right-clicking and selecting Privacy -> Public:
  <img width="999" alt="Screen Shot 2021-10-13 at 2 35 24 PM" src="https://user-images.githubusercontent.com/101649/137209007-c38ea216-1450-47f5-8d4a-7873f5cf82e1.png">
- Hover over the "Local Address" on the line for port 3001 and click the globe icon to open the public URL in your browser.

### Where is the data coming from?

// TODO: fill this doc in with ticket number<https://github.com/department-of-veterans-affairs/va.gov-team/issues/32743>

### What API(s) does this use?

// TODO: fill this doc in with ticket number<https://github.com/department-of-veterans-affairs/va.gov-team/issues/32743>

### Feature toggles

We are currently using an HOC located at `src/applications/pre-check-in/containers/withFeatureFlip.jsx` to control the feature flips. The whole app is wrapped around one, and each new feature should have its own toggle.

#### Current toggles

- `check_in_experience_pre_check_in_enabled` : Enables or disabled the whole app on va.gov
  - when to sunset: never;

### How to test this?

Each feature should have unit tests and e2e tests.

For testing in staging, use the instructions at [https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/checkin/engineering/qa/test-data-setup.md](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/checkin/engineering/qa/test-data-setup.md).

### Useful acronym and terms

// TODO: fill this doc in with ticket number<https://github.com/department-of-veterans-affairs/va.gov-team/issues/32743>

- CHIP - New API that is a central point for all the health data access. Bascially a wrapper around VistA and other internal nasty APIs.
- LoROTA - Low Risk Authorization Service. This is how we are managing and verifying a user is who they say they are. Currently its a token based system that is essentially a shared short term data storage
- VeText - This is the service that sends and receives text messages for the user.
- VistA - This is a legacy but powerful health recond system that the VA uses. This is slowly being replace by Cerner.
