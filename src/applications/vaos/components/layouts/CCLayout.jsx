import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import DetailPageLayout, {
  CCDetails,
  What,
  When,
  Prepare,
} from './DetailPageLayout';
import Section from '../Section';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { selectConfirmedAppointmentData } from '../../appointment-list/redux/selectors';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import AddToCalendarButton from '../AddToCalendarButton';
import FacilityDirectionsLink from '../FacilityDirectionsLink';
import FacilityPhone from '../FacilityPhone';
import Address from '../Address';
import {
  NULL_STATE_FIELD,
  captureMissingModalityLogs,
  recordAppointmentDetailsNullStates,
} from '../../utils/events';

export default function CCLayout({ data: appointment }) {
  const {
    facility,
    isPastAppointment,
    ccProvider,
    startDate,
    status,
    typeOfCareName,
  } = useSelector(
    state => selectConfirmedAppointmentData(state, appointment),
    shallowEqual,
  );

  if (!appointment) return null;

  const { address, providerName, treatmentSpecialty } = ccProvider;
  const { patientComments } = appointment || {};

  let heading = 'Community care appointment';
  if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled community care appointment';
  else if (isPastAppointment) heading = 'Past community care appointment';

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
    <>
      <DetailPageLayout heading={heading} data={appointment}>
        <When>
          <AppointmentDate date={startDate} timezone={appointment.timezone} />
          <br />
          <AppointmentTime
            appointment={appointment}
            timezone={appointment.timezone}
          />
          <br />
          {APPOINTMENT_STATUS.cancelled !== status &&
            !isPastAppointment && (
              <div className="vads-u-margin-top--2 vaos-hide-for-print">
                <AddToCalendarButton
                  appointment={appointment}
                  facility={facility}
                />
              </div>
            )}
        </When>
        <What>
          {typeOfCareName && (
            <span data-dd-privacy="mask">{typeOfCareName}</span>
          )}
        </What>
        <Section heading="Provider">
          <span data-dd-privacy="mask">
            {`${providerName || 'Provider information not available'}`}
          </span>
          <br />
          <span data-dd-privacy="mask">
            {`${treatmentSpecialty || 'Treatment specialty not available'}`}
          </span>
          <br />
          {address && (
            <>
              <Address address={address} />
              <div className="vads-u-margin-top--1 vads-u-color--link-default">
                <FacilityDirectionsLink location={{ address }} icon />
              </div>
            </>
          )}
          {!address && <span>Address not available</span>}
          {!!ccProvider && (
            <>
              <br />
              <FacilityPhone contact={ccProvider.phone} />
            </>
          )}
        </Section>
        <CCDetails otherDetails={patientComments} />
        {!isPastAppointment &&
          (APPOINTMENT_STATUS.booked === status ||
            APPOINTMENT_STATUS.cancelled === status) && (
            <Prepare>
              <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
                Bring your insurance cards, a list of your medications, and
                other things to share with your provider
              </p>
              <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
                <va-link
                  text="Find out what to bring to your appointment"
                  href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/"
                />
              </p>
            </Prepare>
          )}
        {APPOINTMENT_STATUS.booked === status &&
          !isPastAppointment && (
            <Section heading="Need to make changes?">
              <span>
                Contact this provider if you need to reschedule or cancel your
                appointment.
              </span>
            </Section>
          )}
      </DetailPageLayout>
    </>
  );
}
CCLayout.propTypes = {
  data: PropTypes.object.isRequired,
};
