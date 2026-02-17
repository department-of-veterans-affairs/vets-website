import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector, shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getRealFacilityId } from '../../utils/appointment';
import { selectRequestedAppointmentData } from '../../appointment-list/redux/selectors';
import FacilityDirectionsLink from '../FacilityDirectionsLink';
import DetailPageLayout, { Details } from './DetailPageLayout';
import Section from '../Section';
import PageLayout from '../../appointment-list/components/PageLayout';
import Address from '../Address';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import FacilityPhone from '../FacilityPhone';
import NewTabAnchor from '../NewTabAnchor';
import {
  NULL_STATE_FIELD,
  recordAppointmentDetailsNullStates,
  captureMissingModalityLogs,
} from '../../utils/events';

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
  const { patientComments } = appointment || {};

  let heading = 'We have received your request';
  if (isPendingAppointment && !showConfirmMsg)
    heading = 'Request for appointment';
  else if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled request for appointment';

  if (!appointment.modality) {
    captureMissingModalityLogs(appointment);
  }
  recordAppointmentDetailsNullStates(
    {
      type: appointment.type,
      modality: appointment.modality,
      isCerner: appointment.vaos.isCerner,
    },
    {
      [NULL_STATE_FIELD.TYPE_OF_CARE]: !typeOfCareName,
      [NULL_STATE_FIELD.FACILITY_ID]: !facilityId,
      [NULL_STATE_FIELD.FACILITY_DETAILS]: !facility,
      [NULL_STATE_FIELD.FACILITY_PHONE]: !facilityPhone,
    },
  );

  return (
    <PageLayout showNeedHelp>
      <DetailPageLayout
        heading={heading}
        data={appointment}
        facility={facility}
      >
        <Section heading="Preferred date and time">
          <ul
            className={classNames({
              'usa-unstyled-list': preferredDates.length === 1,
            })}
          >
            {preferredDates.map((date, index) => (
              <li key={`${appointment.id}-option-${index}`}>
                <span data-dd-privacy="mask">{date}</span>
              </li>
            ))}
          </ul>
        </Section>
        <Section heading="Type of care">
          <span data-dd-privacy="mask">
            {typeOfCareName || 'Type of care not noted'}
          </span>
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
              <a href={facility.website}>{facility.name}</a>
              <br />
            </>
          )}
          <Address address={facility?.address} />
          <div className="vads-u-margin-top--1 vads-u-color--link-default">
            <FacilityDirectionsLink location={facility} icon />
          </div>
        </Section>
        <Section heading="Phone">
          {facilityPhone && <FacilityPhone contact={facilityPhone} icon />}
          {!facilityPhone && <>Not available</>}
        </Section>
        <Details otherDetails={patientComments} request />
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
