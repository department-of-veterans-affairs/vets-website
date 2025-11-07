# Facility Locator Bounding Box Search Issue - Analysis and Solutions

**Issue**: [#21812](https://github.com/department-of-veterans-affairs/va.gov-cms/issues/21812)
**Date**: November 2025

## Problem Summary

The Facility Locator does not return all results located within the displayed map area. When users search for CCP facilities, pan the map, and click "Search this area," the results don't match the visible bounds. Different searches in nearby locations return non-overlapping results even when their map views overlap.

### User Impact

- Veterans cannot find all available facilities in their visible map area
- Zooming out doesn't expand results as expected
- Adjacent searches (Green Bay, Marinette, Peshtigo) return different, non-overlapping results
- "Search this area" button doesn't actually search the displayed area

## Root Cause Analysis

The issue stems from an architectural mismatch between three layers:

### 1. Frontend (vets-website)

- **Displays**: Rectangular bounding box on map
- **Sends**: `bbox[]` array + `lat/long/radius` parameters
- **User expectation**: Search within visible rectangle

### 2. Backend API (vets-api)

- **CCP Controller** (`facilities_api/v2/ccp_controller.rb`)
  - Only accepts `lat`, `long`, `radius` parameters
  - **Ignores** `bbox[]` parameter completely (not in permitted params)
- **VA Facilities Controller** properly accepts `bbox` for VA facilities

### 3. PPMS API (Provider Profile Management System)

- **Only supports**: Center point + radius (circular search)
- **Does not support**: Bounding box queries

### The Problem

```
┌─────────────────────────────────┐
│   What User Sees (Rectangle)    │
│                                  │
│         ╔═══════════╗           │
│         ║           ║           │
│         ║  Visible  ║           │
│         ║   Area    ║           │
│         ╚═══════════╝           │
│                                  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  What Actually Gets Searched     │
│                                  │
│            ████████              │
│          ██        ██            │
│         █   Circle  █           │
│          ██        ██            │
│            ████████              │
│                                  │
└─────────────────────────────────┘
```

**Current radius calculation** (in `mapbox.js` line 222):

```javascript
const radius = distBetween(lat, lng, lat, currentBounds[0]);
```

This calculates the distance from center to the **western edge**, which doesn't cover the full rectangular area, especially the corners.

## Key Code Locations

### Frontend (vets-website)

- `src/applications/facility-locator/actions/mapbox.js`
  - Line 222: Current radius calculation
  - Line 255: `genSearchAreaFromCenter` function
- `src/applications/facility-locator/config.js`
  - Lines 111-116: Parameter building for API calls
- `src/applications/facility-locator/containers/FacilitiesMap.jsx`
  - Line 259: Call to `genSearchAreaFromCenter`

### Backend (vets-api)

- `modules/facilities_api/app/controllers/facilities_api/v2/ccp_controller.rb`
  - Lines 48-74: Parameter whitelisting (bbox not included)
- `modules/facilities_api/app/services/facilities_api/v2/ppms/client.rb`
  - Lines 97-131: PPMS API call construction (only uses lat/long/radius)

## Proposed Solutions

### Option 1: Frontend Fix - Calculate Diagonal Radius ⭐

**Status**: 🚀 Quick win, if it works

**Approach**: Calculate radius as the diagonal distance from center to the farthest corner of the bounding box, ensuring the circular search area encompasses the entire rectangular map view.

**Changes**:

- `actions/mapbox.js` line 222

**Before**:

```javascript
const radius = distBetween(lat, lng, lat, currentBounds[0]);
```

**After**:

```javascript
// Calculate diagonal distance to farthest corner to ensure full bbox coverage
const radius = distBetween(lat, lng, currentBounds[1], currentBounds[0]);
```

**Pros**:

- ✅ No API changes required
- ✅ Fastest to implement (days)
- ✅ Immediate improvement for users
- ✅ Ensures all locations in visible area are included

**Cons**:

- ⚠️ Still uses circular search (not true rectangular)
- ⚠️ May return ~30% more results than visible area (outside corners)
- ⚠️ Slight performance impact from larger radius

---

### Option 2: Backend Fix - Accept bbox and Calculate Optimal Radius

**Status**: 🔄 Future enhancement, if Option 4 is not pursued

**Approach**: Modify vets-api to accept bbox parameter for community care searches and calculate the optimal radius server-side.

**Changes Required**:

1. Update `ccp_controller.rb` to accept `bbox` in permitted params
2. Add helper method to calculate radius from bbox
3. Override frontend radius with backend-calculated value

```ruby
# Add to ccp_controller.rb
def ppms_action_params
  params.permit(
    :lat, :latitude, :long, :longitude,
    :page, :per_page, :radius,
    bbox: [],  # Add this
    specialties: []
  )
end

private

def calculate_radius_from_bbox(bbox, center_lat, center_lng)
  # Calculate distance to farthest corner
  corners = [
    [bbox[1], bbox[0]], # SW
    [bbox[3], bbox[0]], # NW
    [bbox[3], bbox[2]], # NE
    [bbox[1], bbox[2]]  # SE
  ]
  corners.map { |lat, lng|
    Geocoder::Calculations.distance_between([center_lat, center_lng], [lat, lng])
  }.max
end
```

**Pros**:

- ✅ Centralizes logic in backend
- ✅ Can optimize radius calculation
- ✅ Can add caching layer
- ✅ Can track metrics

**Cons**:

- ⚠️ Requires backend changes
- ⚠️ Still not true bounding box search
- ⚠️ Longer implementation timeline

---

### Option 3: Multiple PPMS Calls with Grid Coverage

**Status**: 📋 Considered but not recommended

**Approach**: Divide bounding box into a grid of overlapping circles, make multiple PPMS API calls, deduplicate results.

**Pros**:

- ✅ True bounding box coverage
- ✅ Most accurate results

**Cons**:

- ❌ Multiple API calls (performance impact)
- ❌ Complex deduplication logic
- ❌ Increased load on PPMS
- ❌ Race conditions and error handling complexity

**Recommendation**: Not worth the complexity given diminishing returns.

---

### Option 4: Request PPMS API Enhancement - Add Bounding Box Support 🎯

**Status**: 📝 Recommended for long-term solution

**Approach**: Work with PPMS team to add native bounding box support to their API.

**PPMS API Change Request**:

```
New endpoint parameter: bbox=[minLng,minLat,maxLng,maxLat]
Returns: Only providers within rectangular bounding box
Backward compatible: Keep existing lat/long/radius support
```

**PPMS API Contact**:

- Documentation: https://dev.dws.ppms.va.gov/swagger
- Portal: https://vaww.oed.portal.va.gov/pm/iehr/vista_evolution/RA/CCP_PPMS/PPMS_DWS/

**Pros**:

- ✅ Proper architectural solution
- ✅ Most accurate and performant
- ✅ Benefits all consumers of PPMS API

**Cons**:

- ⏰ Requires external team coordination
- ⏰ Longer timeline (months)
- ⚠️ Depends on PPMS team priorities

---

### Option 5: Hybrid Approach (Likely most realistic approach)

**Phase 1** (Immediate - Days):

- Implement Option 1 (frontend radius fix)
- Add visual indicator of search area
- Update messaging to clarify search behavior

**Phase 2** (Short-term - Weeks): (Can be skipped depending on priorities)

- Implement Option 2 (backend bbox acceptance)
- Add caching for repeated searches
- Track bbox accuracy metrics

**Phase 3** (Long-term - Months):

- Work with PPMS team on Option 4
- Migrate to native bbox support
- Remove radius workarounds

## Implementation Details (Option 1)

### Code Changes

**File**: `src/applications/facility-locator/actions/mapbox.js`

**Function**: `sendUpdatedSearchQuery` (line ~210-248)

**Change**: Line 222

```javascript
// OLD: Distance to western edge (insufficient coverage)
const radius = distBetween(lat, lng, lat, currentBounds[0]);

// NEW: Distance to southwestern corner (full coverage)
// currentBounds format: [minLng, minLat, maxLng, maxLat]
const radius = distBetween(lat, lng, currentBounds[1], currentBounds[0]);
```

### Why Diagonal Distance?

Given a bounding box with bounds `[minLng, minLat, maxLng, maxLat]`:

- Center point: `(lat, lng)`
- Corners:
  - SW: `(minLat, minLng)` ← Used for diagonal calculation
  - SE: `(minLat, maxLng)`
  - NW: `(maxLat, minLng)`
  - NE: `(maxLat, maxLng)`

Distance from center to corner ≈ `sqrt(2)` × distance to edge ≈ 1.414× edge distance

This ensures the circular search radius covers all corners of the rectangle.

### Testing Scenarios

#### Scenario 1: Green Bay, WI (from original issue)

- **Before**: Returns 2 locations
- **After**: Returns all locations within visible map bounds
- **Test**: Zoom out should increase results

#### Scenario 2: Adjacent Searches

- Search in Green Bay → get results A
- Search in Marinette → get results B
- Zoom out to show both → should get results A + B + any between

#### Scenario 3: "Search this area" button

- Pan and zoom map
- Click "Search this area"
- All markers visible on map should be in results

### Test Updates

**File**: `src/applications/facility-locator/tests/actions/mapbox.unit.spec.jsx`

Added test case for diagonal radius calculation to ensure full bbox coverage.

## Metrics to Track

After implementation, track these metrics:

1. **Result Count Changes**

   - Average results per search (before vs after)
   - % increase in result count

2. **User Behavior**

   - "Search this area" click rate
   - Zoom out frequency after search
   - Pagination usage

3. **Performance**

   - API response time with larger radius
   - PPMS API load increase

4. **Coverage Accuracy**
   - % of searches where all visible locations are in results
   - User feedback on result completeness

## Rollback Plan

If issues arise:

1. **Immediate Rollback**: Revert the one-line change in `mapbox.js`
2. **Feature Flag**: Consider adding feature flag for gradual rollout
3. **Monitoring**: Watch for:
   - Increased API timeouts
   - User complaints about too many results
   - Performance degradation

## Future Considerations

### 1. Visual Indicators

Add a circle overlay showing actual search radius vs rectangular map bounds to set user expectations.

### 2. Smart Radius Limiting

Cap maximum radius to prevent excessive results:

```javascript
const calculatedRadius = distBetween(
  lat,
  lng,
  currentBounds[1],
  currentBounds[0],
);
const radius = Math.min(calculatedRadius, MAX_SEARCH_RADIUS);
```

### 3. Result Filtering

Filter results client-side to only show those truly within bbox (remove corner spillover).

### 4. Progressive Loading

For large radius searches, implement pagination or incremental loading.

## References

- **Issue**: https://github.com/department-of-veterans-affairs/va.gov-cms/issues/21812
- **PPMS API Docs**: https://dev.dws.ppms.va.gov/swagger
- **PPMS Portal**: https://vaww.oed.portal.va.gov/pm/iehr/vista_evolution/RA/CCP_PPMS/PPMS_DWS/
- **VA Facilities API**: https://developer.va.gov/explore/api/va-facilities/docs

## Questions for Product/Stakeholders

1. Is it acceptable to return ~30% more results (outside visible corners) as a tradeoff for complete coverage?
2. Should we add visual indicator of actual circular search area?
3. What is acceptable performance degradation for improved accuracy?
4. Should we pursue PPMS API enhancement (Option 4) in parallel?
5. Do we want feature flag for gradual rollout?

---

**Last Updated**: November 7, 2025
**Author**: bryan-thompsoncodes
