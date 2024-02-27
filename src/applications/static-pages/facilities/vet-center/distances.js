export const getCenterDistance = (nearbyDistances, facility) => {
  const facilityDistance = nearbyDistances.find(
    distance => distance.id === facility.id,
  );
  return facilityDistance.distance;
};
