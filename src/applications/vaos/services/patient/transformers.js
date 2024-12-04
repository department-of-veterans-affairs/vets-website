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
    provider: {
      name: attrs.provider.name,
      cernerId: attrs.provider.cernerId,
    },
    serviceType: attrs.serviceType.coding.code,
    location: attrs.location.name,
    clinicName: attrs.clinic.name,
    clinicId: attrs.clinic.vistaSite,
    lastSeen: attrs.lastSeen,
  };
}
