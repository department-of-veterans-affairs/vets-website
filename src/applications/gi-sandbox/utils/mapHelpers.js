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

const BOUNDING_RADIUS = 0.5;
/**
 * Calculates a bounding box (±BOUNDING_RADIUS°) centering on the current
 * address string as typed by the user.
 *
 * @param features object from MapBox call
 * @return {{searchCoords: {lng: *, lat: *}, zoomLevel: number, context: *, bounds: (number|*)[], id: number, position: {latitude: *, longitude: *}, searchArea: null, radius: number, results: [], mapBoxQuery: {placeType: *, placeName: *}}} */
export const genBBoxFromGeocode = features => {
  const zip = features[0].context.find(v => v.id.includes('postcode')) || {};
  const coordinates = features[0].center;
  const latitude = coordinates[1];
  const longitude = coordinates[0];
  const zipCode = zip.text || features[0].place_name;
  const featureBox = features[0].box;

  let minBounds = [
    longitude - BOUNDING_RADIUS,
    latitude - BOUNDING_RADIUS,
    longitude + BOUNDING_RADIUS,
    latitude + BOUNDING_RADIUS,
  ];

  if (featureBox) {
    minBounds = [
      Math.min(featureBox[0], longitude - BOUNDING_RADIUS),
      Math.min(featureBox[1], latitude - BOUNDING_RADIUS),
      Math.max(featureBox[2], longitude + BOUNDING_RADIUS),
      Math.max(featureBox[3], latitude + BOUNDING_RADIUS),
    ];
  }

  const radius = radiusFromBoundingBox(features);

  return {
    radius,
    context: zipCode,
    id: Date.now(),
    position: {
      latitude,
      longitude,
    },
    searchCoords: {
      lat: features[0].geometry.coordinates[1],
      lng: features[0].geometry.coordinates[0],
    },
    bounds: minBounds,
    zoomLevel: features[0].id.split('.')[0] === 'region' ? 7 : 9,
    mapBoxQuery: {
      placeName: features[0].place_name,
      placeType: features[0].place_type[0],
    },
    searchArea: null,
    results: [],
  };
};
