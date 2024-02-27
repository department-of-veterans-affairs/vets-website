export default function createStructuredVALocation(vc, centerDistance) {
  return {
    id: vc.id,
    entityBundle: vc.attributes.facilityType,
    fieldPhoneNumber: vc.attributes.phone.main,
    fieldPhoneMentalHealth: vc.attributes.phone.mentalHealthClinic,
    distance: centerDistance,
    title: vc.attributes.name,
    fieldAddress: {
      addressLine1: vc.attributes.address.physical.address1,
      administrativeArea: vc.attributes.address.physical.state,
      locality: vc.attributes.address.physical.city,
      postalCode: vc.attributes.address.physical.zip,
    },
    fieldOperatingStatusFacility: vc.attributes.operatingStatus?.code.toLowerCase(),
    fieldOperatingStatusMoreInfo: vc.attributes.operatingStatus?.additionalInfo,
    website: vc.attributes.website,
    source: vc.source,
  };
}
