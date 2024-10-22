/**
 * A list of services that correspond to those which we have downtime information as provided by the API.
 * API - see services under maintenance_windows - https://github.com/department-of-veterans-affairs/devops/blob/master/ansible/deployment/config/vets-api/prod-settings.local.yml.j2#L284
 */
export default {
  arcgis: 'arcgis',
  appeals: 'appeals',
  // Benefits Gateway Services
  bgs: 'bgs',
  // CARMA (Caregiver Record Management Application)
  carma: 'carma',
  // Debt Management Services
  dmc: 'dmc',
  dslogon: 'dslogon',
  // Enrollment System (HCA submissions)
  es: 'es',
  evss: 'evss',
  '1010ez': '1010ez',
  '1010ezr': '1010ezr',
  // IVC CHAMPVA form controls
  form107959f1: 'form107959f1',
  // global downtime, for scheduled downtime on apps that don't have specific dependencies documented
  global: 'global',
  // Intake, conversion, and mail handling services (central mail)
  icmhs: 'icmhs',
  // ID.me, identity provider
  idme: 'idme',
  // COE, Certificate of Eligibility form and LGY Eligibility Manager API
  coe: 'coe',
  // Login.gov, identity provider
  logingov: 'logingov',
  // Master Veteran Index (source of veteran profile info)
  mvi: 'mvi',
  // My HealtheVet
  mhv: 'mhv',
  // My HealtheVet Platform - Medical Records, Secure Messaging and Medications
  mhvPlatform: 'mhv_platform',
  // My HealtheVet Medical Records
  mhvMr: 'mhv_mr',
  // My HealtheVet Secure Messaging
  mhvSm: 'mhv_sm',
  // My HealtheVet Medications
  mhvMeds: 'mhv_meds',
  // PEGA form ingestion for IVC CHAMPVA forms (10-10d, 10-7959x)
  pega: 'pega',
  // Search.gov API
  search: 'search',
  // The Image Management System (education forms)
  tims: 'tims',
  // Online appointment scheduling
  vaos: 'vaos',
  // Online appointment scheduling warning message
  vaosWarning: 'vaosWarning',
  // VA Profile (formerly Vet360) - data source for centralized veteran contact information
  vaProfile: 'vet360',
  // Veteran Benefits Management System
  vbms: 'vbms',
  // Covid-19 Vaccination Keep Me Informed
  vetextVaccine: 'vetext_vaccine',
  // Veteran ID Card v1
  vic: 'vic',
  // veteran readiness and employment
  vre: 'vre',
  // veteran benefit services (used to source medical copay debt)
  vbs: 'vbs',
  // Day of check-in
  cie: 'cie',
  // Pre-check-in
  pcie: 'pcie',
  // Travel claim
  tc: 'tc',

  // Sources for VA Profile services:
  VAPRO_PROFILE_PAGE: 'vapro_profile_page',
  VAPRO_CONTACT_INFO: 'vapro_contact_info',
  LIGHTHOUSE_DIRECT_DEPOSIT: 'lighthouse_direct_deposit',
  VAPRO_MILITARY_INFO: 'vapro_military_info',
  VAPRO_NOTIFICATION_SETTINGS: 'vapro_notification_settings',
  VAPRO_HEALTH_CARE_CONTACTS: 'vapro_health_care_contacts',
  VAPRO_PERSONAL_INFO: 'vapro_personal_info',
};
