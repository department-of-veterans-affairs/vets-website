import React from 'react';
import PropTypes from 'prop-types';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import { getRealFacilityId } from '../../utils/appointment';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import {
  captureMissingModalityLogs,
  NULL_STATE_FIELD,
  recordAppointmentDetailsNullStates,
} from '../../utils/events';
import Address from '../Address';
import AddToCalendarButton from '../AddToCalendarButtonV2';
import FacilityDirectionsLink from '../FacilityDirectionsLink';
import NewTabAnchor from '../NewTabAnchor';
import ClinicName from './ClinicName';
import ClinicPhysicalLocation from './ClinicPhysicalLocation';
import DetailPageLayout from './DetailPageLayoutV2';
import { ClinicOrFacilityPhone } from './DetailPageLayoutV2/ClinicOrFacilityPhone';
import { Details } from './DetailPageLayoutV2/Details';
import { Prepare } from './DetailPageLayoutV2/Prepare';
import { Where } from './DetailPageLayoutV2/Where';
import { Who } from './DetailPageLayoutV2/Who';
import { What } from './DetailPageLayoutV2/What';
import { When } from './DetailPageLayoutV2/When';

export default function InPersonLayout({ data: appointment }) {
  //   const {
  //     clinicName,
  //     clinicPhysicalLocation,
  //     clinicPhone,
  //     clinicPhoneExtension,
  //     facility,
  //     facilityPhone,
  //     locationId,
  //     isPastAppointment,
  //     practitionerName,
  //     startDate,
  //     status,
  //     timezone,
  //     appointment.typeOfCareName,
  //     isCerner,
  //   } = useSelector(
  //     state => selectConfirmedAppointmentData(state, appointment),
  //     shallowEqual,
  //   );

  // if (!appointment) return null;

  const { patientComments, isPastAppointment, isCanceled, isBooked } =
    appointment || {};
  const { location: facility } = appointment;
  const facilityId = appointment.locationId;

  let heading = 'In-person appointment';
  if (APPOINTMENT_STATUS.cancelled === appointment.status)
    heading = 'Canceled in-person appointment';
  else if (isPastAppointment) heading = 'Past in-person appointment';

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
      [NULL_STATE_FIELD.TYPE_OF_CARE]: !appointment.typeOfCareName,
      [NULL_STATE_FIELD.PROVIDER]: !appointment.practitionerName,
      [NULL_STATE_FIELD.CLINIC_PHONE]: !appointment.clinicPhone,
      [NULL_STATE_FIELD.FACILITY_ID]: !facilityId,
      [NULL_STATE_FIELD.FACILITY_DETAILS]: !appointment.location,
      [NULL_STATE_FIELD.FACILITY_PHONE]: !appointment.location?.facilityPhone,
    },
  );

  return (
    <DetailPageLayout heading={heading} data={appointment}>
      <When>
        <AppointmentDate
          date={appointment.startDate}
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
        {appointment.typeOfCareName && (
          <span data-dd-privacy="mask">{appointment.typeOfCareName}</span>
        )}
      </What>
      <Who>
        {appointment.practitionerName && (
          <span data-dd-privacy="mask">{appointment.practitionerName}</span>
        )}
      </Who>
      <Where heading={isBooked ? 'Where to attend' : undefined}>
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
            <ClinicName name={facility.clinicName} />{' '}
            <ClinicPhysicalLocation
              location={facility.clinicPhysicalLocation}
            />{' '}
            <br />
          </>
        )}
        <ClinicOrFacilityPhone
          clinicPhone={facility.clinicPhone}
          clinicPhoneExtension={facility.clinicPhoneExtension}
          facilityPhone={facility.facilityPhone}
        />
      </Where>
      <Details otherDetails={patientComments} isCerner={appointment.isCerner} />
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
    </DetailPageLayout>
  );
}
InPersonLayout.propTypes = {
  data: PropTypes.object,
};
