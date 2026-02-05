import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useParams } from 'react-router-dom';
import Address from '../../../components/Address';
import FacilityDirectionsLink from '../../../components/FacilityDirectionsLink';
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
import {
  getConfirmedAppointmentDetailsInfo,
  selectIsCanceled,
  selectIsPhone,
} from '../../redux/selectors';
import { isInPersonVisit } from '../../../services/appointment';
import ClinicPhysicalLocation from '../../../components/layouts/ClinicPhysicalLocation';
import ClinicName from '../../../components/layouts/ClinicName';

function getHeading(appointment) {
  const isCanceled = selectIsCanceled(appointment);

  if (isInPersonVisit(appointment)) {
    if (isCanceled) return 'Canceled in-person appointment';
    return 'In-person appointment';
  }

  if (selectIsPhone(appointment)) {
    if (isCanceled) return 'Canceled phone appointment';
    return 'Phone appointment';
  }

  return 'Not defined';
}

export default function CancelPageLayout() {
  const { id } = useParams();
  const {
    appointment,
    clinicName,
    clinicPhone,
    clinicPhoneExtension,
    clinicPhysicalLocation,
    facility,
    locationId,
    facilityPhone,
    isPhone,
    practitionerName,
    startDate,
    typeOfCareName,
    isCerner,
  } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );

  const heading = getHeading(appointment);
  const { patientComments } = appointment || {};
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
