/**
 * List of external backend services that we monitor as defined by the VA API:
 * https://github.com/department-of-veterans-affairs/vets-api/blob/master/config/settings.yml#L338
 */
export const EXTERNAL_SERVICES = {
  appeals: 'appeals',
  arcgis: 'arcgis',
  dslogon: 'dslogon',
  // Enrollment System (HCA submissions)
  es: 'es',
  evss: 'evss',
  global: 'global',
  // Intake, conversion, and mail handling services (central mail)
  icmhs: 'icmhs',
  // ID.me, identity provider
  idme: 'idme',
  // Login.gov, identity provider
  logingov: 'logingov',
  // My HealtheVet
  mhv: 'mhv',
  // Master Veteran Index (source of veteran profile info)
  mvi: 'mvi',
  // Search.gov API
  search: 'search',
  // SSOe authentication
  ssoe: 'ssoe',
  // The Image Management System (education forms)
  tims: 'tims',
  // VA Profile (formerly Vet360) - data source for centralized veteran contact information
  vaProfile: 'vet360',
  // Veteran ID Card v1
  vic: 'vic',
};
