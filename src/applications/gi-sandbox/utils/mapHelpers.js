import { MIN_RADIUS } from '../constants';

function toRadians(value) {
  return (value * Math.PI) / 180;
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

/**
 * Recursively convert number to A to AA to AAA to... to ZZZZZZZZZZZ
 * Uses https://en.wikipedia.org/wiki/Base36 to convert numbers to alphanumeric values
 *
 * @param number
 * @returns {string}
 */
export const numberToLetter = number => {
  // handle multiples of 26 when modding
  // since 0 and 26 both have a remainder of 0 need to handle special case
  const numberToConvert = number !== 0 && number % 26 === 0 ? 26 : number % 26;
  const letter = (numberToConvert + 9).toString(36).toUpperCase();

  if (number / 26 > 1) {
    // Use Math.floor as a float returns incorrect letter string
    return `${numberToLetter(Math.floor(number / 26))}${letter}`;
  }
  return letter;
};

const BOUNDING_RADIUS = 0.5;

/**
 * Calculates a bounding box based on the latitude and longitude
 */
export const getBoundingBox = search => {
  const { latitude, longitude } = search.query;
  const { geocode } = search;

  if (latitude === null || longitude === null) return null;

  let boundingBox = [
    longitude - BOUNDING_RADIUS,
    latitude - BOUNDING_RADIUS,
    longitude + BOUNDING_RADIUS,
    latitude + BOUNDING_RADIUS,
  ];

  const { bbox } = geocode[0];
  if (bbox) {
    boundingBox = [
      Math.min(bbox[0], longitude - BOUNDING_RADIUS),
      Math.min(bbox[1], latitude - BOUNDING_RADIUS),
      Math.max(bbox[2], longitude + BOUNDING_RADIUS),
      Math.max(bbox[3], latitude + BOUNDING_RADIUS),
    ];
  }

  // const radius = radiusFromBoundingBox(geocode);

  return boundingBox;
};
