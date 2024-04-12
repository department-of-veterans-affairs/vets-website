import React from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { shallowEqual } from 'recompose';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector } from 'react-redux';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import { getConfirmedAppointmentDetailsInfo } from '../../appointment-list/redux/selectors';
import StatusAlert from '../StatusAlert';
import VAFacilityLocation from '../VAFacilityLocation';
import DetailPageLayout, {
  When,
  What,
  Where,
  Section,
} from './DetailPageLayout';

export function InPersonLayout() {
  const { id } = useParams();
  const {
    appointment,
    comment,
    facility,
    isCovid,
    isPhoneAppointment,
    locationId,
    startDate,
    typeOfCareName,
  } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );
  const [reason, otherDetails] = comment.split(':');

  return (
    <DetailPageLayout
      header="In-person appointment"
      instructions={`Go to ${facility?.name} for this appointment`}
    >
      <StatusAlert
        appointment={appointment}
        facility={facility}
        showScheduleLink
      />
      <When>
        <AppointmentDate date={startDate} />
        <br />
        <AppointmentTime appointment={appointment} />
        <br />
        <div className="vads-u-margin-top--2">
          <VaButton text="Add to calendar" secondary onClick="" />
        </div>
      </When>
      <What>{typeOfCareName || 'Type of care not noted'}</What>
      <Where>
        <VAFacilityLocation
          facility={facility}
          facilityName={facility?.name}
          facilityId={locationId}
          clinicFriendlyName={appointment.location?.clinicName}
          clinicPhysicalLocation={appointment.location?.clinicPhysicalLocation}
          showCovidPhone={isCovid}
          isPhone={isPhoneAppointment}
        />
      </Where>
      <Section heading="Details you shared with your provider">
        <span>
          Reason: {`${reason && reason !== 'none' ? reason : 'Not noted'}`}
        </span>
        <br />
        <span>Other details: {`${otherDetails || 'Not noted'}`}</span>
      </Section>
    </DetailPageLayout>
  );
}
