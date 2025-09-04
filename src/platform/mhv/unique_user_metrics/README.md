# MHV Unique User Metrics

This module provides a centralized way to log unique user metrics events for MHV applications. It implements a fire-and-forget pattern for analytics tracking that is more accurate than Google Analytics and provides opt-out-free metrics.

## ⚠️ Important Database Size Warning

**Each new event type creates a record for EVERY user who triggers it.** With millions of VA users, adding new events can result in millions of database records. Please consult with the backend team and database administrators before adding new events.

## Usage

### Basic Usage

```javascript
import { logUniqueUserMetricsEvents, EVENT_REGISTRY } from '@department-of-veterans-affairs/mhv/exports';

// Log a single event key (which may contain multiple event names)
logUniqueUserMetricsEvents(EVENT_REGISTRY.SECURE_MESSAGING_MESSAGE_SENT);

// Log multiple event keys
logUniqueUserMetricsEvents([
  EVENT_REGISTRY.SECURE_MESSAGING_MESSAGE_SENT,
  EVENT_REGISTRY.SECURE_MESSAGING_INBOX_ACCESSED
]);
```

### Available Events

All available events are defined in `eventRegistry.js`. 

## Adding New Events

1. **Think twice** - Each event impacts database size significantly
2. Open `eventRegistry.js` and read the warning at the top
3. Add your event to the `EVENT_REGISTRY` object as an array of event names
4. Use the pattern: `feature_action_accessed` (e.g., `new_feature_accessed`)
5. Maximum 50 characters per event name
6. You can include multiple related event names in a single registry entry
7. Discuss with backend team before deploying

### Example of adding a new event:
You must use event keys that exist in `eventRegistry.js`.
```javascript
// Single event name
NEW_FEATURE_ACCESSED: ['new_feature_accessed'],

// Multiple related event names
COMPLEX_FEATURE_ACCESSED: [
  'complex_feature_accessed',
  'complex_feature_main_accessed',
  'complex_feature_analytics_tracked'
],
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

- Event keys must exist in the `EVENT_REGISTRY`
- Event names must be 1-50 characters
- At least one event must be provided
- Input is normalized to handle single event keys or arrays
- Multiple event names from a single registry entry are automatically flattened and sent together
