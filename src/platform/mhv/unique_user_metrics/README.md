# MHV Unique User Metrics

This module provides a centralized way to log unique user metrics events for MHV applications. It implements a fire-and-forget pattern for analytics tracking that is more accurate than Google Analytics and provides opt-out-free metrics.

## ⚠️ Important Database Size Warning

**Each new event type creates a record for EVERY user who triggers it.** With millions of VA users, adding new events can result in millions of database records. Please consult with the backend team and database administrators before adding new events.

## Usage

### Basic Usage

```javascript
import { logUniqueUserMetricsEvents, EVENT_REGISTRY } from '@department-of-veterans-affairs/mhv/exports';

// Log a single event
logUniqueUserMetricsEvents(EVENT_REGISTRY.SECURE_MESSAGING_MESSAGE_SENT);

// Log multiple events using variable arguments
logUniqueUserMetricsEvents(
  EVENT_REGISTRY.SECURE_MESSAGING_MESSAGE_SENT,
  EVENT_REGISTRY.SECURE_MESSAGING_INBOX_ACCESSED
);
```

### Available Events

All available events are defined in `eventRegistry.js`. 

## Adding New Events

1. **Think twice** - Each event impacts database size significantly
2. Open `eventRegistry.js` and read the warning at the top
3. Add your event to the `EVENT_REGISTRY` object as a string value
4. Preference is to use lowercase, and underscores instead of spaces (e.g., `mhv_new_feature_accessed`)
5. Maximum 50 characters per event name
6. Discuss with backend team before deploying

### Example of adding a new event:
You must use event keys that exist in `eventRegistry.js`.
```javascript
// Add to EVENT_REGISTRY in eventRegistry.js
NEW_FEATURE_ACCESSED: 'mhv_new_feature_accessed',
PRESCRIPTIONS_REFILLED: 'mhv_rx_refilled',
```

## Architecture

### Fire-and-Forget Pattern

- The API call is asynchronous and doesn't block the UI
- No return value is expected or used
- Errors are logged to Sentry but don't affect user experience
- Failed requests don't retry (to avoid overwhelming the API)

### Error Handling

- Invalid event IDs are logged to Sentry with warnings
- API failures are logged to Sentry with error level
- API response errors (non-created/exists status) are logged as warnings
- All errors are silent to the user

### Validation

- Event values must exist in the `EVENT_REGISTRY`
- Event names must be 1-50 characters
- At least one event must be provided
- Uses variable arguments for clean API: `logUniqueUserMetricsEvents(event1, event2, ...)`
- All provided events are validated against the registry before sending
