import { MIN_RADIUS } from '../constants';

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function toDegrees(value) {
  return (value * 180) / Math.PI;
}

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

export const radiusFromBoundingBox = fbox => {
  let radius = distBetween(
    fbox[0].bbox[1],
    fbox[0].bbox[0],
    fbox[0].bbox[3],
    fbox[0].bbox[2],
  );

  if (radius < MIN_RADIUS) radius = MIN_RADIUS;

  return Math.max(radius, MIN_RADIUS);
};

// Copied from src/applications/vaos/utils/address.js
export function calculateBoundingBox(lat, long, radius) {
  const earthRadius = 3959;
  const radDist = radius / earthRadius;
  const radLat = toRadians(lat);
  const radLong = toRadians(long);
  // The space between lines of longitude differs depending on where you are
  // on Earth, this takes that into account
  const deltaLongitude = Math.asin(Math.sin(radDist) / Math.cos(radLat));
  const minLongitude = radLong - deltaLongitude;
  const maxLongitude = radLong + deltaLongitude;
  const minLatitude = radLat - radDist;
  const maxLatitude = radLat + radDist;

  return [
    toDegrees(minLatitude).toFixed(3),
    toDegrees(minLongitude).toFixed(3),
    toDegrees(maxLatitude).toFixed(3),
    toDegrees(maxLongitude).toFixed(3),
  ];
}
