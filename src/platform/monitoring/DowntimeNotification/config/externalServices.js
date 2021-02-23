/**
 * A list of services that correspond to those which we have downtime information as provided by the API.
 * API - see services under maintenance_windows - https://github.com/department-of-veterans-affairs/devops/blob/master/ansible/deployment/config/vets-api/prod-settings.local.yml.j2#L284
 */
export default {
  appeals: 'appeals',
  arcgis: 'arcgis',
  // Benefits Gateway Services
  bgs: 'bgs',
  dslogon: 'dslogon',
  emis: 'emis',
  // Enrollment System (HCA submissions)
  es: 'es',
  evss: 'evss',
  // global downtime, for scheduled downtime on apps that don't have specific dependencies documented
  global: 'global',
  // ID.me, identity provider
  idme: 'idme',
  // Master Veteran Index (source of veteran profile info)
  mvi: 'mvi',
  // My HealtheVet
  mhv: 'mhv',
  // The Image Management System (education forms)
  tims: 'tims',
  // Veteran ID Card v1
  vic: 'vic',
  // Intake, conversion, and mail handling services (central mail)
  icmhs: 'icmhs',
  // VA Profile (formerly Vet360) - data source for centralized veteran contact information
  vaProfile: 'vet360',
  // Search.gov API
  search: 'search',
  // Online appointment scheduling
  vaos: 'vaos',
  // Online appointment scheduling warning message
  vaosWarning: 'vaosWarning',
  // CARMA (Caregiver Record Management Application)
  carma: 'carma',
  // Health care questionnaire
  hcq: 'hcq',
  // Covid-19 Vaccination Keep Me Informed
  vetextVaccine: 'vetext_vaccine',
};
