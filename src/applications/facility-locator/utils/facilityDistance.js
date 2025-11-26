import { toRadians } from 'platform/utilities/facilities-and-mapbox';
import {
  LocationType,
  MAX_SEARCH_AREA,
  MIN_RADIUS,
  MIN_RADIUS_CCP,
  MIN_RADIUS_EXP,
  MIN_RADIUS_NCA,
} from '../constants';

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

export const radiusFromBoundingBox = (
  fbox,
  facilityType = LocationType.HEALTH,
  useProgressiveDisclosure = false,
) => {
  // Calculate full diagonal distance from SW to NE corner of bounding box
  // This ensures the circular search area fully encompasses the rectangular map bounds
  const fullDiagonal = distBetween(
    fbox[0].bbox[1], // SW lat (minLat)
    fbox[0].bbox[0], // SW lng (minLng)
    fbox[0].bbox[3], // NE lat (maxLat)
    fbox[0].bbox[2], // NE lng (maxLng)
  );

  // Cap at MAX_SEARCH_AREA (500 miles) per PPMS API limits
  const radius = Math.min(fullDiagonal, MAX_SEARCH_AREA);

  let radiusToUse = radius;

  if (facilityType === LocationType.CEMETERY) {
    radiusToUse = MIN_RADIUS_NCA;
  } else if (useProgressiveDisclosure && radius < MIN_RADIUS_EXP) {
    radiusToUse = MIN_RADIUS_EXP;
  } else if (
    facilityType === LocationType.CC_PROVIDER &&
    radiusToUse < MIN_RADIUS_CCP
  ) {
    radiusToUse = MIN_RADIUS_CCP;
  } else if (radiusToUse < MIN_RADIUS) {
    radiusToUse = MIN_RADIUS;
  }

  // Ensure radiusToUse doesn't exceed MAX_SEARCH_AREA
  radiusToUse = Math.min(radiusToUse, MAX_SEARCH_AREA);

  return [radius, radiusToUse];
};
