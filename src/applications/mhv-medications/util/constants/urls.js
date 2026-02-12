// Query parameter name for station number (used for v2 API with Cerner pilot)
export const STATION_NUMBER_PARAM = 'station_number';

export const medicationsUrls = {
  VA_HOME: '/../../../',
  MHV_HOME: '/../../my-health',
  MEDICATIONS_URL: '/my-health/medications',
  MEDICATIONS_IN_PROGRESS: '/my-health/medications/in-progress',
  MEDICATIONS_LOGIN: '/my-health/medications?next=loginModal&oauth=true',
  MEDICATIONS_REFILL: '/my-health/medications/refill',
  PRESCRIPTION_DETAILS: '/my-health/medications/prescription',
  subdirectories: {
    BASE: '/',
    DOCUMENTATION: '/documentation',
    IN_PROGRESS: '/in-progress',
    DETAILS: '/prescription',
    REFILL: '/refill',
  },
};
