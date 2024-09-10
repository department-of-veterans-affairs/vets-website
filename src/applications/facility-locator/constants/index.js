/**
 * Enum for the type attribute of a Facility/Provider search result
 */
export const LocationType = {
  NONE: '',
  VA_FACILITIES: 'va_facilities',
  CC_PROVIDER: 'provider',
  // Subtypes of VA_FACILITIES
  HEALTH: 'health',
  BENEFITS: 'benefits',
  CEMETERY: 'cemetery',
  VET_CENTER: 'vet_center',
  URGENT_CARE: 'urgent_care',
  URGENT_CARE_PHARMACIES: 'pharmacy',
  EMERGENCY_CARE: 'emergency_care',
};

/**
 * Enum for the various Facility Types (inside the `attributes` object of a result)
 */
export const FacilityType = {
  VA_HEALTH_FACILITY: 'va_health_facility',
  VA_CEMETERY: 'va_cemetery',
  VA_BENEFITS_FACILITY: 'va_benefits_facility',
  VET_CENTER: 'vet_center',
  URGENT_CARE: 'urgent_care',
  URGENT_CARE_PHARMACIES: 'pharmacy',
  EMERGENCY_CARE: 'emergency_care',
};

/**
 * Enum for map pins.
 * Location types mapped to the filename prefix for the png/svg.
 */
export const PinNames = {
  [FacilityType.VA_HEALTH_FACILITY]: 'health',
  [FacilityType.VA_CEMETERY]: 'cemetery',
  [FacilityType.VA_BENEFITS_FACILITY]: 'benefits',
  [FacilityType.VET_CENTER]: 'vet-centers',
  [FacilityType.URGENT_CARE]: 'health',
  [LocationType.CC_PROVIDER]: 'cc-provider',
  [LocationType.URGENT_CARE_PHARMACIES]: 'cc-provider',
};

/**
 * Defines the options available for the Location Type Dropdown
 */
export const LOCATION_OPTIONS = [
  LocationType.HEALTH,
  LocationType.URGENT_CARE,
  LocationType.CC_PROVIDER,
  LocationType.BENEFITS,
  LocationType.CEMETERY,
  LocationType.VET_CENTER,
  LocationType.EMERGENCY_CARE,
];

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
 * Service type "Clinic/Center - Urgent Care" code
 */
export const CLINIC_URGENTCARE_SERVICE = '261QU0200X';

/**
 * Service type "Dentist - Orofacial Pain" code
 */
export const DENTAL_OROFACIAL_PAIN_SERVICE = '1223X2210X';

/**
 * Service type "Pharmacy - Community/Retail Pharmacy" code
 */
export const PHARMACY_RETAIL_SERVICE = '3336C0003X';

/**
 * Emergency Care Services codes
 */
export const EMERGENCY_CARE_SERVICES = [
  '261QE0002X',
  '282N00000X',
  '282NC0060X',
  '282NR1301X',
  '282NW0100X',
];

/**
 * Error Messages
 */
export const Error = {
  DEFAULT:
    'We’re sorry. Something went wrong on our end. Please refresh this page or try again later.',
  LOCATION:
    'Something’s not quite right. Please enter a valid or different location and try your search again.',
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

export const Covid19Vaccine = 'Covid19Vaccine';
