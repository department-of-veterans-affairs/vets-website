function toRadians(value) {
  return (value * Math.PI) / 180;
}

function toDegrees(value) {
  return (value * 180) / Math.PI;
}

export function distanceBetween(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return parseFloat((R * c).toFixed(1));
}

/*
 * Adapted from node-geopoint: https://github.com/davidwood/node-geopoint
 *
 * This will end up creating a 2 * radius by 2 * radius box around the lat
 * long passed in.
 *
 * This is different than the FL bounding box calc, which adds a fixed amount
 * of lat/long degrees to create a box
 */
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

export function getPreciseLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error =>
        reject(new Error(`Geolocation error ${error.code}: ${error.message}`)),
      {
        timeout: 10000,
      },
    );
  });
}

export function vapAddressToString({
  addressLine1,
  addressLine2,
  addressLine3,
  city,
  stateCode,
  zipCode,
  country,
}) {
  return [
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    stateCode,
    zipCode,
    country,
  ]
    .filter(item => !!item)
    .join(',');
}
