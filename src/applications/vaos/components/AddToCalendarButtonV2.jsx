import React from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { addMinutes } from 'date-fns';
import PropTypes from 'prop-types';
import { generateICS } from '../utils/calendar';

function handleClick({ filename, ics }) {
  return () => {
    // IE11 doesn't support the download attribute, so this creates a button
    // and uses an ms blob save api
    if (window.navigator.msSaveOrOpenBlob) {
      const blob = new Blob([ics], {
        type: 'text/calendar;charset=utf-8;',
      });
      window.navigator.msSaveOrOpenBlob(blob, filename);
    }

    window.document.querySelector('#hidden-calendar-link').click();
  };
}

// function getCalendarData({ appointment, facility }) {
//   let data = {};
//   const isAtlas = appointment.isAtlasVideoAppointment;
//   const isHome = appointment.isVideoAtHome;
//   const isVideo = appointment.isVideo;
//   const isCommunityCare = appointment.isCommunityCare;
//   const isPhone = appointment.isVAPhoneAppointment;
//   const signinText =
//     'Sign in to https://va.gov/my-health/appointments/ to get details about this appointment';

//   if (isPhone) {
//     data = {
//       summary: 'Phone appointment',
//       providerName: facility?.name,
//       location: formatFacilityAddress(facility),
//       text: `A provider will call you at ${formatInTimeZone(
//         appointment.start,
//         appointment.timezone,
//         'h:mm aaaa',
//       )}`,
//       phone: getFacilityPhone(facility),
//       additionalText: [signinText],
//     };
//   } else if (appointment.isInPersonVisit) {
//     data = {
//       summary: `Appointment at ${facility?.name || 'the VA'}`,
//       location: formatFacilityAddress(facility),
//       text: `You have a health care appointment at ${facility?.name ||
//         'a VA location.'}`,
//       phone: getFacilityPhone(facility),
//       additionalText: [signinText],
//     };
//   } else if (isCommunityCare) {
//     let { practiceName } = appointment.communityCareProvider || {};
//     const providerName = getProviderName(appointment);
//     let summary = 'Community care appointment';
//     practiceName = practiceName?.trim().length ? practiceName : '';
//     if (!!practiceName || !!providerName) {
//       // order of the name appearing on the calendar title is important to match the display screen name
//       summary =
//         appointment.version === 1
//           ? `Appointment at ${providerName || practiceName}`
//           : `Appointment at ${(providerName || [])[0] || practiceName}`;
//     }
//     data = {
//       summary,
//       providerName:
//         providerName !== undefined ? `${providerName || practiceName}` : null,
//       location: formatFacilityAddress(appointment?.communityCareProvider),
//       text:
//         'You have a health care appointment with a community care provider. Please don’t go to your local VA health facility.',
//       phone: getFacilityPhone(appointment?.communityCareProvider),
//       additionalText: [signinText],
//     };
//   } else if (isVideo) {
//     const providerName = appointment.videoData?.providers
//       ? appointment.videoData.providers[0]?.display
//       : '';
//     const providerText = providerName
//       ? `You'll be meeting with ${providerName}`
//       : '';

//     if (isHome) {
//       data = {
//         summary: 'VA Video Connect appointment',
//         text:
//           'You can join this meeting up to 30 minutes before the start time.',
//         location: 'VA Video Connect at home',
//         additionalText: [signinText],
//       };
//     } else if (isAtlas) {
//       const { atlasLocation } = appointment.videoData;

//       if (atlasLocation?.address) {
//         data = {
//           summary: `VA Video Connect appointment at an ATLAS facility`,
//           location: formatFacilityAddress(atlasLocation),
//           text: 'Join this video meeting from this ATLAS (non-VA) location:',
//           additionalText: [
//             `Your appointment code is ${
//               appointment.videoData.atlasConfirmationCode
//             }. Use this code to find your appointment on the computer at the ATLAS facility.`,
//           ],
//         };

//         if (providerName)
//           data.additionalText.push(`You'll be meeting with ${providerName}`);
//       }
//     } else if (appointment.isClinicVideoAppointment()) {
//       data = {
//         summary: `VA Video Connect appointment at ${facility?.name ||
//           'a VA location'}`,
//         providerName: facility?.name,
//         location: formatFacilityAddress(facility),
//         text: `You need to join this video meeting from${
//           facility
//             ? ':'
//             : ' the VA location where you scheduled the appointment.'
//         }`,
//         phone: getFacilityPhone(facility),
//       };

//       if (providerName) data.additionalText = [providerText, signinText];
//       else data.additionalText = [signinText];
//     }
//   }

//   return data;
// }

export default function AddToCalendarButton({ appointment }) {
  const isCC = appointment?.vaos?.isCommunityCare;
  const startUtc = appointment?.start;
  const duration = appointment?.minutesDuration;
  const endUtc = addMinutes(startUtc, duration);

  const {
    additionalText,
    location,
    phone,
    providerName,
    summary = '',
    text,
  } = appointment.getCalendarData;
  const description = {
    text,
    phone,
    additionalText,
    ...(!isCC && { providerName }),
  };
  const ics = generateICS(summary, description, location, startUtc, endUtc);

  const filename = `${summary.replace(/\s/g, '_')}.ics`;

  return (
    <>
      <a
        id="hidden-calendar-link"
        href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`}
        className="vads-u-display--none"
        data-testid="add-to-calendar-link"
      >
        hidden
      </a>
      <VaButton
        text="Add to calendar"
        secondary
        onClick={handleClick({
          filename,
          ics,
        })}
        data-testid="add-to-calendar-button"
      />
    </>
  );
}
AddToCalendarButton.propTypes = {
  appointment: PropTypes.object,
};
