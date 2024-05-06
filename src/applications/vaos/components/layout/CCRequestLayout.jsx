import React from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { shallowEqual } from 'recompose';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { useHistory } from 'react-router-dom';
import { selectRequestedAppointmentDetails } from '../../appointment-list/redux/selectors';
import DetailPageLayout, { Section } from './DetailPageLayout';
import ListBestTimeToCall from '../../appointment-list/components/ListBestTimeToCall';
import { TIME_TEXT } from '../../utils/appointment';
import InfoAlert from '../InfoAlert';
import { GA_PREFIX } from '../../utils/constants';
import getNewAppointmentFlow from '../../new-appointment/newAppointmentFlow';
import { startNewAppointmentFlow } from '../../new-appointment/redux/actions';
import PageLayout from '../../appointment-list/components/PageLayout';

function handleClick(history, dispatch, typeOfCare) {
  return () => {
    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
    history.push(typeOfCare.url);
  };
}

export function CCRequestLayout() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    comment,
    email,
    phone,
    preferredDates,
    preferredLanguage,
    preferredTimesForPhoneCall,
    provider,
    providerAddress,
    typeOfCareName,
  } = useSelector(
    state => selectRequestedAppointmentDetails(state, id),
    shallowEqual,
  );
  const { root, typeOfCare } = useSelector(getNewAppointmentFlow);

  const { providerName, treatmentSpecialty } = provider;
  // There is no reason for appointment for CC appointment request.
  // const [reason, otherDetails] = comment?.split(':') || [];
  const reason = null;
  const otherDetails = comment;

  return (
    <PageLayout showNeedHelp>
      <DetailPageLayout header="We have received your request">
        <InfoAlert backgroundOnly status="success">
          <p>
            We’ll try to schedule your appointment in the next 2 business days.
            Check back here or call your facility for updates. Review your
            appointments Schedule a new appointment
          </p>
          <div className="vads-u-margin-y--1">
            <va-link
              text="Review your appointments"
              data-testid="review-appointments-link"
              href={root.url}
              onClick={() =>
                recordEvent({
                  event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
                })
              }
            />
          </div>
          <div>
            <va-link
              text="Schedule a new appointment"
              data-testid="schedule-appointment-link"
              onClick={handleClick(history, dispatch, typeOfCare)}
            />
          </div>
        </InfoAlert>
        <Section heading="Preferred date and time">
          <ul className="usa-unstyled-list">
            {preferredDates.map((option, optionIndex) => (
              <li key={`${id}-option-${optionIndex}`}>
                {moment(option.start).format('ddd, MMMM D, YYYY')}{' '}
                {moment(option.start).hour() < 12 ? TIME_TEXT.AM : TIME_TEXT.PM}
              </li>
            ))}
          </ul>
        </Section>
        <Section heading="Type of care">
          {typeOfCareName || 'Type of care not noted'}
        </Section>
        <Section heading="Scheduling facility">
          <span>
            This facility will contact you if we need more information about
            your request.
          </span>
        </Section>
        <Section heading="Preferred community care provider">
          <span>{`${providerName || 'Provider name not noted'}`}</span>
          <br />
          <span>
            {`${treatmentSpecialty || 'Treatment specialty not noted'}`}
          </span>
          <br />
          {providerAddress && <span>{providerAddress.line[0]}</span>}
          {!providerAddress && <span>Address not noted</span>}
          <br />
        </Section>
        <Section heading="Language you’d prefer the provider speak">
          {preferredLanguage}
        </Section>
        <Section heading="Details you’d like to shared with your provider">
          <span>
            Reason: {`${reason && reason !== 'none' ? reason : 'Not noted'}`}
          </span>
          <br />
          <span>Other details: {`${otherDetails || 'Not noted'}`}</span>
        </Section>
        <Section heading="Your contact details">
          <span data-dd-privacy="mask">Email: {email}</span>
          <br />
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
