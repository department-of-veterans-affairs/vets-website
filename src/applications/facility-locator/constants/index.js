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
 * Enum for operating status.
 */
export const OperatingStatus = {
  NORMAL: 'NORMAL',
  LIMITED: 'LIMITED',
  CLOSED: 'CLOSED',
  NOTICE: 'NOTICE',
  TEMPORARY_CLOSURE: 'TEMPORARY_CLOSURE',
  TEMPORARY_LOCATION: 'TEMPORARY_LOCATION',
  VIRTUAL_CARE: 'VIRTUAL_CARE',
  COMING_SOON: 'COMING_SOON',
};

// Used in multiple places, so export it here
export const OperatingStatusDisplay = {
  [OperatingStatus.CLOSED]: {
    operationStatusTitle: 'Facility Closed',
    alertClass: 'warning',
  },
  [OperatingStatus.LIMITED]: {
    operationStatusTitle: 'Limited services and hours',
    alertClass: 'info',
  },
  [OperatingStatus.NOTICE]: {
    operationStatusTitle: 'Facility notice',
    alertClass: 'info',
  },
  [OperatingStatus.COMING_SOON]: {
    operationStatusTitle: 'Coming soon',
    alertClass: 'warning',
  },
  [OperatingStatus.TEMPORARY_CLOSURE]: {
    operationStatusTitle: 'Temporary facility closure',
    alertClass: 'warning',
  },
  [OperatingStatus.TEMPORARY_LOCATION]: {
    operationStatusTitle: 'Temporary location',
    alertClass: 'warning',
  },
  [OperatingStatus.VIRTUAL_CARE]: {
    operationStatusTitle: 'Virtual care only',
    alertClass: 'warning',
  },
};

export const BurialStatusDisplay = {
  BURIALS_OPEN: {
    statusTitle: 'Open',
    statusDescription: 'Available at this cemetery:',
    descriptionDetails: [
      'New burial of caskets in a gravesite.',
      'New burial of cremated remains in an in-ground gravesite or placement in an above-ground columbarium niche.',
    ],
  },
  BURIALS_CREMATION_ONLY: {
    statusTitle: 'Cremation only',
    statusDescription:
      'Available at this cemetery: New burial of cremated remains in an in-ground gravesite and/or placement in an above-ground columbarium niche.',
    descriptionDetails: [
      'If a Veteran or family member is already buried in an existing casket gravesite here, and there is enough space in that casket gravesite, the cemetery can conduct a new casket burial of another eligible family member (called a “subsequent interment”). If you have a loved one who is already buried in an existing casket gravesite here, please contact the cemetery to find out more about subsequent interment.',
    ],
  },
  BURIALS_CLOSED: {
    statusTitle: 'Closed',
    statusDescription: 'This cemetery has no new gravesites available.',
    descriptionDetails: [
      'If a Veteran or family member is already buried in an existing casket or cremation gravesite here, and there is enough space in that gravesite, the cemetery can conduct a new burial of an eligible family member (called a “subsequent interment”). If you have a loved one who is already buried in an existing gravesite here, contact the cemetery to find out more about subsequent interment.',
      'Sometimes, a casket or cremation gravesite or cremation columbarium niche may become available at a closed cemetery. If you are interested in gravesite availability for a deceased loved one, please contact the cemetery.',
    ],
  },
  BURIALS_UNDER_CONSTRUCTION: {
    statusTitle: 'Under construction',
    statusDescription:
      'This cemetery isn’t open yet for burials or visitation while it is under construction.',
    descriptionDetails: [],
  },
  DEFAULT: {
    statusTitle: 'Call for burial status',
    statusDescription: null,
    descriptionDetails: [],
  },
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
 * Max search area in miles
 */
export const MAX_SEARCH_AREA = 500;

/**
 * Min radius search area in miles
 */
export const MIN_RADIUS = 10;
export const MIN_RADIUS_CCP = 20;

export const Covid19Vaccine = 'Covid19Vaccine';
