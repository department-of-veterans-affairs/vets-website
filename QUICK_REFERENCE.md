# Quick Reference: Edge Case Handling

## TL;DR - How It Works

### Multiple Tabs → Fixed Cache Key
```javascript
useBulkRefillPrescriptionsMutation({
  fixedCacheKey: 'bulk-refill-request'  // Same key = deduplicated
});
```
**Result:** Only 1 request runs even if user clicks in 2+ tabs

### Slow Connection → Progressive Timeout
```
0s  → Refill submitted
5s  → "Taking longer than usual..."
30s → ⚠️ Alert shown, form restored
```
**Result:** User never stuck indefinitely

### Tab Switching → Auto Sync
```javascript
refetchOnFocus: true      // Refetch when tab gains focus
refetchOnReconnect: true  // Refetch when network reconnects
setupListeners(dispatch)  // Enable the behaviors
```
**Result:** All tabs always show current data

## Visual State Machine

```
┌─────────────────────────────────────────────────────┐
│                   NOT_STARTED                        │
│  • User sees refillable prescriptions list           │
│  • "Request refill" button enabled                   │
└──────────────────┬──────────────────────────────────┘
                   │
         User clicks "Request refill"
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│                  IN_PROGRESS                         │
│  • Button disabled                                   │
│  • Mutation executing (with fixedCacheKey)           │
│  • Other tabs BLOCKED from same mutation             │
└──────────────────┬──────────────────────────────────┘
                   │
            Success or Error
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│                    FINISHED                          │
│  • Cache invalidation triggered                      │
│  • isRefreshing = true                               │
│  • Form HIDDEN                                       │
└──────────────────┬──────────────────────────────────┘
                   │
            Timer: 0-5 seconds
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              REFRESHING (Normal)                     │
│  • Loading: "Updating your refillable                │
│    prescriptions list..."                            │
│  • All tabs show loading spinner                     │
└──────────────────┬──────────────────────────────────┘
                   │
                   ├─── If completes before 5s ────────┐
                   │                                     │
            Timer: 5-30 seconds                         │
                   │                                     │
                   ▼                                     │
┌─────────────────────────────────────────────────────┐│
│           REFRESHING (Slow Network)                  ││
│  • Loading: "...This is taking longer                ││
│    than usual. Please wait..."                       ││
│  • isSlowConnection = true                           ││
└──────────────────┬──────────────────────────────────┘│
                   │                                     │
                   ├─── If completes before 30s ────────┤
                   │                                     │
            Timer: 30+ seconds                          │
                   │                                     │
                   ▼                                     │
┌─────────────────────────────────────────────────────┐│
│              TIMEOUT REACHED                         ││
│  • ⚠️ Alert: "Prescription list may not be           ││
│    fully updated"                                    ││
│  • refreshTimeoutReached = true                      ││
│  • Form RESTORED (with old data)                     ││
│  • User can refresh page                             ││
└──────────────────┬──────────────────────────────────┘│
                   │                                     │
                   └─────────────────────────────────────┘
                   │
            Cache completes
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│               LIST UPDATED                           │
│  • New list displayed                                │
│  • Refilled prescriptions removed                    │
│  • isRefreshing = false                              │
│  • All tabs synchronized                             │
└─────────────────────────────────────────────────────┘
```

## Code Locations

### API Configuration
**File:** `src/applications/mhv-medications/api/prescriptionsApi.js`
```javascript
export const prescriptionsApi = createApi({
  // ...
  refetchOnFocus: true,        // ← Sync tabs on focus
  refetchOnReconnect: true,    // ← Refetch on reconnect
  // ...
});
```

### App Setup
**File:** `src/applications/mhv-medications/app-entry.jsx`
```javascript
import { setupListeners } from '@reduxjs/toolkit/query';
// ...
setupListeners(store.dispatch);  // ← Enable auto-refetch
```

### Component Logic
**File:** `src/applications/mhv-medications/containers/RefillPrescriptions.jsx`
```javascript
// Fixed cache key for deduplication
const [bulkRefillPrescriptions, result] = 
  useBulkRefillPrescriptionsMutation({
    fixedCacheKey: 'bulk-refill-request',  // ← Prevents duplicates
  });

// Timeout state management
const [isSlowConnection, setIsSlowConnection] = useState(false);
const [refreshTimeoutReached, setRefreshTimeoutReached] = useState(false);

// Progressive timeout handling
useEffect(() => {
  if (isRefreshing) {
    // 5s: Slow connection indicator
    const slowTimer = setTimeout(() => {
      setIsSlowConnection(true);
    }, 5000);
    
    // 30s: Timeout with form restoration
    const timeoutTimer = setTimeout(() => {
      setRefreshTimeoutReached(true);
      setRefillStatus(REFILL_STATUS.NOT_STARTED);
    }, 30000);
    
    return () => {
      clearTimeout(slowTimer);
      clearTimeout(timeoutTimer);
    };
  }
}, [isRefreshing]);
```

## Testing

### Run Edge Case Tests
```bash
# Run all refill tests
yarn test:unit --app-folder mhv-medications --grep "RefillPrescriptions"

# Run only edge case tests
yarn test:unit --app-folder mhv-medications --grep "Edge case handling"
```

### Manual Testing Scenarios

#### Test 1: Multiple Tabs
1. Open refill page in Tab A
2. Open refill page in Tab B
3. In Tab A, select medication and click "Request refill"
4. Quickly switch to Tab B and try to click "Request refill"
5. **Expected:** Tab B's button should be disabled or mutation blocked
6. **Expected:** Both tabs show loading, then updated list

#### Test 2: Slow Connection Simulation
1. Open Chrome DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Click "Request refill"
4. **At 5s:** Should see "taking longer than usual" message
5. **At 30s:** Should see warning alert and form restoration
6. **Expected:** User can refresh or continue browsing

#### Test 3: Network Reconnection
1. Open refill page
2. Open DevTools → Network tab → Go offline
3. Click "Request refill" (will fail)
4. Go back online
5. **Expected:** RTK Query automatically refetches
6. **Expected:** List updates without user action

## Troubleshooting

### Problem: Duplicate requests still happening
**Check:**
- Is `fixedCacheKey` set in mutation hook?
- Is it the same key in all usages?
- Are multiple mutation hooks being created?

### Problem: Tabs not syncing
**Check:**
- Is `setupListeners(store.dispatch)` called in app-entry.jsx?
- Are `refetchOnFocus` and `refetchOnReconnect` set to `true`?
- Is the cache being properly invalidated?

### Problem: Timeout not working
**Check:**
- Is `isRefreshing` state being set correctly?
- Are timeouts being cleared properly?
- Check browser console for errors

## Key Metrics to Track

1. **Duplicate Prevention Rate**
   - Track: `fixedCacheKey` blocks per day
   - Goal: < 0.1% of all refill requests

2. **Slow Connection Frequency**
   - Track: 5s threshold exceeded
   - Goal: Understand typical connection speeds

3. **Timeout Rate**
   - Track: 30s timeout reached
   - Goal: < 1% of all refill requests

4. **Average Refresh Time**
   - Track: Time from cache invalidation to completion
   - Goal: < 3 seconds for 95th percentile

## Additional Resources

- [EDGE_CASE_HANDLING.md](./EDGE_CASE_HANDLING.md) - Technical implementation details
- [EDGE_CASE_SCENARIOS.md](./EDGE_CASE_SCENARIOS.md) - Detailed scenario walkthroughs
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [setupListeners API](https://redux-toolkit.js.org/rtk-query/api/setupListeners)
