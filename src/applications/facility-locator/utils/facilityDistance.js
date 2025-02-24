import { toRadians } from 'platform/utilities/facilities-and-mapbox';
import { MIN_RADIUS, MIN_RADIUS_CCP, MIN_RADIUS_EXP } from '../constants';

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
  ccp = false,
  useProgressiveDisclosure = false,
) => {
  let radius = distBetween(
    fbox[0].bbox[1],
    fbox[0].bbox[0],
    fbox[0].bbox[3],
    fbox[0].bbox[2],
  );
  if (useProgressiveDisclosure && radius < MIN_RADIUS_EXP) {
    radius = MIN_RADIUS_EXP;
  } else if (ccp && radius < MIN_RADIUS_CCP) {
    radius = MIN_RADIUS_CCP;
  } else if (!ccp && radius < MIN_RADIUS) {
    radius = MIN_RADIUS;
  }

  return radius;
};
