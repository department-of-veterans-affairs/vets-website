/**
 * Enum for the type attribute of a Facility/Provider search result
 */
export const LocationType = {
  ALL: 'all',
  VA_FACILITIES: 'va_facilities',
  CC_PROVIDER: 'cc_provider',
  // Subtypes of VA_FACILITIES
  HEALTH: 'health',
  BENEFITS: 'benefits',
  CEMETARY: 'cemetery',
  VET_CENTER: 'vet_center',
  URGENT_CARE: 'urgent_care',
  URGENT_CARE_FARMACIES: 'cc_pharmacy',
};

/**
 * Enum for the various Facility Types (inside the `attributes` object of a result)
 */
export const FacilityType = {
  VA_HEALTH_FACILITY: 'va_health_facility',
  VA_CEMETARY: 'va_cemetery',
  VA_BENEFITS_FACILITY: 'va_benefits_facility',
  VET_CENTER: 'vet_center',
  URGENT_CARE: 'urgent_care',
  URGENT_CARE_FARMACIES: 'cc_pharmacy',
};

/**
 * Enum for map pins.
 * Location types mapped to the filename prefix for the png/svg.
 */
export const PinNames = {
  [FacilityType.VA_HEALTH_FACILITY]: 'health',
  [FacilityType.VA_CEMETARY]: 'cemetery',
  [FacilityType.VA_BENEFITS_FACILITY]: 'benefits',
  [FacilityType.VET_CENTER]: 'vet-centers',
  [FacilityType.URGENT_CARE]: 'health',
  [LocationType.CC_PROVIDER]: 'cc-provider',
  [LocationType.URGENT_CARE_FARMACIES]: 'cc-provider',
};

/**
 * Defines the options available for the Location Type Dropdown
 */
export const LOCATION_OPTIONS = [
  LocationType.HEALTH,
  LocationType.URGENT_CARE,
  LocationType.CC_PROVIDER,
  LocationType.BENEFITS,
  LocationType.CEMETARY,
  LocationType.VET_CENTER,
];

/**
 * Defines the ± change in bounding box size for the map when changing zoom
 */
export const BOUNDING_RADIUS = 0.75;

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
