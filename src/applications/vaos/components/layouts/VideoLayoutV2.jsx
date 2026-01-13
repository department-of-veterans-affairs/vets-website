import React from 'react';
import PropTypes from 'prop-types';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import {
  captureMissingModalityLogs,
  NULL_STATE_FIELD,
  recordAppointmentDetailsNullStates,
} from '../../utils/events';
import AddToCalendarButton from '../AddToCalendarButtonV2';
import Section from '../Section';
import State from '../State';
import VideoLink from '../VideoLinkV2';
import ClinicName from './ClinicName';
import DetailPageLayout from './DetailPageLayoutV2';
import ClinicOrFacilityPhone from './DetailPageLayoutV2/ClinicOrFacilityPhone';
import Prepare from './DetailPageLayoutV2/Prepare';
import Who from './DetailPageLayoutV2/Who';
import What from './DetailPageLayoutV2/What';
import When from './DetailPageLayoutV2/When';
import VideoLayoutAtlas from './VideoLayoutAtlasV2';
import VideoLayoutVA from './VideoLayoutVAV2';

export default function VideoLayout({ data: appointment }) {
  // const {
  //   clinicName,
  //   clinicPhone,
  //   clinicPhoneExtension,
  //   facility,
  //   facilityPhone,
  //   isCanceled,
  //   isPastAppointment,
  //   startDate,
  //   status,
  //   typeOfCareName,
  //   // videoProviderAddress,
  //   videoProviderName,
  // } = useSelector(
  //   state => selectConfirmedAppointmentData(state, appointment),
  //   shallowEqual,
  // );

  const {
    isAtlasVideoAppointment,
    isBooked,
    isCanceled,
    isClinicVideoAppointment,
    isPastAppointment,
    location: facility,
    practitioners,
    typeOfCareName,
  } = appointment;

  const providers = practitioners
    .map(practitioner => {
      if (!practitioner.name) return null;
      return {
        name: {
          firstName: practitioner.name?.given,
          lastName: practitioner.name?.family,
        },
        display: `${practitioner.name?.given} ${practitioner.name?.family}`,
      };
    })
    .filter(Boolean);

  const videoProviderName = providers.length > 0 ? providers[0].display : null;

  if (isAtlasVideoAppointment) return <VideoLayoutAtlas data={appointment} />;
  if (isClinicVideoAppointment) return <VideoLayoutVA data={appointment} />;

  const address = facility?.address;
  let heading = 'Video appointment';
  if (isCanceled) heading = 'Canceled video appointment';
  else if (isPastAppointment) heading = 'Past video appointment';

  if (!appointment.modality) {
    captureMissingModalityLogs(appointment);
  }
  recordAppointmentDetailsNullStates(
    {
      type: appointment.type,
      modality: appointment.modality,
      isCerner: appointment.isCerner,
    },
    {
      [NULL_STATE_FIELD.TYPE_OF_CARE]: !typeOfCareName,
      [NULL_STATE_FIELD.PROVIDER]: !videoProviderName,
      // [NULL_STATE_FIELD.CLINIC_PHONE]: !clinicPhone,
      [NULL_STATE_FIELD.FACILITY_DETAILS]: !facility,
      // [NULL_STATE_FIELD.FACILITY_PHONE]: !facilityPhone,
    },
  );

  return (
    <DetailPageLayout heading={heading} data={appointment}>
      {isBooked &&
        !isPastAppointment && (
          <Section heading="How to join">
            <VideoLink appointment={appointment} />
          </Section>
        )}
      <When>
        <AppointmentDate
          date={appointment.start}
          timezone={appointment.timezone}
        />
        <br />
        <AppointmentTime
          appointment={appointment}
          timezone={appointment.timezone}
        />
        <br />
        {isCanceled &&
          !isPastAppointment && (
            <div className="vads-u-margin-top--2 vaos-hide-for-print">
              <AddToCalendarButton
                appointment={appointment}
                facility={facility}
              />
            </div>
          )}
      </When>

      <What>
        {typeOfCareName && <span data-dd-privacy="mask">{typeOfCareName}</span>}
      </What>

      <Who>
        {videoProviderName && (
          <span data-dd-privacy="mask">{videoProviderName}</span>
        )}
      </Who>

      {((isBooked && isPastAppointment) || isCanceled) && (
        <Section heading="Scheduling facility">
          {!!facility && (
            <>
              <a href={facility.website}>{facility.name}</a>
              <br />
              <span>
                {address.city}, <State state={address.state} />
              </span>
            </>
          )}
          <ClinicName name={facility.clinicName} /> <br />
          <ClinicOrFacilityPhone
            clinicPhone={facility.clinicPhone}
            clinicPhoneExtension={facility.clinicPhoneExtension}
            facilityPhone={facility.facilityPhone}
          />
        </Section>
      )}

      {!isPastAppointment &&
        (isBooked || isCanceled) && (
          <Prepare>
            <ul className="vads-u-margin-top--0">
              <li>
                Bring your insurance cards, a list of your medications, and
                other things to share with your provider
                <br />
                <va-link
                  text="Find out what to bring to your appointment"
                  href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/"
                />
              </li>
              <li>
                Get your device ready to join
                <br />
                <va-link
                  text="Learn how to prepare for your video appointment"
                  href="https://www.va.gov/resources/how-should-i-prepare-for-a-video-health-appointment/"
                />
              </li>
            </ul>
          </Prepare>
        )}

      {isBooked &&
        !isPastAppointment && (
          <Section heading="Need to make changes?">
            Contact this facility if you need to reschedule or cancel your
            appointment.
            <br />
            <br />
            {facility ? (
              <>
                <a href={facility.website}>{facility.name}</a>
                <br />
                <span>
                  {address?.city}, <State state={address?.state} />
                </span>
              </>
            ) : (
              'Facility not available'
            )}
            <ClinicName name={facility?.clinicName} /> <br />
            <ClinicOrFacilityPhone
              clinicPhone={facility?.clinicPhone}
              clinicPhoneExtension={facility?.clinicPhoneExtension}
              facilityPhone={facility?.facilityPhone}
            />
          </Section>
        )}
    </DetailPageLayout>
  );
}
VideoLayout.propTypes = {
  data: PropTypes.object,
};
