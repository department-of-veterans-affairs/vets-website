/**
 * @module services/Patient/transformers
 */

/**
 * Transforms a patient relationship object returned from the VPG endpoint to the
 * VAOS PatientProviderRelationship format
 *
 * @export
 * @param {patientRelationshisp} patientRelationships A list of patient relationshiops from VPG
 * @returns {Array<PatientProviderRelationship} Returns an array of PatientProviderRelationship objects
 */

export function transformPatientRelationships(patientRelationships) {
  const relationships = patientRelationships.attributes.attributes;

  return relationships.map(relationship => ({
    resourceType: 'PatientProviderRelationship',
    providerName: relationship.provider.name,
    providerId: relationship.provider.cernerId,
    serviceType: relationship.serviceType.coding.code,
    locationName: relationship.location.name,
    clinicName: relationship.clinic.name,
    vistaId: relationship.clinic.vistaSite,
    lastSeen: relationship.lastSeen,
  }));
}
