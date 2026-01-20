# Login.gov State-Level Downtime Alerts

## Overview
This feature displays state-specific downtime alerts for Login.gov on the VA.gov login page. When Login.gov experiences maintenance or outages affecting specific states (e.g., Arkansas), only users from those affected states will see an alert banner.

## Architecture

### Components
- **LoginGovStateDowntimeBanner** (`src/platform/user/authentication/components/LoginGovStateDowntimeBanner.jsx`)
  - Main component that fetches and displays state-specific downtime alerts
  - Integrated into LoginHeader component
  - Uses VAProfile residential address to determine user's state

### Redux State
- **Reducer**: `externalServiceStatuses` (`src/platform/monitoring/external-services/reducer.js`)
  - New state slice: `loginGovStateIncidents`
  - Properties:
    - `loading`: Boolean indicating if incidents are being fetched
    - `incidents`: Array of incident objects
    - `error`: Boolean/null indicating fetch error state

### API Integration
- **Actions** (`src/platform/monitoring/external-services/actions.js`)
  - `getLoginGovStateIncidents()`: Fetches state incidents from backend
  - Endpoint: `GET /login_gov_state_incidents`
  - Action types:
    - `LOADING_LOGIN_GOV_STATE_INCIDENTS`
    - `FETCH_LOGIN_GOV_STATE_INCIDENTS_SUCCESS`
    - `FETCH_LOGIN_GOV_STATE_INCIDENTS_FAILURE`

### Backend Contract
The backend endpoint `/login_gov_state_incidents` should return:

```json
{
  "data": {
    "attributes": {
      "incidents": [
        {
          "id": "unique-incident-id",
          "active": true,
          "states": ["AR", "TX"],
          "title": "Login.gov maintenance in Arkansas and Texas",
          "message": "Login.gov is currently experiencing scheduled maintenance...",
          "status": "warning"
        }
      ]
    }
  }
}
```

#### Incident Object Schema
- `id` (string): Unique identifier for the incident
- `active` (boolean): Whether the incident is currently active
- `states` (array of strings): State codes affected (e.g., ["AR", "TX"])
- `title` (string): Alert headline
- `message` (string): Detailed alert message
- `status` (string): Alert status - "warning", "error", or "info"

## Feature Flag
- **Name**: `loginGovStateDowntimeAlerts`
- **Backend key**: `login_gov_state_downtime_alerts`
- **Location**: `src/platform/utilities/feature-toggles/featureFlagNames.json`

## State Detection
The component uses `selectVAPResidentialAddress` selector to get the user's state code from their VAProfile (Vet360) contact information. This is the user's residential address on file with VA.

## Analytics
When a state-specific alert is displayed, the following event is tracked:
```javascript
{
  event: 'login-gov-state-downtime-alert-displayed',
  'downtime-state': userStateCode,     // e.g., "AR"
  'incident-id': affectedIncident.id,   // incident identifier
  'incident-status': affectedIncident.status // "warning", "error", etc.
}
```

## Behavior

### When Alert is Shown
- User has a residential address with a state code
- Feature flag `loginGovStateDowntimeAlerts` is enabled
- API successfully returns incidents
- At least one active incident includes the user's state code

### When Alert is NOT Shown
- Feature flag is disabled
- User has no residential address on file
- API returns an error (graceful degradation)
- No active incidents match the user's state
- All incidents for user's state are inactive

## Error Handling
The component implements graceful degradation:
- If API fails, no alert is shown (fail silently)
- If feature flag is disabled, component returns null
- If user has no state on file, no alert is shown
- Login page remains fully functional in all cases

## Testing

### Unit Tests
- Component tests: `src/platform/user/tests/authentication/components/LoginGovStateDowntimeBanner.unit.spec.jsx`
- Reducer tests: `src/platform/monitoring/external-services/tests/reducer-login-gov-incidents.unit.spec.js`
- Actions tests: `src/platform/monitoring/external-services/tests/actions-login-gov-incidents.unit.spec.js`

### E2E Tests (Cypress)
- Test file: `src/applications/login/tests/login-gov-state-downtime.cypress.spec.js`
- Covers:
  - Alert display when user state is affected
  - No alert when user state is not affected
  - No alert when feature flag is disabled
  - Graceful error handling
  - Inactive incidents are not displayed

### Test Coverage
Run unit tests:
```bash
yarn test:unit src/platform/user/tests/authentication/components/LoginGovStateDowntimeBanner.unit.spec.jsx
yarn test:unit src/platform/monitoring/external-services/tests/reducer-login-gov-incidents.unit.spec.js
yarn test:unit src/platform/monitoring/external-services/tests/actions-login-gov-incidents.unit.spec.js
```

Run E2E test:
```bash
yarn cy:run --spec "src/applications/login/tests/login-gov-state-downtime.cypress.spec.js"
```

## Deployment

### Progressive Rollout
1. Deploy backend endpoint `/login_gov_state_incidents`
2. Deploy frontend code
3. Enable feature flag for canary users
4. Monitor analytics and error logs
5. Gradually increase rollout percentage
6. Enable for all users once validated

### Monitoring
Track these metrics:
- Alert display frequency by state
- API success/failure rates
- User interactions with the alert
- Login completion rates when alert is shown

## Accessibility
- Uses USWDS `va-alert` component for consistent styling
- Properly structured heading hierarchy
- Screen reader compatible
- Tested with axe-core in Cypress tests

## Future Enhancements
- Support for multiple simultaneous incidents per state
- Localized alert messages (Spanish, Tagalog, etc.)
- Link to status page or help resources
- Ability to dismiss alerts (with localStorage persistence)
- Scheduled/future incident warnings (not just active)
