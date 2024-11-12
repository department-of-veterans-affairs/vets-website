import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { shallowEqual } from 'recompose';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import ListBestTimeToCall from '../../../components/ListBestTimeToCall';
import { selectRequestedAppointmentData } from '../../../redux/selectors';
import PageLayout from '../../PageLayout';
import DetailPageLayout, { CCDetails, Section } from './DetailPageLayout';

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
        <Section heading="Scheduling facility">
          {APPOINTMENT_STATUS.cancelled !== status && (
            <span>
              This facility will contact you if we need more information about
              your request.
              <br />
              <br />
            </span>
          )}
          {facilityName}
        </Section>
        <Section heading="Preferred community care provider">
          <span>{`${providerName || 'Provider name not available'}`}</span>
          <br />
          <span>
            {`${treatmentSpecialty || 'Treatment specialty not available'}`}
          </span>
          <br />
          {providerAddress && <span>{providerAddress.line[0]}</span>}
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
