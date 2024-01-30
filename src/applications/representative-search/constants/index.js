/**
 * Enum for the type attribute of a Representative search result
 */
export const RepresentativeType = {
  NONE: '',
  VETERAN_SERVICE_OFFICER: 'veteran_service_officer',
  ATTORNEY: 'attorney',
  CLAIM_AGENTS: 'claim_agents',
};

export const ErrorTypes = {
  representativeFetchError: 'isErrorFetchRepresentatives',
  reportSubmissionError: 'isErrorReportSubmission',
  geocodeError: 'isErrorGeocode',
};

/**
 * Enum for map pins.
 * Location types mapped to the filename prefix for the png/svg.
 */
export const PinNames = {
  [RepresentativeType.VETERAN_SERVICE_OFFICER]: 'veteran_service_officer',
  [RepresentativeType.ATTORNEY]: 'attorney',
  [RepresentativeType.CLAIM_AGENTS]: 'claim_agents',
};

/**
 * Defines the ± change in bounding box size for the map when changing zoom
 */
export const BOUNDING_RADIUS = 0.75;
export const EXPANDED_BOUNDING_RADIUS = 1.4;

/**
 *Defines the marker letter list
 */
export const MARKER_LETTERS = new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));

/**
 * Enum for operating status.
 */
export const OperatingStatus = {
  NORMAL: 'NORMAL',
  LIMITED: 'LIMITED',
  CLOSED: 'CLOSED',
  NOTICE: 'NOTICE',
};

/**
 * Error Messages
 */
export const Error = {
  DEFAULT: `Something went wrong on our end. Please refresh this page or try again later.`,
  LOCATION:
    'Something is not quite right. Please enter a valid or different location and try your search again.',
};

/**
 * Mapbox init values
 */
export const MapboxInit = {
  zoomInit: 3,
  centerInit: {
    lng: -99.27246093750001,
    lat: 40.17887331434698,
  },
};

/**
 * Mapbox api request countries
 */

export const CountriesList = ['us', 'pr', 'ph', 'gu', 'as', 'mp'];

/**
 * Mapbox api request types
 */

export const MAPBOX_QUERY_TYPES = ['place', 'region', 'postcode', 'locality'];

/**
 * Max search area in miles
 */
export const MAX_SEARCH_AREA = 500;

/**
 * Min radius search area in miles
 */
export const MIN_RADIUS = 10;
