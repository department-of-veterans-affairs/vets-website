import { formatInTimeZone } from 'date-fns-tz';
import { selectTimeZoneAbbr } from '../../appointment-list/redux/selectors';
import { getTimezoneNameFromAbbr } from '../../utils/timezone';
import Appointment from './Appointment';

// function getAtlasLocation(appt) {
//   const { atlas } = appt.telehealth;
//   return {
//     id: atlas.siteCode,
//     resourceType: 'Location',
//     address: {
//       line: [atlas.address.streetAddress],
//       city: atlas.address.city,
//       state: atlas.address.state,
//       postalCode: atlas.address.zipCode,
//     },
//     position: {
//       longitude: atlas.address.longitude,
//       latitude: atlas.address.latitude,
//     },
//   };
// }

// function getVideoObject(appt) {
//   const providers = appt.practitioners;
//   const isVideo =
//     appt._modality === 'vaVideoCareAtAnAtlasLocation' ||
//     appt._modality === 'vaVideoCareAtHome' ||
//     appt._modality === 'vaVideoCareAtAVaLocation';

//   if (isVideo) {
//     return {
//       isVideo,
//       facilityId: appt.locationId,
//       kind: appt.telehealth?.vvsKind,
//       url: appt.telehealth?.url,
//       displayLink: appt.telehealth?.displayLink,
//       duration: appt.minutesDuration,
//       providers: (providers || [])
//         .map(provider => {
//           if (!provider.name) return null;
//           return {
//             name: {
//               firstName: provider.name?.given,
//               lastName: provider.name?.family,
//             },
//             display: `${provider.name?.given} ${provider.name?.family}`,
//           };
//         })
//         .filter(Boolean),
//       atlasLocation:
//         appt.modality === 'vaVideoCareAtAnAtlasLocation'
//           ? getAtlasLocation(appt)
//           : null,
//       atlasConfirmationCode: appt.telehealth?.atlas?.confirmationCode,
//       extension: appt.extension,
//     };
//   }
//   return null;
// }

export default class AppointmentVideo extends Appointment {
  constructor(response) {
    super(response);

    this.displayLink = response.telehealth?.displayLink;
    this.isVideo = true;
    this.kind = response.telehealth?.vvsKind;
    this.url = response.telehealth?.url;
  }

  get appointmentDetailAriaText() {
    const appointmentDate = this.startDate;
    const timezoneName = getTimezoneNameFromAbbr(selectTimeZoneAbbr(this));
    const fillin1 = this.isCanceled ? `Details for canceled` : 'Details for';
    const fillin2 =
      this.typeOfCareName && typeof this.typeOfCareName !== 'undefined'
        ? `${this.typeOfCareName} appointment`
        : 'appointment';
    const fillin3 = `${formatInTimeZone(
      appointmentDate,
      this.timezone,
      'EEEE, MMMM d h:mm aaaa',
    )}, ${timezoneName}`;

    return `${fillin1} video ${fillin2} ${fillin3}`;
  }
}
