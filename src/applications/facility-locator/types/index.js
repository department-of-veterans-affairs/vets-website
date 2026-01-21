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
  totalEntries: PropTypes.number,
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

export const LocationForHoursTypes = PropTypes.shape({
  attributes: {
    access: {
      effectiveDate: PropTypes.string,
      health: PropTypes.arrayOf(PropTypes.string),
    },
    address: {
      mailing: {
        address1: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        zip: PropTypes.string,
      },
      physical: {
        address1: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        zip: PropTypes.string,
      },
      classification: PropTypes.string,
      distance: PropTypes.any,
      facilityType: PropTypes.string,
      feedback: PropTypes.arrayOf(PropTypes.string),
      hours: {
        sunday: PropTypes.string,
        monday: PropTypes.string,
        tuesday: PropTypes.string,
        wednesday: PropTypes.string,
        thursday: PropTypes.string,
        friday: PropTypes.string,
        saturday: PropTypes.string,
      },
      id: PropTypes.string,
      LatLongAbbrTypes,
      mobile: PropTypes.any,
      name: PropTypes.string,
      operatingStatus: {
        code: PropTypes.string,
      },
      operationalHoursSpecialInstructions: PropTypes.string,
      phone: {
        fax: PropTypes.string,
        main: PropTypes.string,
      },
      services: PropTypes.arrayOf(PropTypes.string),
      tmpCovidOnlineScheduling: PropTypes.any,
      uniqueId: PropTypes.string,
      visn: PropTypes.string,
      website: PropTypes.string,
    },
    id: PropTypes.string,
    type: PropTypes.string,
  },
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
  clearSearchResults: PropTypes.func,
  currentQuery: CurrentQueryTypes,
  facilityLocatorMobileMapUpdate: PropTypes.bool,
  fetchVaFacility: PropTypes.func,
  genBBoxFromAddress: PropTypes.func,
  genSearchAreaFromCenter: PropTypes.func,
  location: LocationTypes,
  mapMoved: PropTypes.func,
  pagination: PaginationTypes,
  params: PropTypes.any,
  resultTime: PropTypes.any,
  results: ResultsTypes,
  route: PropTypes.any,
  routeParams: PropTypes.any,
  router: RouterTypes,
  searchError: PropTypes.string,
  searchWithBounds: PropTypes.func,
  selectedResult: PropTypes.any,
  specialties: PropTypes.any,
  suppressPPMS: PropTypes.bool,
  updateSearchQuery: PropTypes.func,
  usePredictiveGeolocation: PropTypes.bool,
  vaHealthServicesData: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.array),
  }),
};

export const FormValuesTypes = PropTypes.shape({
  facilityType: PropTypes.string,
  serviceType: PropTypes.string,
  searchString: PropTypes.string,
  vamcServiceDisplay: PropTypes.string,
});

export const SearchFormTypes = {
  clearGeocodeError: PropTypes.func,
  clearSearchText: PropTypes.func,
  currentQuery: CurrentQueryTypes,
  geolocateUser: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  searchInitiated: PropTypes.bool,
  selectMobileMapPin: PropTypes.func,
  setSearchInitiated: PropTypes.func,
  suppressPPMS: PropTypes.bool,
  vaHealthServicesData: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.array),
  }),
  vamcServiceDisplay: PropTypes.string,
};

export const ServiceTypeInputTypes = {
  committedVamcServiceDisplay: PropTypes.string,
  currentQuery: CurrentQueryTypes,
  getProviderSpecialties: PropTypes.func,
  handleServiceTypeChange: PropTypes.func,
  isMobile: PropTypes.bool,
  isSmallDesktop: PropTypes.bool,
  isTablet: PropTypes.bool,
  onVamcDraftChange: PropTypes.func,
  results: ResultsTypes,
  searchInitiated: PropTypes.bool,
  selectedServiceType: PropTypes.string,
  setSearchInitiated: PropTypes.func,
  useProgressiveDisclosure: PropTypes.bool,
  vamcAutoSuggestEnabled: PropTypes.bool,
};

/**
 * AutosuggesOptionComponent: default uses the AutosuggestOption component in this directory but you can supply another
 * inputValue: controlled component
 * keepDataOnBlur: optional flag to clear the input on escape
 * downshiftInputProps: props to pass to the input from downshift's getInputProps
 * inputError: optional element to render an error message
 * inputId: defaults to 'typeahead-input'
 * inputRef: not required, use only if you programmatically need to focus the input or get something from it
 * isLoading: data is loading - to be shown in place of no results if no results is to be shown
 * labelSibling: optional element to render next to the label
 * noItemsMessage: message to show when no items are found (an error)
 * showDownCaret: optional flag to show the down caret/arrow
 * showError: optional flag to show the error state
 * stateReducer: optional function to modify the state of Downshift - e.g. handle escape to not clear
 * shouldShowNoResults: optional to hide show no results under input - shown with aria error role
 */
export const AutosuggestProps = {
  AutosuggestOptionComponent: PropTypes.elementType,
  clearOnEscape: PropTypes.bool,
  downshiftInputProps: PropTypes.object,
  handleOnSelect: PropTypes.func.isRequired,
  initialSelectedItem: PropTypes.object,
  inputContainerClassName: PropTypes.string,
  inputError: PropTypes.element,
  inputId: PropTypes.string,
  inputRef: PropTypes.object,
  isItemDisabled: PropTypes.func,
  isLoading: PropTypes.bool,
  inputValue: PropTypes.string.isRequired,
  itemToString: PropTypes.func,
  keepDataOnBlur: PropTypes.bool,
  label: PropTypes.element.isRequired,
  labelSibling: PropTypes.element,
  loadingMessage: PropTypes.string,
  noItemsMessage: PropTypes.string,
  onClearClick: PropTypes.func.isRequired,
  onInputValueChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  shouldShowNoResults: PropTypes.bool,
  showDownCaret: PropTypes.bool,
  showError: PropTypes.bool,
  stateReducer: PropTypes.func,
  useProgressiveDisclosure: PropTypes.bool,
};

export const SearchAreaControlTypes = {
  handleSearchArea: PropTypes.func.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  mobileMapUpdateEnabled: PropTypes.bool.isRequired,
  query: PropTypes.shape({
    currentRadius: PropTypes.number,
  }),
  selectMobileMapPin: PropTypes.func,
};
