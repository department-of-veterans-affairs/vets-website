import React from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { shallowEqual } from 'recompose';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import {
  selectModalityText,
  selectRequestedAppointmentDetails,
} from '../../appointment-list/redux/selectors';
import FacilityDirectionsLink from '../FacilityDirectionsLink';
import DetailPageLayout, { Section } from './DetailPageLayout';
import PageLayout from '../../appointment-list/components/PageLayout';
import Address from '../Address';
import { GA_PREFIX } from '../../utils/constants';
import InfoAlert from '../InfoAlert';
import getNewAppointmentFlow from '../../new-appointment/newAppointmentFlow';
import { startNewAppointmentFlow } from '../../new-appointment/redux/actions';
import { TIME_TEXT } from '../../utils/appointment';
import FacilityPhone from '../FacilityPhone';

function handleClick(history, dispatch, typeOfCare) {
  return () => {
    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
    history.push(typeOfCare.url);
  };
}

export function VARequestLayout() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { root, typeOfCare } = useSelector(getNewAppointmentFlow);
  const {
    appointment,
    bookingNotes,
    email,
    facility,
    facilityPhone,
    phone,
    preferredDates,
    typeOfCareName,
  } = useSelector(
    state => selectRequestedAppointmentDetails(state, id),
    shallowEqual,
  );
  const modiality = selectModalityText(appointment, true);
  const [reason, otherDetails] = bookingNotes?.split(':') || [];

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
