/**
 * @module services/Patient/transformers
 */

/**
 * Transforms a patient relationship object returned from the VPG endpoint to the
 * VAOS PatientProviderRelationship format
 *
 * @export
 * @param {patientRelationship} patientRelationships A patient relationships object returned from VPG
 * @returns {Array<PatientProviderRelationship} Returns an array of PatientProviderRelationship objects
 */

export function transformPatientRelationships(patientRelationships) {
  const relationships = patientRelationships.data;
  return relationships.map(relationship => ({
    resourceType: 'PatientProviderRelationship',
    providerName: relationship.attributes.provider.name,
    providerId: relationship.attributes.provider.cernerId,
    serviceType: relationship.attributes.serviceType.coding[0].code,
    locationName: relationship.attributes.location.name,
    lastSeen: relationship.attributes.lastSeen,
    hasAvailability: relationship.attributes.hasAvailability,
  }));
}
