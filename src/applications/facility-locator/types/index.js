import PropTypes from 'prop-types';

export const AddressTypes = PropTypes.shape({
  city: PropTypes.string,
  state: PropTypes.string,
  street: PropTypes.string,
  zip: PropTypes.string,
});

export const PhoneTypes = PropTypes.shape({
  afterHours: PropTypes.string,
  enrollmentCoordinator: PropTypes.string,
  fax: PropTypes.string,
  healthConnect: PropTypes.string,
  main: PropTypes.string,
  mentalHealthClinic: PropTypes.string,
  patientAdvocate: PropTypes.string,
  pharmacy: PropTypes.string,
});

export const ResultsTypes = PropTypes.arrayOf(
  PropTypes.shape({
    attributes: PropTypes.shape({
      accNewPatients: PropTypes.string,
      address: AddressTypes,
      caresitePhone: PropTypes.string,
      email: PropTypes.string,
      fax: PropTypes.string,
      gender: PropTypes.string,
      lat: PropTypes.number,
      long: PropTypes.number,
      name: PropTypes.string,
      phone: PhoneTypes,
      posCodes: PropTypes.string,
      prefContact: PropTypes.any,
      trainings: PropTypes.arrayOf(PropTypes.any),
      uniqueId: PropTypes.string,
    }),
    distance: PropTypes.number,
    id: PropTypes.string,
    type: PropTypes.string,
  }),
);

export const PaginationTypes = PropTypes.shape({
  currentPage: PropTypes.number,
  nextPage: PropTypes.number,
  prevPage: PropTypes.number,
  totalPages: PropTypes.number,
});

export const LatLongTypes = PropTypes.shape({
  latitude: PropTypes.number,
  longitude: PropTypes.number,
});

export const LatLongAbbrTypes = PropTypes.shape({
  lat: PropTypes.number,
  lng: PropTypes.number,
});

export const LinksTypes = PropTypes.shape({
  first: PropTypes.string,
  last: PropTypes.string,
  next: PropTypes.string,
  prev: PropTypes.string,
  self: PropTypes.string,
});

export const CurrentQueryTypes = PropTypes.shape({
  bounds: PropTypes.arrayOf(PropTypes.number),
  context: PropTypes.string,
  currentPage: PropTypes.number,
  currentRadius: PropTypes.number,
  data: ResultsTypes,
  error: PropTypes.bool,
  facilityType: PropTypes.string,
  facilityTypeChanged: PropTypes.bool,
  fetchSvcsInProgress: PropTypes.bool,
  geocodeInProgress: PropTypes.bool,
  geocodeResults: PropTypes.arrayOf(PropTypes.any),
  geolocationInProgress: PropTypes.bool,
  id: PropTypes.number,
  inProgress: PropTypes.bool,
  isValid: PropTypes.bool,
  links: LinksTypes,
  locationChanged: PropTypes.bool,
  mapMoved: PropTypes.bool,
  meta: PropTypes.shape({
    pagination: PaginationTypes,
  }),
  position: LatLongTypes,
  radius: PropTypes.number,
  searchArea: PropTypes.any,
  searchBoundsInProgress: PropTypes.bool,
  searchCoords: LatLongAbbrTypes,
  searchStarted: PropTypes.bool,
  searchString: PropTypes.string,
  serviceType: PropTypes.string,
  zoomLevel: PropTypes.number,
});

export const LocationTypes = PropTypes.shape({
  action: PropTypes.string,
  basename: PropTypes.string,
  hash: PropTypes.string,
  key: PropTypes.string,
  pathname: PropTypes.string,
  query: PropTypes.shape({
    address: PropTypes.string,
    bounds: PropTypes.arrayOf(PropTypes.string),
    context: PropTypes.string,
    facilityType: PropTypes.string,
    latitude: PropTypes.string,
    longitude: PropTypes.string,
    page: PropTypes.string,
    radius: PropTypes.string,
    serviceType: PropTypes.string,
    state: PropTypes.any,
  }),
  search: PropTypes.string,
});

export const RouterTypes = PropTypes.shape({
  createHref: PropTypes.func,
  createKey: PropTypes.func,
  createLocation: PropTypes.func,
  createPath: PropTypes.func,
  getCurrentLocation: PropTypes.func,
  go: PropTypes.func,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  isActive: PropTypes.func,
  listen: PropTypes.func,
  listenBefore: PropTypes.func,
  location: LocationTypes,
  params: PropTypes.any,
  push: PropTypes.func,
  replace: PropTypes.func,
  routes: PropTypes.arrayOf(PropTypes.any),
  setRouteLeaveHook: PropTypes.func,
  transitionTo: PropTypes.func,
});

export const FacilitiesMapTypes = {
  clearGeocodeError: PropTypes.func,
  clearSearchResults: PropTypes.func,
  clearSearchText: PropTypes.func,
  currentQuery: CurrentQueryTypes,
  fetchVaFacility: PropTypes.func,
  genBBoxFromAddress: PropTypes.func,
  genSearchAreaFromCenter: PropTypes.func,
  geolocateUser: PropTypes.func,
  location: LocationTypes,
  mapMoved: PropTypes.func,
  pagination: PaginationTypes,
  params: PropTypes.any,
  resultTime: PropTypes.any,
  results: ResultsTypes,
  route: PropTypes.any,
  routeParams: PropTypes.any,
  router: RouterTypes,
  searchError: PropTypes.shape(PropTypes.any),
  searchWithBounds: PropTypes.func,
  selectedResult: PropTypes.any,
  specialties: PropTypes.any,
  suppressPPMS: PropTypes.bool,
  suppressPharmacies: PropTypes.bool,
  updateSearchQuery: PropTypes.func,
  usePredictiveGeolocation: PropTypes.bool,
};

export const SearchControlsTypes = {
  clearGeocodeError: PropTypes.func,
  clearSearchText: PropTypes.func,
  currentQuery: CurrentQueryTypes,
  geolocateUser: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  suppressPPMS: PropTypes.bool,
  suppressPharmacies: PropTypes.bool,
};
