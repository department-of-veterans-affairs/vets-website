import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector, shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectRequestedAppointmentData } from '../../appointment-list/redux/selectors';
import DetailPageLayout, { CCDetails } from './DetailPageLayout';
import Section from '../Section';
import ListBestTimeToCall from '../../appointment-list/components/ListBestTimeToCall';
import PageLayout from '../../appointment-list/components/PageLayout';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import {
  NULL_STATE_FIELD,
  captureMissingModalityLogs,
  recordAppointmentDetailsNullStates,
} from '../../utils/events';

export default function CCRequestLayout({ data: appointment }) {
  const { search } = useLocation();
  const {
    email,
    facility,
    isPendingAppointment,
    phone,
    preferredDates,
    preferredLanguage,
    preferredTimesForPhoneCall,
    provider,
    providerAddress,
    status,
    typeOfCareName,
  } = useSelector(
    state => selectRequestedAppointmentData(state, appointment),
    shallowEqual,
  );
  const { providerName, treatmentSpecialty } = provider || {};
  const { name: facilityName } = facility || {};
  const queryParams = new URLSearchParams(search);
  const showConfirmMsg = queryParams.get('confirmMsg');

  const { patientComments } = appointment;

  let heading = 'We have received your request';
  if (isPendingAppointment && !showConfirmMsg)
    heading = 'Request for community care appointment';
  else if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled request for community care appointment';

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
      [NULL_STATE_FIELD.PROVIDER]: !providerName,
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
        <Section heading="Scheduling facility">
          {APPOINTMENT_STATUS.cancelled !== status && (
            <span>
              This facility will contact you if we need more information about
              your request.
              <br />
              <br />
            </span>
          )}
          <span data-dd-privacy="mask">{facilityName}</span>
        </Section>
        <Section heading="Preferred community care provider">
          <span data-dd-privacy="mask">
            {`${providerName || 'Provider name not available'}`}
          </span>
          <br />
          <span data-dd-privacy="mask">
            {`${treatmentSpecialty || 'Treatment specialty not available'}`}
          </span>
          <br />
          {providerAddress && (
            <span data-dd-privacy="mask">{providerAddress.line[0]}</span>
          )}
          {!providerAddress && <span>Address not available</span>}
          <br />
        </Section>
        <Section heading="Language you’d prefer the provider speak">
          {preferredLanguage}
        </Section>
        <CCDetails otherDetails={patientComments} request />
        <Section heading="Your contact details">
          <span data-dd-privacy="mask">Email: {email}</span>
          <br />
          Phone number:{' '}
          <VaTelephone
            data-dd-privacy="mask"
            notClickable
            contact={phone}
            data-testid="patient-telephone"
          />
          <br />
          <ListBestTimeToCall timesToCall={preferredTimesForPhoneCall} />
          <br />
        </Section>
      </DetailPageLayout>
    </PageLayout>
  );
}
CCRequestLayout.propTypes = {
  data: PropTypes.object.isRequired,
};
