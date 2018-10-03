/**
 * A list of services that correspond to those which we have downtime information as provided by the API.
 * API - see services under maintenance_windows - https://github.com/department-of-veterans-affairs/devops/blob/master/ansible/deployment/config/vets-api/prod-settings.local.yml.j2#L175
 */
export default {
  appeals: 'appeals',
  arcgis: 'arcgis',
  dslogon: 'dslogon',
  emis: 'emis',
  // Enrollment System (HCA submissions)
  es: 'es',
  evss: 'evss',
  // ID.me, identity provider
  idme: 'idme',
  // Master Veteran Index (source of veteran profile info)
  mvi: 'mvi',
  // MyHealtheVet
  mhv: 'mhv',
  // The Image Management System (education forms)
  tims: 'tims',
  // Veteran ID Card v1
  vic: 'vic',
  // Intake, conversion, and mail handling services (central mail)
  icmhs: 'icmhs',
  // Vet360 - data source for centralized veteran contact information
  vet360: 'vet360',
};
