# Travel Claim Application

## Description

The Travel Claim Application satifies a travel only flow. There is no check in or status changes to the appointments. It uses shared components from the other apps(pre-check-in and check-in). It is designed to allow patients at Oracle Health centers to file a travel claim on the day of their appointment or appointments.

## Slack Channels

- [Check In Experience](https://slack.com/app_redirect?channel=C022AC2STBM)

## Approval Groups

- [Health Care Experience Team](https://github.com/orgs/department-of-veterans-affairs/teams/vsa-healthcare-experience)
- [Health Care System Team](https://github.com/orgs/department-of-veterans-affairs/teams/va-cto-health-products)

## Project Documentation

## Good to knows

### Project URL

``` markdown
/my-health/appointment-travel-claim/
```

### What version of the api are we using?

What we know

- Using v2 of the api for low auth
- GET from vets-api for appointment and patient data
- POSTing to a vets-api BTSSS endpoint to file a travel claim

### How to run locally

Follow the standard directions to run the app. The API needs to be running in order to run the app locally. Currently I would use the mock api in `src/applications/pre-check-in/api/local-mock-api` using the directions in the [README](https://github.com/department-of-veterans-affairs/vets-website/blob/main/README.md#running-a-mock-api-for-local-development). This makes development easier since creating a valid token is tedious.

### Enable local type checking with jsconfig (Optional)

The `utils` directory of the check-in application contains JSDoc comments to improve editor feedback and autocomplete functionality. To enable advanced type checking, copy the `jsconfig-example.json` file in the root of the check-in folder and rename it to be `jsconfig.json`. The new file will automatically be excluded form the git repo by the gitignore file.

Note that JSDoc comments are only included when the editor cannot not correctly infer types. Any objects, function arguments, or return types that can be successfully inferred from the code are not necessary.

### How to run with Codespaces

#### Setup

[Codespaces](https://docs.github.com/en/codespaces) is available for VA project development, and provides a convenient way to create a functional environment for testing a branch or collaborative review. To set up a codespace, follow the [instructions here](https://depo-platform-documentation.scrollhelp.site/developer-docs/Using-GitHub-Codespaces.1909063762.html). (Note that you can lower the setup time to ~6-7 minutes by creating a setting on your Github account to skip the content build) You may then run the app locally using Codespace's default port forwarding setup.

#### Public sharing

To share an app instance using the mock API running on Codespaces publicly, use these steps:

- Create the codespace as above and wait for it to build
- Start the mock API in a Codespace terminal: `yarn mock-api --responses path/to/mock/api.js`
- Start the app in another Codespace terminal: `yarn watch --env.api="https://${CODESPACE_NAME}-3000.githubpreview.dev" --env.entry pre-check-in`
- Go to the "Ports" tab and make both port 3000 and 3001 public by right-clicking and selecting Privacy -> Public:
  <img width="999" alt="Screen Shot 2021-10-13 at 2 35 24 PM" src="https://user-images.githubusercontent.com/101649/137209007-c38ea216-1450-47f5-8d4a-7873f5cf82e1.png">
- Hover over the "Local Address" on the line for port 3001 and click the globe icon to open the public URL in your browser.

### Where is the data coming from?

- Patient and Appointment data are coming from Profile service.

### What API(s) does this use?

- vets-api POST /sessions
- vets-api GET /patient-data
- vets-api POST /travel-claim

### Feature toggles

We are currently using an HOC located at `src/applications/check-in/containers/withFeatureFlip.jsx` to control the feature flips. The whole app is wrapped around one, and each new feature should have its own toggle.

Though we have the HOC, its now considered best practice to query redux using the useSelector hook.

#### Current toggles

TBD

### How to test this?

Each feature should have unit tests and e2e tests.

For testing in staging, use the instructions at [https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/checkin/engineering/qa/test-data-setup.md](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/checkin/engineering/qa/test-data-setup.md).

### Useful acronym and terms

- CHIP - New API that is a central point for all the health data access. Bascially a wrapper around VistA and other internal nasty APIs.
- LoROTA - Low Risk Authorization Service. This is how we are managing and verifying a user is who they say they are. Currently its a token based system that is essentially a shared short term data storage
- VeText - This is the service that sends and receives text messages for the user.
- VistA - This is a legacy but powerful health recond system that the VA uses. This is slowly being replace by Cerner.
- VA Profile - This is the universal profile service that is used to store veteran data.
- Check-In - The day of check in applicatipn
- Pre-Check-In - The forms that a user can fill out before they check in.
- Travel-claim - This travel only flow for Oracle Health centers.

### Error handling

All errors are stored as strings in Redux state. When an error occurs in a component all that is done in that component is to call the `updateError` method from the `useUpdateError` hook.

```
try {
  *something*
} catch (error) {
  updateError('error-completing-pre-check-in');
}
```
This architecture separates the error logic from the component that throws the error so that it does not need not be concerned with how to handle the error just with what type of error occured. which results in dryer code if the same error is thrown from different components in the application.

Next, an error type represented by a string is passed to the `updateError` method which dispatches `setError` which stores the error type string in the Redux state.
```
const updateError = useCallback(
  error => {
    dispatch(setError(error));
  },
  [dispatch],
);
```
Later this could include more robust error reporting using GA, Sentry or Datadog. This also give us the flexibility to create other side effects like add more information to the state object for more complicated error messaging based on the error type.

There is a higher order component called `withError` that selects the error and if there is one routes to the Error page using the `goToErrorPage` utility where logic on the error page components display the proper error messaging.
```
useEffect(
  () => {
    if (error) {
      goToErrorPage(error);
    }
  },
  [error],
);

```
The router utility goToErrorPage will use the error string to add a query string to the url for GA tracking. This gives us more flexibility to get creative with the URL parameters.

