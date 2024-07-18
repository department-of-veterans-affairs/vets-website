import React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual } from 'recompose';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import {
  selectModalityText,
  selectRequestedAppointmentData,
} from '../../appointment-list/redux/selectors';
import FacilityDirectionsLink from '../FacilityDirectionsLink';
import DetailPageLayout, { Section } from './DetailPageLayout';
import PageLayout from '../../appointment-list/components/PageLayout';
import Address from '../Address';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { TIME_TEXT } from '../../utils/appointment';
import FacilityPhone from '../FacilityPhone';

export default function VARequestLayout({ data: appointment }) {
  const { search } = useLocation();
  const {
    bookingNotes,
    email,
    facility,
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
  const modiality = selectModalityText(appointment, true);
  const [reason, otherDetails] = bookingNotes?.split(':') || [];

  let heading = 'We have received your request';
  if (isPendingAppointment && !showConfirmMsg)
    heading = 'Request for appointment';
  else if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled request for appointment';

  return (
    <PageLayout showNeedHelp>
      <DetailPageLayout heading={heading} data={appointment}>
        <Section heading="Preferred date and time">
          <ul className="usa-unstyled-list">
            {preferredDates.map((option, optionIndex) => (
              <li key={`${appointment.id}-option-${optionIndex}`}>
                {moment(option.start).format('ddd, MMMM D, YYYY')}{' '}
                {moment(option.start).hour() < 12 ? TIME_TEXT.AM : TIME_TEXT.PM}
              </li>
            ))}
          </ul>
        </Section>
        <Section heading="Type of care">
          {typeOfCareName || 'Type of care not noted'}
        </Section>
        <Section heading="How you prefer to attend">
          <span>{modiality}</span>
        </Section>
        <Section heading="Facility">
          {!!facility?.name && (
            <>
              {facility.name}
              <br />
            </>
          )}
          <Address address={facility?.address} />
          <div className="vads-u-margin-top--1 vads-u-color--link-default">
            <va-icon icon="directions" size="3" srtext="Directions icon" />{' '}
            <FacilityDirectionsLink location={facility} />
          </div>
        </Section>
        <Section heading="Phone">
          <div className="vads-u-margin-top--1 vads-u-color--link-default">
            {facilityPhone && (
              <FacilityPhone heading="Phone:" contact={facilityPhone} icon />
            )}
            {!facilityPhone && <>Not available</>}
          </div>
        </Section>
        <Section heading="Details you’d like to share with your provider">
          <span>
            Reason:{' '}
            {`${reason && reason !== 'none' ? reason : 'Not available'}`}
          </span>
          <br />
          <span>Other details: {`${otherDetails || 'Not available'}`}</span>
        </Section>
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
