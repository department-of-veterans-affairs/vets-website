export default class Clinic {
  constructor(response) {
    // ID: VA facility site code and clinic id
    this.id = `${response.vistaSite}_${response.id}`;
    // ID of physical VA Facility (sta6id) where the clinic is located
    this.stationId = response.stationId;
    // Name of VA facility where clinic is located
    this.stationName = response.stationName;
    // Description of service as presented to a consumer while searching
    this.serviceName = response.serviceName;
    // Boolean to allow direct scheduling by patient
    this.patientDirectScheduling = response.patientDirectScheduling;
  }
}
