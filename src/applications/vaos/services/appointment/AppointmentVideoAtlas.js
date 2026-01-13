import { formatFacilityAddress } from '../location';
import AppointmentVideo from './AppointmentVideo';

export default class AppointmentVideoAtlas extends AppointmentVideo {
  constructor(response) {
    super(response);

    this.atlasConfirmationCode = response.telehealth?.atlas?.confirmationCode;
    this.isAtlasVideoAppointment =
      response.modality === 'vaVideoCareAtAnAtlasLocation';

    const { atlas } = response.telehealth;
    this.atlasLocation = {
      id: atlas.siteCode,
      resourceType: 'Location',
      address: {
        line: [atlas.address.streetAddress],
        city: atlas.address.city,
        state: atlas.address.state,
        postalCode: atlas.address.zipCode,
      },
      position: {
        longitude: atlas.address.longitude,
        latitude: atlas.address.latitude,
      },
    };

    // this.modality = 'vaVideoCareAtAnAtlasLocation';

    const { streetAddress, city, state } = response.telehealth.atlas.address;
    this.modalityText = `At ${streetAddress} ${city}, ${state}`;
  }

  get getCalendarData() {
    const data = [];

    if (this.atlasLocation?.address) {
      data.push({
        summary: `VA Video Connect appointment at an ATLAS facility`,
        location: formatFacilityAddress(this.atlasLocation),
        text: 'Join this video meeting from this ATLAS (non-VA) location:',
        additionalText: [
          `Your appointment code is ${
            this.atlasConfirmationCode
          }. Use this code to find your appointment on the computer at the ATLAS facility.`,
        ],
      });

      if (this.location?.name)
        data.additionalText = `You'll be meeting with ${this.location?.name}`;
    }
    return data;
  }
}
