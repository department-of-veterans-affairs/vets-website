# Facility Locator Map Query Alignment - Technical Documentation

## Technical Overview

The Facility Locator application exhibits a bug where PPMS (Provider Profile Management System) queries using circular radius searches fail to return all providers visible within the rectangular map viewport. This occurs because the radius is calculated from the map center to the west edge only, not to the corners which are √2 times farther away.

**Issue:** [GitHub #21812](https://github.com/department-of-veterans-affairs/va.gov-cms/issues/21812)
**Impact:** Community care providers (urgent care, pharmacies, specialists)
**Root Cause:** Working with Rectangular mapbox but circular PPMS search leads to incorrect radius calculation in `sendUpdatedSearchQuery()`

## The Root Cause: Radius Calculation Bug

### Code Location

**File:** `src/applications/facility-locator/actions/mapbox.js`
**Function:** `sendUpdatedSearchQuery()`
**Lines:** 220-222

### Original Buggy Code

```javascript
// Radius is computed as the distance from the center point
// to the western edge of the bounding box
const radius = distBetween(lat, lng, lat, currentBounds[0]);
```

### The Problem

The `currentBounds` array structure is:

```javascript
currentBounds = [
  west_longitude, // currentBounds[0]
  south_latitude, // currentBounds[1]
  east_longitude, // currentBounds[2]
  north_latitude, // currentBounds[3]
];
```

The calculation `distBetween(lat, lng, lat, currentBounds[0])` computes:

- **From:** Center point `(lat, lng)`
- **To:** `(lat, currentBounds[0])` - same latitude, western longitude

This gives the distance from center to the **west edge midpoint** only.

### Why Corners Are Missing (Geometry)

For a rectangle centered at origin with half-width `w` and half-height `h`:

- **Distance to edge:** `w` (horizontal) or `h` (vertical)
- **Distance to corner:** `√(w² + h²)` (Pythagorean theorem)

For a square (where `w = h`):

- **Edge distance:** `w`
- **Corner distance:** `√(w² + w²) = w√2 ≈ 1.414w` (41% farther)

**Example with 10-mile edge distance:**

- Radius to edge: 10 miles
- Radius to corner: 14.14 miles
- **Missing zone:** 10-14.14 mile ring at corners

### Visual Representation

```text
Map Bounds (Rectangle):
         North
    NW ────────── NE
     │            │
West │   Center   │ East
     │     ●      │
    SW ────────── SE
         South

currentBounds = [West_lng, South_lat, East_lng, North_lat]

Original calculation:
  radius = distance(Center → West edge midpoint)

Problem:
  Corner distance = √2 × edge distance
  Providers at NW, NE, SW, SE corners are OUTSIDE the query circle
```

## Code Analysis

### How "Search This Area" Works

**File:** `src/applications/facility-locator/containers/FacilitiesMap.jsx`
**Lines:** 240-270

```javascript
const handleSearchArea = () => {
  const center = map.getCenter().wrap();
  const bounds = map.getBounds();

  const currentMapBoundsDistance = calculateSearchArea();

  props.genSearchAreaFromCenter({
    lat: center.lat,
    lng: center.lng,
    currentMapBoundsDistance,
    currentBounds: [
      bounds._sw.lng, // west
      bounds._sw.lat, // south
      bounds._ne.lng, // east
      bounds._ne.lat, // north
    ],
  });
};
```

This extracts the rectangular bounds from Mapbox and passes them to `genSearchAreaFromCenter()`.

### Query Parameter Flow

**File:** `src/applications/facility-locator/actions/mapbox.js`
**Lines:** 255-281

```javascript
export const genSearchAreaFromCenter = query => {
  const { lat, lng, currentMapBoundsDistance, currentBounds } = query;

  // ... reverse geocode to get address ...

  mbxClient
    .reverseGeocode({
      /* ... */
    })
    .send()
    .then(({ body: { features } }) => {
      sendUpdatedSearchQuery(dispatch, features, lat, lng, currentBounds);
    });
};
```

This calls `sendUpdatedSearchQuery()` which contains the buggy radius calculation.

### Parameter Construction

**File:** `src/applications/facility-locator/config.js`
**Lines:** 111-166

```javascript
const locationParams = [
  address ? `address=${address}` : null,
  ...bounds.map(c => `bbox[]=${c}`), // Sends all 4 bounds values
  center && center.length > 0 ? `latitude=${center[0]}` : null,
  center && center.length > 0 ? `longitude=${center[1]}` : null,
];

// ...

const postParamsObj = {
  // ...
  radius: roundRadius || null, // Sends calculated radius
  ...postLocationParams, // Includes bbox
};
```

**Key Insight:** Both `bbox[]` AND `radius` are sent to the API, but PPMS backend only uses `radius` for community care provider queries.

### Why PPMS Ignores bbox[]

**File:** `src/applications/facility-locator/actions/mapbox.js`
**Lines:** 39-62 (specifically line 54)

```javascript
export const constructBounds = ({
  facilityType,
  longitude,
  latitude,
  expandedRadius,
  useProgressiveDisclosure,
}) => {
  const PPMSTypes = [
    LocationType.CC_PROVIDER,
    LocationType.URGENT_CARE_PHARMACIES,
  ];

  // ... calculate bounding box ...

  // Do not use for PPMS since it does not use the bounding box
  if (facilityType === LocationType.CEMETERY) {
    // ... cemetery-specific bounds ...
  } else if (useProgressiveDisclosure && !PPMSTypes.includes(facilityType)) {
    // ... progressive disclosure bounds ...
  }

  return [
    /* bounding box */
  ];
};
```

**Comment on line 54:** `"Do not use for PPMS since it does not use the bounding box"`

The PPMS backend (vets-api → PPMS) translates the `radius` parameter into an OData circular query:

```odata
$filter=geo.distance(Location, geography'POINT(-88.0 44.5)') le 40
```

The rectangular `bbox[]` parameters are ignored for PPMS queries because the OData geospatial functions work with circular distance, not rectangular boundaries.

## Proposed Fix: Calculate Radius to Corner

### Proposed Code Change

**File:** `src/applications/facility-locator/actions/mapbox.js`
**Lines:** 220-222

**Proposed change:**

```javascript
// Radius is computed as the distance from the center point
// to the southwest corner of the bounding box to ensure the entire
// rectangular map area is covered by the circular search query.
// This prevents missing results in map corners (see GitHub issue #21812)
const radius = distBetween(lat, lng, currentBounds[1], currentBounds[0]);
```

### What Changed

**Before:**

```javascript
distBetween(lat, lng, lat, currentBounds[0]);
//          from      to
//          (lat,lng) (lat, west_lng) = west edge
```

**After:**

```javascript
distBetween(lat, lng, currentBounds[1], currentBounds[0]);
//          from      to
//          (lat,lng) (south_lat, west_lng) = SW corner
```

### Why This Works

By calculating to the SW corner (or any corner - they're equidistant), we get the maximum distance from center to any point on the rectangle. The circular query with this radius will fully encompass the entire rectangular map area.

**Mathematical proof:**

- Let corner distance = `d_corner = √(Δlat² + Δlng²)`
- Circle with radius `d_corner` will contain all points where:
  - `distance_from_center ≤ d_corner`
- All rectangle points satisfy:
  - `|Δlat| ≤ (north - south) / 2`
  - `|Δlng| ≤ (east - west) / 2`
- Therefore: `distance ≤ √((north-south)²/4 + (east-west)²/4) = d_corner`

All rectangle points are within the circle.

## Implementation Details

### Distance Calculation Function

**File:** `src/applications/facility-locator/utils/facilityDistance.js`
**Lines:** 10-24

```javascript
export function distBetween(lat1, lng1, lat2, lng2) {
  const R = 3959; // radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
```

This implements the Haversine formula for calculating great-circle distances between two points on a sphere (Earth).

### Minimum Radius Enforcement

**File:** `src/applications/facility-locator/constants/index.js`
**Lines:** 203-206

```javascript
export const MIN_RADIUS = 10;
export const MIN_RADIUS_CCP = 40;
export const MIN_RADIUS_EXP = 49;
export const MIN_RADIUS_NCA = 133;
```

**File:** `src/applications/facility-locator/utils/facilityDistance.js`
**Lines:** 45-49

```javascript
else if (
  facilityType === LocationType.CC_PROVIDER &&
  radiusToUse < MIN_RADIUS_CCP
) {
  radiusToUse = MIN_RADIUS_CCP;
}
```

Community care providers have a 40-mile minimum radius. The proposed fix would ensure the calculated corner radius is used (likely > 40 miles in most zoomed-out views), but if zoomed in very close, the 40-mile minimum would still apply.

## Trade-offs and Considerations

### Pros

- ✅ Would eliminate missing results in map corners
- ✅ All providers visible in rectangular map area would be returned
- ✅ Simple one-line fix with no backend changes required
- ✅ Maintains backward compatibility with existing API

### Cons

- ⚠️ Search radius increases by ~41% (√2 factor)
- ⚠️ May return providers slightly outside visible map edges (but inside circle)
- ⚠️ Slightly larger result set may marginally impact performance
- ⚠️ Circle still doesn't perfectly match rectangle (geometric impossibility)

### Illustration of Trade-off

**BEFORE FIX:**

Map Display:

- Rectangular map viewport (typically taller than it is wide when zoomed out)
- Center point coordinates used for search

Search Query:

- Radius: distance from center to west edge only
- Circle extends equally in all directions from center
- Circle touches the west and east edges
- Circle does NOT reach north and south edges (they're farther from center)
- Top and bottom portions of map: MISSING from results
- All four corners: MISSING from results (corners are farthest from center)

Result: Providers in the north and south areas (like Marinette and Peshtigo in the Green Bay example) are excluded even though they're visible on the map.

**WITH PROPOSED FIX:**

Search Query:

- Radius: distance from center to corner (calculated as √(half-width² + half-height²))
- Circle extends to reach all four corners of the rectangle
- Circle would include all areas visible on the map
- Circle extends beyond the west and east edges
- Circle may extend slightly beyond north and south edges

Expected Result: All providers visible in the map area would be included in results. Some additional providers slightly outside the visible edges may also appear (acceptable trade-off).

**Net Effect:** Search area increases by approximately 2× (area of circumscribed circle vs inscribed circle), but would ensure no visible providers are missed.

### Performance Impact

**Query Size Increase:**

- Area of circle to edge: `π × r²`
- Area of circle to corner: `π × (r√2)² = π × 2r² = 2πr²`
- **Increase:** 2× area, but actual provider density varies by location

**Real-world Impact:**

- PPMS backend handles pagination (15 results per page)
- Most searches return < 15 providers anyway
- Additional filtering on frontend by distance sorting
- Marginal performance impact considered acceptable

## Alternative Solutions Considered

### Option 1: Use Rectangular Queries (Not Chosen)

**Approach:** Modify vets-api to use rectangular bounding box for PPMS queries

**OData Query:**

```odata
$filter=Latitude ge 44.0 and Latitude le 45.0
        and Longitude ge -89.0 and Longitude le -87.0
```

**Pros:**

- ✅ Perfect alignment with map display
- ✅ No extra results outside map bounds

**Cons:**

- ❌ Requires backend changes in vets-api (Ruby)
- ❌ PPMS OData performance with rectangular queries unknown
- ❌ More complex coordinate boundary handling
- ❌ Would need to update both frontend and backend

**Decision:** Rejected due to complexity and backend dependency

### Option 2: Hybrid Radius (Not Chosen)

**Approach:** Calculate radius based on rectangle aspect ratio

```javascript
const width = distBetween(lat, currentBounds[0], lat, currentBounds[2]);
const height = distBetween(currentBounds[1], lng, currentBounds[3], lng);
const radius = Math.sqrt(width * width + height * height) / 2;
```

**Pros:**

- ✅ Mathematically precise
- ✅ Accounts for aspect ratio

**Cons:**

- ⚠️ More complex calculation
- ⚠️ Essentially equivalent to corner distance
- ⚠️ No significant advantage over simpler corner approach

**Decision:** Rejected in favor of simpler corner calculation

### Option 3: Calculate to Corner (Chosen)

**Approach:** Calculate radius from center to any corner

**Pros:**

- ✅ Simple one-line change
- ✅ Ensures complete coverage
- ✅ Easy to understand and maintain
- ✅ No backend changes required

**Cons:**

- ⚠️ 41% larger search area

**Decision:** **Chosen** - Best balance of simplicity, effectiveness, and maintainability

## Testing Recommendations

### Unit Tests

Test `sendUpdatedSearchQuery()` with various bounding boxes:

```javascript
// Test square bounds
const squareBounds = [-88.1, 44.4, -87.9, 44.6];
// Expected: radius ≈ distance to corner = √((0.2²)+(0.2²)) = 0.283°

// Test wide rectangle
const wideBounds = [-89.0, 44.5, -87.0, 44.7];
// Expected: radius ≈ √((2.0²)+(0.2²)) = 2.01°

// Test tall rectangle
const tallBounds = [-88.1, 43.0, -87.9, 45.0];
// Expected: radius ≈ √((0.2²)+(2.0²)) = 2.01°
```

### Integration Tests

Replicate the Green Bay scenario from GitHub issue #21812:

1. Search "Green Bay, WI" for urgent care
2. Zoom out to include Marinette and Peshtigo
3. Click "Search this area"
4. Verify results would include providers from all three locations with the fix
5. Verify no providers visible on map would be excluded from results

### Visual Regression Tests

Compare search result counts before and after fix for various locations and zoom levels.

## Related Code References

### Key Files

- **`src/applications/facility-locator/actions/mapbox.js`**

  - Line 32-71: `constructBounds()` - shows PPMS types don't use bounding box
  - Line 210-249: `sendUpdatedSearchQuery()` - contains the bug (line 220-222)
  - Line 255-281: `genSearchAreaFromCenter()` - triggers radius calculation

- **`src/applications/facility-locator/config.js`**

  - Line 35-166: `resolveParamsWithUrl()` - builds API parameters
  - Line 111-116: Constructs `bbox[]` parameters
  - Line 144: Adds `radius` to query params

- **`src/applications/facility-locator/utils/facilityDistance.js`**

  - Line 10-24: `distBetween()` - Haversine distance calculation
  - Line 26-55: `radiusFromBoundingBox()` - applies minimum radius constraints

- **`src/applications/facility-locator/containers/FacilitiesMap.jsx`**

  - Line 240-270: `handleSearchArea()` - "Search this area" button handler
  - Line 230-238: `calculateSearchArea()` - computes diagonal distance

- **`src/applications/facility-locator/constants/index.js`**
  - Line 203-206: Minimum radius constants including `MIN_RADIUS_CCP = 40`

### Data Flow Diagram

```text
User clicks "Search this area"
         ↓
FacilitiesMap.handleSearchArea()
  - Gets map center and bounds
         ↓
genSearchAreaFromCenter(lat, lng, currentBounds)
  - Reverse geocode for address
         ↓
sendUpdatedSearchQuery(dispatch, features, lat, lng, currentBounds)
  - Calculate radius = distBetween(center, SW corner)  ← PROPOSED FIX
  - Dispatch SEARCH_QUERY_UPDATED
         ↓
searchWithBounds({ bounds, center, radius, ... })
         ↓
LocatorApi.searchWithBounds()
  - resolveParamsWithUrl() builds parameters
    - bbox[] (sent but ignored by PPMS)
    - radius (used by PPMS)
    - latitude, longitude
    - specialties[]
         ↓
vets-api /facilities_api/v2/ccp/provider
         ↓
PPMS OData Query:
  $filter=geo.distance(Location, geography'POINT(lng lat)') le radius
         ↓
Results returned to frontend
```

## Related Documentation

- **Product Documentation:** [facility-locator-map-query-alignment-product.md](./facility-locator-map-query-alignment-product.md)
- **GitHub Issue:** [#21812 - Facility Locator does not return all results](https://github.com/department-of-veterans-affairs/va.gov-cms/issues/21812)
- **Application README:** [src/applications/facility-locator/README.md](../src/applications/facility-locator/README.md)
- **Haversine Formula:** [Wikipedia - Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula)
- **OData Geospatial Functions:** [OData Geo Functions](http://docs.oasis-open.org/odata/odata/v4.0/errata03/os/complete/part2-url-conventions/odata-v4.0-errata03-os-part2-url-conventions-complete.html#_Toc453752358)
