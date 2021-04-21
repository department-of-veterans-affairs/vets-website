import { useQuery, useQueryClient } from 'react-query';
import { getLocations } from '../services/location';

export default function useFacilitiesQuery(facilityIdOrArray = []) {
  const queryClient = useQueryClient();
  const facilityIds = Array.isArray(facilityIdOrArray)
    ? facilityIdOrArray
    : [facilityIdOrArray];
  const currentFacilities = queryClient.getQueryData('facilities') || {};

  const missingFacilities = facilityIds.filter(
    id => id && !currentFacilities[id],
  );
  const { data: facilityData, status } = useQuery(
    ['facilitiesQuery', ...missingFacilities],
    () => getLocations({ facilityIds: missingFacilities }),
    {
      enabled: missingFacilities?.length > 0,
      select: facilities =>
        facilities.reduce(
          (acc, cur) => ({ ...acc, [cur.id]: cur }),
          currentFacilities,
        ),
    },
  );

  if (facilityData) {
    queryClient.setQueryData('facilities', facilityData);
  }

  return { facilityData: facilityData || currentFacilities, status };
}
