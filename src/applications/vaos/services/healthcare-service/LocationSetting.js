import { getTypeOfCareById } from '../../utils/appointment';

export default class LocationSetting {
  constructor(response) {
    this.id = response.facilityId;
    this.services = response.vaServices;
    this.communityCare = response.communityCare;
  }

  supportsService(typeOfCareId) {
    const idV2 = getTypeOfCareById(typeOfCareId)?.idV2;
    return this.services.some(
      service => service.id === idV2 && service?.direct?.enabled,
    );
  }

  supportsServiceV2(typeOfCareId) {
    const idV2 = getTypeOfCareById(typeOfCareId)?.idV2;
    return this.services.some(
      service =>
        service.clinicalServiceId === idV2 && service?.bookedAppointments,
    );
  }
}
