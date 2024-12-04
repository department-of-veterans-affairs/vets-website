/**
 * Transforms a patient relationship object returned from the VPG endpoint to the
 * VAOS PatientProviderRelationship format
 *
 * @export
 * @param {patientRelationship} patientRelationship A patient relationship object
 * @returns {PatientProviderRelationship} A PatientRelatiobship resource
 */

export function transformPatientRelationship(patientRelationship) {
  const attrs = patientRelationship.attributes.attributes;
  return {
    resourceType: 'PatientProviderRelationship',
    providerName: attrs.provider.name,
    providerId: attrs.provider.cernerId,
    serviceType: attrs.serviceType.coding.code,
    locationName: attrs.location.name,
    clinicName: attrs.clinic.name,
    vistaId: attrs.clinic.vistaSite,
    lastSeen: attrs.lastSeen,
  };
}
