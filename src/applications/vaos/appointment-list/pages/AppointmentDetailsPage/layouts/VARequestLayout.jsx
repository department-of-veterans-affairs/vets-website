import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { shallowEqual } from 'recompose';
import Address from '../../../../components/Address';
import FacilityDirectionsLink from '../../../../components/FacilityDirectionsLink';
import FacilityPhone from '../../../../components/FacilityPhone';
import NewTabAnchor from '../../../../components/NewTabAnchor';
import { getRealFacilityId } from '../../../../utils/appointment';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import { selectRequestedAppointmentData } from '../../../redux/selectors';
import PageLayout from '../../PageLayout';
import DetailPageLayout, { Details, Section } from './DetailPageLayout';

export default function VARequestLayout({ data: appointment }) {
  const { search } = useLocation();
  const {
    email,
    facility,
    facilityId,
    facilityPhone,
    isPendingAppointment,
    phone,
    preferredDates,
    status,
    typeOfCareName,
  } = useSelector(
    state => selectRequestedAppointmentData(state, appointment),
    shallowEqual,
  );
  const queryParams = new URLSearchParams(search);
  const showConfirmMsg = queryParams.get('confirmMsg');
  const preferredModality = appointment?.preferredModality;
  const { reasonForAppointment, patientComments } = appointment || {};

  let heading = 'We have received your request';
  if (isPendingAppointment && !showConfirmMsg)
    heading = 'Request for appointment';
  else if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled request for appointment';

  return (
    <PageLayout isDetailPage showNeedHelp>
      <DetailPageLayout heading={heading} data={appointment}>
        <Section heading="Preferred date and time">
          <ul className="usa-unstyled-list">
            {preferredDates.map((date, index) => (
              <li key={`${appointment.id}-option-${index}`}>{date}</li>
            ))}
          </ul>
        </Section>
        <Section heading="Type of care">
          {typeOfCareName || 'Type of care not noted'}
        </Section>
        <Section heading="How you prefer to attend">
          <span>{preferredModality}</span>
        </Section>
        <Section heading="Facility">
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
          {!!facility?.name && (
            <>
              {facility.name}
              <br />
            </>
          )}
          <Address address={facility?.address} />
          <div className="vads-u-margin-top--1 vads-u-color--link-default">
            <FacilityDirectionsLink location={facility} icon />
          </div>
        </Section>
        <Section heading="Phone">
          {facilityPhone && (
            <FacilityPhone heading="Phone:" contact={facilityPhone} icon />
          )}
          {!facilityPhone && <>Not available</>}
        </Section>
        <Details
          reason={reasonForAppointment}
          otherDetails={patientComments}
          request
        />
        <Section heading="Your contact details">
          <span data-dd-privacy="mask">Email: {email}</span>
          <br />
          <span>
            Phone number:{' '}
            <VaTelephone
              data-dd-privacy="mask"
              notClickable
              contact={phone}
              data-testid="patient-telephone"
            />
          </span>
          <br />
        </Section>
      </DetailPageLayout>
    </PageLayout>
  );
}
VARequestLayout.propTypes = {
  data: PropTypes.object.isRequired,
};
