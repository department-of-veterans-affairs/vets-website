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
    providerName: relationship.attributes.attributes.provider.name,
    providerId: relationship.attributes.attributes.provider.cernerId,
    serviceType: relationship.attributes.attributes.serviceType.coding[0].code,
    locationName: relationship.attributes.attributes.location.name,
    clinicName: relationship.attributes.attributes.clinic.name,
    vistaId: relationship.attributes.attributes.clinic.vistaSite,
    lastSeen: relationship.attributes.attributes.lastSeen,
    hasAvailability: relationship.attributes.attributes.hasAvailability,
  }));
}
