import { clearGeocodeError } from './mapbox/clearGeocodeError';
import { clearSearchResults } from './search/clearSearchResults';
import { clearSearchText } from './search/clearSearchText';
import { fetchLocations } from './locations/fetchLocations';
import { fetchVAFacility } from './locations/fetchVAFacility';
import { genBBoxFromAddress } from './mapbox/genBBoxFromAddress';
import { genSearchAreaFromCenter } from './mapbox/genSearchAreaFromCenter';
import { geolocateUser } from './mapbox/geoLocateUser';
import { getProviderSpecialties } from './locations/getProviderSpecialties';
import { mapMoved } from './mapbox/mapMoved';
import { searchWithBounds } from './search/searchWithBounds';
import { updateSearchQuery } from './search/updateSearchQuery';
import { MOBILE_MAP_PIN_SELECTED } from './actionTypes';

export const selectMobileMapPin = data => {
  return {
    type: MOBILE_MAP_PIN_SELECTED,
    payload: data,
  };
};

export { clearGeocodeError };
export { clearSearchResults };
export { clearSearchText };
export { fetchLocations };
export { fetchVAFacility };
export { genBBoxFromAddress };
export { genSearchAreaFromCenter };
export { geolocateUser };
export { getProviderSpecialties };
export { mapMoved };
export { searchWithBounds };
export { updateSearchQuery };
