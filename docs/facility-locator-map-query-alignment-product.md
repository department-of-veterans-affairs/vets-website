# Facility Locator Map Query Alignment Issue

## Overview: The Missing Results Problem

When Veterans use the Facility Locator to search for community care providers (like urgent care facilities or pharmacies), they may not see all available providers that are visible within their map view. This happens because the search query uses a circular search area while the map displays a rectangular area, causing providers in the corners of the map to be excluded from search results.

**Status:** Fixed as of [date of implementation]

**Related Issue:** [GitHub Issue #21812](https://github.com/department-of-veterans-affairs/va.gov-cms/issues/21812)

## What Veterans Experience

### Real Example: Green Bay, Wisconsin Area

A Veteran searching for in-network urgent care experienced this issue:

1. **Search from Green Bay, WI**

   - Map displays rectangular area
   - Results show 2 urgent care locations

2. **Zoom out to include Marinette and Peshtigo**

   - Map now shows Green Bay, Marinette, and Peshtigo (all three towns visible)
   - Veteran clicks "Search this area" button
   - Still only sees the original 2 results (or different subset)

3. **Search directly from Marinette**

   - Results show 4 different urgent care locations
   - These locations were NOT in the Green Bay results
   - **But they WERE visible in the zoomed-out Green Bay map area**

4. **Search from Peshtigo**
   - Results show additional locations
   - Again, these were visible in the Green Bay zoomed-out view
   - But they weren't included in that search

**The Problem:** Even though Marinette and Peshtigo are visible on the Green Bay map when zoomed out, the providers in those areas don't appear in the search results because they fall in the corners of the rectangular map display.

## Why This Happens

### Visual Explanation

When you view the Facility Locator map:

```text
What Veterans See (Rectangular Map):
┌─────────────────────────────────┐
│  Marinette                      │
│                                 │
│           Green Bay (center)    │
│                                 │
│                        Peshtigo │
└─────────────────────────────────┘
All three towns are visible
```

But the search query works differently:

```text
What the Search Actually Covers (Circular Area):
        ╭───────────────╮
       ╱                 ╲
┌─────────────────────────────────┐
│ X   │                   │       │
│─────╯                   ╰───────│
│     Green Bay (center)          │
│─────╮                   ╭───────│
│ X   │                   │   X   │
└─────────────────────────────────┘
       ╲                 ╱
        ╰───────────────╯

X = Providers in corners are OUTSIDE the search circle
```

**The corners of the rectangle are farther from the center than the edges**, so providers located in those corner areas (like Marinette and Peshtigo in this example) are excluded from the search even though they're visible on the map.

## The Technical Root Cause (High-Level)

1. **Map Display:** Shows rectangular area with boundaries at top, bottom, left, and right
2. **Search Calculation:** Originally calculated radius as distance from center to the LEFT EDGE only
3. **PPMS Query:** Uses circular search with that radius
4. **Problem:** Distance to corners is about 41% farther than distance to edges (√2 factor)
5. **Result:** Providers in corners fall outside the search circle

### Why It Affects Community Care Providers

- **VA Facilities:** Use the rectangular bounding box for searches ✓
- **Community Care Providers (PPMS):** Use circular radius searches ✗

The PPMS (Provider Profile Management System) backend only processes circular radius queries, not rectangular boundaries, due to the OData query language it uses.

## The Fix

We've updated the radius calculation to measure from the center point to the **corner** of the map (the farthest point) instead of just to the edge. This ensures the entire rectangular map area is covered by the circular search.

### What Changed

**Before:**

- Radius = center to west edge
- Circle didn't reach corners
- Providers in corners were missing

**After:**

- Radius = center to southwest corner (farthest point)
- Circle now covers entire rectangle including all corners
- All providers visible on map are included in results

### Trade-offs

The fix increases the search radius by approximately 41% to ensure corner coverage. This means:

**Pros:**

- ✓ All providers visible in the map area are now included in results
- ✓ Veterans won't miss nearby care options
- ✓ "Search this area" button works as expected

**Cons:**

- ⚠ Search may include a few providers slightly outside the visible map edges (but within the circular search area)
- ⚠ Slightly larger query radius may marginally impact performance

**Decision:** We believe it's better to show a few extra results than to hide providers that Veterans can see on their map. The user experience improvement outweighs the minor increase in search area.

## What This Means for Veterans

After this fix:

- ✓ When you zoom out and click "Search this area," you'll see ALL providers in the displayed map area
- ✓ You won't miss providers that are visible on the map
- ✓ Results will be more consistent with what you expect to see
- ✓ You may occasionally see a result or two that's just outside your visible map area (but very close)

## Related Documentation

- **Technical Details:** See [facility-locator-map-query-alignment-technical.md](./facility-locator-map-query-alignment-technical.md)
- **GitHub Issue:** [#21812 - Facility Locator does not return all results located within displayed map area](https://github.com/department-of-veterans-affairs/va.gov-cms/issues/21812)
- **Application README:** [src/applications/facility-locator/README.md](../src/applications/facility-locator/README.md)

## Questions or Concerns?

If you notice any issues with search results after this fix, please report them through the normal channels with:

- The address or location you searched
- The facility type you were looking for
- A description of what you expected vs. what you saw
