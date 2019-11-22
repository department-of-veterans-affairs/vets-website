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
export const LOCATION_OPTIONS = [
  LocationType.ALL,
  LocationType.HEALTH,
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
 * Defines a list of new VAMC urls
 */
export const VamcUrls = [
  {
    id: 'vha_646',
    url:
      'https://www.va.gov/pittsburgh-health-care/locations/pittsburgh-va-medical-center-university-drive/',
  },
  {
    id: 'vha_646A4',
    url:
      'https://www.va.gov/pittsburgh-health-care/locations/h-john-heinz-iii-department-of-veterans-affairs-medical-center/',
  },
  {
    id: 'vha_646GC',
    url:
      'https://www.va.gov/pittsburgh-health-care/locations/beaver-county-va-clinic/',
  },
  {
    id: 'vha_646GA',
    url:
      'https://www.va.gov/pittsburgh-health-care/locations/belmont-county-va-clinic/',
  },
  {
    id: 'vha_646GE',
    url:
      'https://www.va.gov/pittsburgh-health-care/locations/fayette-county-va-clinic',
  },
  {
    id: 'vha_646GD',
    url:
      'https://www.va.gov/pittsburgh-health-care/locations/washington-county-va-clinic',
  },
  {
    id: 'vha_646GB',
    url:
      'https://www.va.gov/pittsburgh-health-care/locations/westmoreland-county-va-clinic',
  },
];
