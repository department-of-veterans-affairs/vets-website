# Setup Datadog Real-User Monitoring (RUM) and Browser Logs

## Quick links

- VA Datadog dashboards:[vagov.ddog-gov.com](https://vagov.ddog-gov.com)
- Datadog documentation: [docs.datadoghq.com](https://docs.datadoghq.com/)
- [RUM initialization parameters](https://docs.datadoghq.com/real_user_monitoring/browser/setup/client/?tab=rum#initialization-parameters)
  - [Replay Privacy options](https://docs.datadoghq.com/real_user_monitoring/session_replay/browser/privacy_options/)
  - [VA-specific testing for PII/PHI](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/platform/analytics/setup-real-user-monitoring.md#testing-for-exposed-content)
  - [VA page checker](https://chromewebstore.google.com/detail/va-page-checker/bohcdnelkeimoooidokojkcjdaahjbkb) (Chrome browser extension) - highlights elements with Datadog privacy class & action name attributes
- [LOG initialization parameters](https://docs.datadoghq.com/logs/log_collection/javascript/?tab=us#configuration)
- [Feature toggles guide](https://depo-platform-documentation.scrollhelp.site/developer-docs/feature-toggles-guide)
- [Datadog authors Slack channel](https://dsva.slack.com/archives/C05SGJEAJ65)

## Datadog basics

Datadog RUM "records" sessions of Veterans using an app or form. It doesn't fully render the page and masks user input (see `defaultPrivacyLevel`). We're using a feature toggle to allow reviewing session replays from staging to ensure that Personally Identifiable Information (PII) and Protected Health Information (PHI) is not exposed.

Datadog LOG replaces Sentry so that specific events or errors can be logged and displayed within the dashboards

## Setup

- Start with adding a [feature toggle](https://depo-platform-documentation.scrollhelp.site/developer-docs/feature-toggles-guide) to both the backend and frontend (Not required for LOG-only setup)
- Contact the VA engineer for your team, or post in the [`#benefits-dd-authors` Slack channel](https://dsva.slack.com/archives/C05SGJEAJ65) that you need Datadog set up for your app.
  - They will set up the Datadog dashboard
  - They will ask you about your (anticipated) user session count; to determine the percentage of users that visit your app that will be recorded. VA has a limited budget to pay for these sessions. You will get a `sessionReplaySampleRate` percentage.
  - They will provide you with the `applicationId`, `clientToken` and `service` values

### Setup both RUM & LOG

In your application's main file (usually `App.jsx`), add the following:

```js
import { useBrowserMonitoring } from 'platform/monitoring/Datadog';
import environment from 'platform/utilities/environment';

const DATA_DOG_TOGGLE = '{APP_NAME}BrowserMonitoringEnabled'; // typical name
const DATA_DOG_ID = '{APP_UUID}';
const DATA_DOG_SERVICE = '{APP_DASHBOARD_NAME}';
const DATA_DOG_TOKEN = 'pub{TOKEN_ID}';
const DATA_DOG_VERSION = '1.0.0';

export const App = ({ /* */ }) => {
  // ...

  // Add Datadog monitoring to the application
  useBrowserMonitoring({
    loggedIn: undefined, // optional, pass a boolean if log in required
    toggleName: DATA_DOG_TOGGLE,
    applicationId: DATA_DOG_ID,
    clientToken: DATA_DOG_TOKEN,
    service: DATA_DOG_SERVICE,
    version: DATA_DOG_VERSION,
    // example: record 100% of staging sessions, but only 10% of production
    sessionReplaySampleRate:
      environment.vspEnvironment() === 'staging' ? 100 : 10,
    // Add any additional RUM or LOG settings here
  });

  // ...
};
```

Setting notes:
- `loggedIn` (optional) - leave undefined if your form can be started without being authenticated. Pass in a boolean value to prevent initialization when not logged in
- `toggleName` (required) - Feature toggle name associated with enabling RUM & LOG monitoring in production
- `applicationId` (required) - Application UUID provided by VA after request
- `clientToken` (required) - Token provided by VA after request
- `service` (required) - Datadog dashboard name
- `version` (required) - Determined by your team
- `sessionReplaySampleRate` (optional) - Determined by VA based on traffic to your application (defaults to `100` percent)

### RUM-only setup

```js
import { initializeRealUserMonitoring } from 'platform/monitoring/Datadog';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import environment from 'platform/utilities/environment';

const DATA_DOG_TOGGLE = '{APP_NAME}BrowserMonitoringEnabled}'; // typical name
const DATA_DOG_ID = '{APP_UUID}';
const DATA_DOG_SERVICE = '{APP_DASHBOARD_NAME}';
const DATA_DOG_TOKEN = 'pub{TOKEN_ID}';
const DATA_DOG_VERSION = '1.0.0';

export const App = ({ /* */ }) => {
  // ...

  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();
  const isLoadingFeatureFlags = useToggleLoadingValue();
  const isBrowserMonitoringEnabled = useToggleValue(TOGGLE_NAMES[DATA_DOG_TOGGLE]);

  useEffect(
    () => {
      if (isLoadingFeatureFlags || !loggedIn) {
        return;
      }

      if (DATA_DOG_TOGGLE && isBrowserMonitoringEnabled) {
        // Add Datadog RUM to the application
        initializeRealUserMonitoring({
          applicationId: DATA_DOG_ID,
          clientToken: DATA_DOG_TOKEN,
          service: DATA_DOG_SERVICE,
          version: DATA_DOG_VERSION,
          // example: record 100% of staging sessions, but only 10% of production
          sessionReplaySampleRate:
            environment.vspEnvironment() === 'staging' ? 100 : 10,
          // Add any additional RUM settings here
        });
      } else {
        delete window.DD_RUM;
      }
    },
    [loggedIn, isBrowserMonitoringEnabled, isLoadingFeatureFlags],
  );

  // ...
};
```

Notes:
- `loggedIn` (optional) - Pass in a boolean value to prevent initialization when not logged in; or remove if your form allows unauthenticated use
- `toggleName` (required) - Feature toggle name associated with enabling RUM in production
- `applicationId` (required) - Application UUID provided by VA after request
- `clientToken` (required) - Token provided by VA after request
- `service` (required) - Datadog dashboard name
- `version` (required) - Determined by your team
- `sessionReplaySampleRate` (optional) - Determined by VA based on traffic to your application (defaults to `100` percent)

### LOG-only setup

Running Datadog LOG doesn't require all the extra checks:
- No feature toggle needed
- No Login check needed
- May need bot check if you have concerns over conflating error reporting

```js
import { initializeBrowserLogging } from 'platform/monitoring/Datadog';

const DATA_DOG_TOGGLE = '{APP_NAME}BrowserMonitoringEnabled}'; // typical name
const DATA_DOG_ID = '{APP_UUID}';
const DATA_DOG_SERVICE = '{APP_DASHBOARD_NAME}';
const DATA_DOG_TOKEN = 'pub{TOKEN_ID}';
const DATA_DOG_VERSION = '1.0.0';

export const App = ({ /* */ }) => {
  // ...

  // Add Datadog LOG monitoring to the application
  initializeBrowserLogging({
    applicationId: DATA_DOG_ID,
    clientToken: DATA_DOG_TOKEN,
    service: DATA_DOG_SERVICE,
    version: DATA_DOG_VERSION,
    // Add any additional LOG settings here
  });

  // ...
};
```

Notes:
- `applicationId` (required) - Application UUID provided by VA after request
- `clientToken` (required) - Token provided by VA after request
- `service` (required) - Datadog dashboard name
- `version` (required) - Determined by your team
- `telemetrySampleRate` (optional) - Defaults to 100%

## Utilities

### Check for Bots

A utility is used to ensure that Datadog RUM sessions are not initialized if the page is being crawled through by a bot ([Datadog docs](https://docs.datadoghq.com/real_user_monitoring/guide/identify-bots-in-the-ui/#filter-out-bot-sessions-on-intake)); but it is available for general usage.

Note: Most apps require login, so bots likely only have access to your landing or introduction page. In some cases, you may want RUM set up on static pages, so checking for a bot is essential.

```js
import { isBot } from 'platform/monitoring/Datadog';

// inside component
if (isBot()) {
  return
}
```

### Can initialize Datadog

Another utility checks the following before it allows Datadog to be initialized:
- Page is not running in local dev environment
- `isBot` check
- Checks for `window.Mocha` to not run in unit tests
- Checks for `window.Cypress` to not run in Cypress end-to-end tests

```js
import { canInitDatadog } from 'platform/monitoring/Datadog';

// inside component
if (!canInitDatadog()) {
  return
}
```
