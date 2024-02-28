export const getCenterDistance = (nearbyDistances, facility) => {
  if (!nearbyDistances.length) return null;
  const facilityDistance = nearbyDistances.find(
    distance => distance.id === facility.id,
  );
  return facilityDistance.distance;
};
