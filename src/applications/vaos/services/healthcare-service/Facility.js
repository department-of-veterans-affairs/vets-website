// import { VHA_FHIR_ID } from '../../utils/constants';

export default class Facility {
  constructor(response) {
    this.address = {
      line: response.physicalAddress?.line || response.physical_address?.line,
      city: response.physicalAddress?.city || response.physical_address?.city,
      state:
        response.physicalAddress?.state || response.physical_address?.state,
      postalCode:
        response.physicalAddress?.postalCode ||
        response.physical_address?.postalCode,
    };
    this.id = response.id;
    // this.identifier = [
    //   {
    //     system: 'http://med.va.gov/fhir/urn',
    //     value: `urn:va:division:${response.vistaSite || response.vista_site}:${
    //       response.id
    //     }`,
    //   },
    //   {
    //     system: VHA_FHIR_ID,
    //     value: response.id,
    //   },
    // ];
    this.name = response.name;
    this.position = {
      latitude: response.lat,
      longitude: response.long,
    };
    this.telecom = [
      {
        system: 'phone',
        value: response.phone?.main,
      },
    ];
    this.vistaId = response.vistaSite || response.vista_site;
    this.website = response.website;
  }
}
