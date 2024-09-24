import React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual } from 'recompose';
import { useSelector } from 'react-redux';
import DetailPageLayout, {
  Section,
  What,
  When,
  Prepare,
} from './DetailPageLayout';
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

export default function CCLayout({ data: appointment }) {
  const {
    comment,
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
  const [reason, otherDetails] = comment ? comment?.split(':') : [];

  let heading = 'Community care appointment';
  if (isPastAppointment) heading = 'Past community care appointment';
  else if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled community care appointment';
  else heading = 'Community care appointment';

  return (
    <>
      <DetailPageLayout heading={heading} data={appointment}>
        <When>
          <AppointmentDate date={startDate} />
          <br />
          <AppointmentTime appointment={appointment} />
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
        <What>{typeOfCareName}</What>
        <Section heading="Provider">
          <span>
            {`${providerName || 'Provider information not available'}`}
          </span>
          <br />
          <span>
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
              <FacilityPhone heading="Phone:" contact={ccProvider.phone} />
            </>
          )}
        </Section>
        <Section heading="Details you shared with your provider">
          <span>
            Reason:{' '}
            {`${reason && reason !== 'none' ? reason : 'Not available'}`}
          </span>
          <br />
          <span className="vaos-u-word-break--break-word">
            Other details: {`${otherDetails || 'Not available'}`}
          </span>
        </Section>
        {!isPastAppointment &&
          (APPOINTMENT_STATUS.booked === status ||
            APPOINTMENT_STATUS.cancelled === status) && (
            <Prepare>
              <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
                Bring your insurance cards. And bring a list of your medications
                and other information to share with your provider.
              </p>
              <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
                <va-link
                  text="Find a full list of things to bring to your appointment"
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
