import PropTypes from 'prop-types';
import React from 'react';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import { getRealFacilityId } from '../../utils/appointment';
import {
  captureMissingModalityLogs,
  NULL_STATE_FIELD,
  recordAppointmentDetailsNullStates,
} from '../../utils/events';
import Address from '../Address';
import AddToCalendarButton from '../AddToCalendarButtonV2';
import FacilityDirectionsLink from '../FacilityDirectionsLink';
import NewTabAnchor from '../NewTabAnchor';
import Section from '../Section';
import ClinicName from './ClinicName';
import ClinicPhysicalLocation from './ClinicPhysicalLocation';
import DetailPageLayout from './DetailPageLayoutV2';
import ClinicOrFacilityPhone from './DetailPageLayoutV2/ClinicOrFacilityPhone';
import Prepare from './DetailPageLayoutV2/Prepare';
import What from './DetailPageLayoutV2/What';
import When from './DetailPageLayoutV2/When';
import Who from './DetailPageLayoutV2/Who';

export default function VideoLayoutVA({ data: appointment }) {
  const {
    clinicName,
    clinicPhysicalLocation,
    clinicPhone,
    clinicPhoneExtension,
    facility,
    facilityPhone,
    locationId,
    isBooked,
    isCanceled,
    isPastAppointment,
    startDate,
    timezone,
    typeOfCareName,
    videoProviderName,
  } = appointment;

  let heading = 'Video appointment at a VA location';
  const facilityId = locationId;
  if (isCanceled) heading = 'Canceled video appointment at VA location';
  else if (isPastAppointment) heading = 'Past video appointment at VA location';

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
      [NULL_STATE_FIELD.CLINIC_PHONE]: !clinicPhone,
      [NULL_STATE_FIELD.FACILITY_ID]: !facilityId,
      [NULL_STATE_FIELD.FACILITY_DETAILS]: !facility,
      [NULL_STATE_FIELD.FACILITY_PHONE]: !facilityPhone,
    },
  );

  return (
    <DetailPageLayout heading={heading} data={appointment}>
      {isBooked &&
        !isPastAppointment && (
          <Section heading="How to join">
            Join this video appointment at a VA facility.
            <br />
          </Section>
        )}
      <When>
        <AppointmentDate date={startDate} timezone={timezone} />
        <br />
        <AppointmentTime appointment={appointment} timezone={timezone} />
        <br />
        {!isCanceled &&
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
      <Section heading="Where to attend">
        {/* When the services return a null value for the facility (no facility ID) for all appointment types */}
        {!facility &&
          !facilityId && (
            <>
              <span>Facility details not available</span>
              <br />
              <NewTabAnchor href="/find-locations">
                Find facility information
              </NewTabAnchor>
              <br />
              <br />
            </>
          )}
        {/* When the services return a null value for the facility (but receive the facility ID) */}
        {!facility &&
          !!facilityId && (
            <>
              <span>Facility details not available</span>
              <br />
              <NewTabAnchor
                href={`/find-locations/facility/vha_${getRealFacilityId(
                  facilityId,
                )}`}
              >
                View facility information
              </NewTabAnchor>
              <br />
            </>
          )}
        {!!facility && (
          <>
            <a href={facility.website}>{facility.name}</a>
            <br />
            <Address address={facility?.address} />
            <div className="vads-u-margin-top--1 vads-u-color--link-default">
              <FacilityDirectionsLink location={facility} icon />
            </div>
            <ClinicName name={clinicName} />{' '}
            <ClinicPhysicalLocation location={clinicPhysicalLocation} /> <br />
          </>
        )}
        <ClinicOrFacilityPhone
          clinicPhone={clinicPhone}
          clinicPhoneExtension={clinicPhoneExtension}
          facilityPhone={facilityPhone}
        />
      </Section>
      {!isPastAppointment &&
        (isBooked || isCanceled) && (
          <Prepare>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
              Bring your insurance cards, a list of your medications, and other
              things to share with your provider
            </p>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
              <va-link
                text="Find out what to bring to your appointment"
                href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/"
              />
            </p>
          </Prepare>
        )}
      {isBooked &&
        !isPastAppointment && (
          <Section heading="Need to make changes?">
            Contact this facility if you need to reschedule or cancel your
            appointment.
          </Section>
        )}
    </DetailPageLayout>
  );
}
VideoLayoutVA.propTypes = {
  data: PropTypes.object,
};
