import { ccLocatorEnabled } from '../config';

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
};

/**
 * Enum for the various Facility Types (inside the `attributes` object of a result)
 */
export const FacilityType = {
  VA_HEALTH_FACILITY: 'va_health_facility',
  VA_CEMETARY: 'va_cemetery',
  VA_BENEFITS_FACILITY: 'va_benefits_facility',
  VET_CENTER: 'vet_center',
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
  [LocationType.CC_PROVIDER]: 'cc-provider',
};

/**
 * Defines the options available for the Location Type Dropdown
 */
// TODO: Remove feature flag when going live
export const LOCATION_OPTIONS = ccLocatorEnabled()
  ? ['all', 'health', 'cc_provider', 'benefits', 'cemetery', 'vet_center']
  : ['all', 'health', 'benefits', 'cemetery', 'vet_center'];

/**
 * Defines the ± change in bounding box size for the map when changing zoom
 */
export const BOUNDING_RADIUS = 0.75;
