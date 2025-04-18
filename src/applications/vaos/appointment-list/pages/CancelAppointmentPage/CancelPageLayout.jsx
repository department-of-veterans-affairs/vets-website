import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { shallowEqual } from 'recompose';
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
import { selectFeatureFeSourceOfTruthModality } from '../../../redux/selectors';
import { isInPersonVAAppointment } from '../../../services/appointment';
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

function getHeading(appointment, useFeSourceOfTruthModality) {
  const isCanceled = selectIsCanceled(appointment);

  if (isInPersonVAAppointment(appointment, useFeSourceOfTruthModality)) {
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
  } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );
  const useFeSourceOfTruthModality = useSelector(state =>
    selectFeatureFeSourceOfTruthModality(state),
  );

  const heading = getHeading(appointment, useFeSourceOfTruthModality);
  const { reasonForAppointment, patientComments } = appointment || {};
  const facilityId = locationId;

  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">{heading}</h2>
      <When level={3}>
        <AppointmentDate date={startDate} />
        <br />
        <AppointmentTime appointment={appointment} />
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
            <>
              {facility.name}
              <br />
              <Address address={facility?.address} />
            </>
          )}
          {clinicName ? `Clinic: ${clinicName}` : 'Clinic not available'}
          <br />
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
              <br />
              <span>Clinic: {clinicName || 'Not available'}</span> <br />
              <span>Location: {clinicPhysicalLocation || 'Not available'}</span>
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
