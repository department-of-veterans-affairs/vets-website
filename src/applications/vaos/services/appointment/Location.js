export default class Location {
  constructor(response) {
    // this.address = response.extension?.ccLocation?.address;
    this.address = {
      line:
        response.location?.attributes?.physicalAddress?.line ||
        response.location?.attributes?.physical_address?.line,
      city:
        response.location?.attributes?.physicalAddress?.city ||
        response.location?.attributes?.physical_address?.city,
      state:
        response.location?.attributes?.physicalAddress?.state ||
        response.location.physical_address?.state,
      postalCode:
        response.location?.attributes?.physicalAddress?.postalCode ||
        response.location?.attributes?.physical_address?.postalCode,
    };
    this.clinicName = response.serviceName;
    this.clinicPhone = response.extension?.clinic?.phoneNumber || null;
    this.clinicPhoneExtension =
      response.extension?.clinic?.phoneNumberExtension || null;
    this.clinicPhysicalLocation = response.physicalLocation;
    this.name = response.location?.attributes?.name;
    this.website = response.location?.attributes?.website;
  }
}
