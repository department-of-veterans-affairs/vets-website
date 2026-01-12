import PropTypes from 'prop-types';
import React from 'react';
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

function getHeading(appointment) {
  if (appointment.isInPersion) {
    if (appointment.isCanceled) return 'Canceled in-person appointment';
    return 'In-person appointment';
  }

  if (appointment.isVAPhoneAppointment) {
    if (appointment.isCanceled) return 'Canceled phone appointment';
    return 'Phone appointment';
  }

  return 'Not defined';
}

export default function CancelPageLayout({ data: appointment }) {
  const {
    clinicName,
    clinicPhone,
    clinicPhoneExtension,
    clinicPhysicalLocation,
    facility,
    facilityPhone,
    isCerner,
    isPhone,
    locationId,
    patientComments,
    practitionerName,
    startDate,
    typeOfCareName,
  } = appointment;

  const heading = getHeading(appointment);
  const facilityId = locationId;

  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">{heading}</h2>
      <When level={3}>
        <AppointmentDate date={startDate} timezone={appointment?.timezone} />
        <br />
        <AppointmentTime
          appointment={appointment}
          timezone={appointment.timezone}
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
      <Details otherDetails={patientComments} level={3} isCerner={isCerner} />
    </>
  );
}
CancelPageLayout.propTypes = {
  data: PropTypes.object,
};
