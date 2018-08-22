/**
 * Single location to declare all your 'magic strings',
 * 'cause if you mistype an import you notice right away.
 * 
 * Mistype a string? Enjoy the browser blow up ;)
 */

export const LocationType = {
  VA_FACILITIES: 'va_facilities',
  CC_PROVIDER: 'cc_provider'
};

export const FacilityType = {
  VA_HEALTH_FACILITY: 'va_health_facility',
  VA_CEMETARY: 'va_cemetery',
  VA_BENEFITS_FACILITY: 'va_benefits_facility',
  VET_CENTER: 'vet_center'
};

export const LOCATION_OPTIONS = [
  'all',
  'health',
  'cc_provider',
  'benefits',
  'cemetery',
  'vet_center'
];

export const BOUNDING_RADIUS = 0.75;
