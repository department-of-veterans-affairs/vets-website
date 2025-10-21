import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import Address from '../../../components/Address';
import FacilityDirectionsLink from '../../../components/FacilityDirectionsLink';
import ClinicName from '../../../components/layouts/ClinicName';
import ClinicPhysicalLocation from '../../../components/layouts/ClinicPhysicalLocation';
import {
  ClinicOrFacilityPhone,
  Details,
  What,
  When,
  Where,
  Who,
} from '../../../components/layouts/DetailPageLayout';
import NewTabAnchor from '../../../components/NewTabAnchor';
import Section from '../../../components/Section';
import { getRealFacilityId } from '../../../utils/appointment';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../components/AppointmentDateTime';
import { useGetFacilityQuery } from '../../../services/location/apiSlice';

function getHeading(appointment) {
  const { isCanceled } = appointment;

  if (appointment.isInPersonVisit) {
    if (isCanceled) return 'Canceled in-person appointment';
    return 'In-person appointment';
  }

  if (appointment.isPhone) {
    if (isCanceled) return 'Canceled phone appointment';
    return 'Phone appointment';
  }

  return 'Not defined';
}

export default function CancelPageLayout({ appointment }) {
  const heading = getHeading(appointment);
  const { reasonForAppointment, patientComments } = appointment || {};
  const {
    clinicName,
    clinicPhone,
    clinicPhoneExtension,
    clinicPhysicalLocation,
    locationId: facilityId,
    facilityPhone,
    isPhoneAppointment: isPhone,
    practitionerName,
    typeOfCareName,
  } = appointment;
  const { isSuccess, data: facility } = useGetFacilityQuery({
    id: appointment.locationId,
  });
  // const facility = useSelector(selectFacilities);
  console.log('facility', isSuccess, facility);

  if (isSuccess) {
    return (
      <>
        <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">{heading}</h2>
        <When level={3}>
          <AppointmentDate
            date={appointment.start}
            timezone={appointment?.timezone}
          />
          <br />
          <AppointmentTime
            appointment={appointment}
            timezone={appointment?.timezone}
          />
          <br />
        </When>
        <What level={3}>{typeOfCareName}</What>
        <Who level={3}>{practitionerName}</Who>
        {isPhone && (
          <Section heading="Scheduling facility" level={3}>
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
              <span data-dd-privacy="mask">
                {facility.name}
                <br />
                <Address address={facility?.address} />
              </span>
            )}
            <ClinicName name={clinicName} /> <br />
            <ClinicOrFacilityPhone
              clinicPhone={clinicPhone}
              clinicPhoneExtension={clinicPhoneExtension}
              facilityPhone={facilityPhone}
            />
          </Section>
        )}
        {!isPhone && (
          <Where level={3}>
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
                {facility.name}
                <br />
                <Address address={facility?.address} />
                <div className="vads-u-margin-top--1 vads-u-color--link-default">
                  <FacilityDirectionsLink location={facility} icon />
                </div>
                <ClinicName name={clinicName} />{' '}
                <ClinicPhysicalLocation location={clinicPhysicalLocation} />{' '}
                <br />
              </>
            )}
            <ClinicOrFacilityPhone
              clinicPhone={clinicPhone}
              clinicPhoneExtension={clinicPhoneExtension}
              facilityPhone={facilityPhone}
            />
          </Where>
        )}
        <Details
          reason={reasonForAppointment}
          otherDetails={patientComments}
          level={3}
        />
      </>
    );
  }
  return null;
}

CancelPageLayout.propTypes = {
  appointment: PropTypes.object.isRequired,
};
