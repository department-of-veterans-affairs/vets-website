# Edge Case Handling for Refill Prescriptions

## Overview
This document explains how the refill prescriptions feature handles edge cases for multiple tabs and slow network connections.

## Problem Statement

### Multiple Tabs Issue
- **Scenario**: User has the refill page open in multiple browser tabs
- **Risk**: Submitting the same refill request from different tabs simultaneously
- **Impact**: Duplicate prescription refill requests sent to backend

### Slow Connection Issue
- **Scenario**: User has a slow or intermittent network connection
- **Risk**: Long cache refresh times leaving users with indefinite loading spinners
- **Impact**: Poor UX, users may think the app is broken, or leave page during refresh

## Solution Architecture

### 1. Multiple Tabs Protection

#### RTK Query Fixed Cache Key
```javascript
const [bulkRefillPrescriptions, result] = useBulkRefillPrescriptionsMutation({
  fixedCacheKey: 'bulk-refill-request',
});
```

**How it works:**
- RTK Query uses the `fixedCacheKey` to deduplicate mutations across the entire application
- If Tab A triggers a mutation with key `'bulk-refill-request'`, Tab B cannot trigger another mutation with the same key until Tab A's completes
- The mutation state is shared across all tabs using the same cache key
- Prevents race conditions and duplicate API calls

#### Automatic Tab Synchronization
```javascript
// In prescriptionsApi.js
export const prescriptionsApi = createApi({
  // ...
  refetchOnFocus: true,
  refetchOnReconnect: true,
  // ...
});

// In app-entry.jsx
setupListeners(store.dispatch);
```

**How it works:**
- `setupListeners()` enables RTK Query's automatic refetching behaviors
- `refetchOnFocus: true` triggers a data refetch when the window regains focus
- When user switches from Tab B back to Tab A, RTK Query automatically refetches data
- Ensures all tabs show consistent, up-to-date information
- `refetchOnReconnect: true` refetches when network connection is restored

### 2. Slow Connection Handling

#### Three-Tier Timeout System

**Tier 1: Normal Operation (0-5 seconds)**
```
[Refill Submitted] → [Cache Invalidated] → [Refreshing...]
```
- Shows standard loading message: "Updating your refillable prescriptions list..."
- Form is hidden to prevent duplicate submissions

**Tier 2: Slow Connection Detected (5-30 seconds)**
```
[5 seconds passed] → [Slow connection indicator]
```
- Message updates to: "Updating your refillable prescriptions list... This is taking longer than usual. Please wait..."
- Form remains hidden but user gets feedback about the delay

**Tier 3: Timeout Reached (30+ seconds)**
```
[30 seconds passed] → [Timeout alert] → [Form restored]
```
- Warning alert appears explaining the situation
- Form becomes visible again (with original data)
- User can continue using the page

#### Implementation
```javascript
// Slow connection detection (5 seconds)
const slowConnectionTimeoutId = setTimeout(() => {
  if (isRefreshing) {
    setIsSlowConnection(true);
  }
}, 5000);

// Maximum wait timeout (30 seconds)
const timeoutId = setTimeout(() => {
  if (isRefreshing) {
    setRefreshTimeoutReached(true);
    setRefillStatus(REFILL_STATUS.NOT_STARTED);
  }
}, 30000);
```

#### User Experience Flow

```
User clicks "Request refill"
        ↓
Refill submitted to backend
        ↓
Cache invalidation triggered
        ↓
Form hidden, loading spinner shown
        ↓
    [Wait 5s]
        ↓
Still loading? → Show "taking longer than usual" message
        ↓
    [Wait 25s more]
        ↓
Still loading? → Show warning alert, restore form
        ↓
User can refresh page or continue browsing
```

#### Network Reconnection
```javascript
refetchOnReconnect: true
```
- Automatically refetches when network connection is restored
- Handles intermittent connection drops
- Ensures data is fresh when connection returns

## Testing Strategy

### Multiple Tabs Test
```javascript
it('uses fixedCacheKey for mutation to prevent duplicate submissions across tabs', () => {
  // Verify mutation hook is called with fixedCacheKey option
  expect(mutationStub.firstCall.args[0]).to.deep.equal({
    fixedCacheKey: 'bulk-refill-request',
  });
});
```

### Slow Connection Test
```javascript
it('shows slow connection message after 5 seconds of refreshing', () => {
  // Use fake timers to fast-forward time
  clock.tick(5000);
  // Verify message includes "taking longer than usual"
});
```

### Timeout Test
```javascript
it('shows timeout alert and restores form after 30 seconds', () => {
  // Fast-forward 30 seconds
  clock.tick(30000);
  // Verify alert appears and form is visible
});
```

## Trade-offs and Considerations

### Why 30 seconds?
- Long enough for most slow connections to complete
- Short enough to prevent user frustration
- Matches common timeout patterns in web applications

### Why show the form after timeout?
- Prevents user from being stuck indefinitely
- Allows user to take action (refresh, navigate away)
- Shows warning about potentially stale data
- Better UX than infinite loading

### Why 5 seconds for slow connection?
- Fast enough to provide feedback quickly
- Slow enough to avoid false positives on normal connections
- Gives users confidence the app is still working

## Diagram: State Transitions

```
┌─────────────────┐
│  NOT_STARTED    │
└────────┬────────┘
         │ User clicks "Request refill"
         ▼
┌─────────────────┐
│  IN_PROGRESS    │ ← Mutation executing
└────────┬────────┘
         │ Success/Error
         ▼
┌─────────────────┐
│    FINISHED     │ ← Cache invalidation triggered
└────────┬────────┘
         │
         ▼
┌─────────────────┐     5s     ┌──────────────────────┐
│  isRefreshing   │────────────▶│  isSlowConnection    │
│  Form hidden    │             │  Enhanced message    │
└────────┬────────┘             └──────────────────────┘
         │
         │ 30s
         ▼
┌─────────────────┐
│ Timeout reached │
│  Alert shown    │
│  Form restored  │
└─────────────────┘
```

## Benefits

### For Multiple Tabs:
✅ Prevents duplicate API calls  
✅ Ensures consistent state across tabs  
✅ Automatic synchronization when switching tabs  
✅ No user action required  

### For Slow Connections:
✅ Progressive feedback (immediate → 5s → 30s)  
✅ Prevents indefinite waiting  
✅ Clear communication about what's happening  
✅ Graceful degradation with warning  
✅ Automatic recovery on reconnection  

## Future Enhancements

### Potential Improvements:
1. **Exponential backoff**: Retry failed requests with increasing delays
2. **Network quality detection**: Detect 3G/4G/5G and adjust timeouts accordingly
3. **Offline mode**: Queue requests when offline, submit when reconnected
4. **Service worker**: Cache responses for offline resilience
5. **Real-time updates**: WebSocket connection for instant cross-tab updates

### Monitoring Recommendations:
1. Track timeout frequency in analytics
2. Monitor slow connection occurrences
3. Alert on high duplicate submission attempts
4. Measure average cache refresh duration
