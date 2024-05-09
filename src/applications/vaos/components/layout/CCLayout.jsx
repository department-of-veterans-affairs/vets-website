import React from 'react';
import { useParams } from 'react-router-dom';
import { shallowEqual } from 'recompose';
import { useSelector } from 'react-redux';
import DetailPageLayout, { Section, What, When } from './DetailPageLayout';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { getConfirmedAppointmentDetailsInfo } from '../../appointment-list/redux/selectors';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import AddToCalendarButton from '../AddToCalendarButton';
import StatusAlert from '../StatusAlert';
import FacilityDirectionsLink from '../FacilityDirectionsLink';

export default function CCLayout() {
  const { id } = useParams();
  const {
    appointment,
    comment,
    facility,
    isPastAppointment,
    provider,
    providerAddress,
    startDate,
    status,
    typeOfCareName,
  } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );
  const { providerName, treatmentSpecialty } = provider;
  const [reason, otherDetails] = comment ? comment?.split(':') : [];

  let heading = 'Community care appointment';
  if (isPastAppointment) heading = 'Past community care appointment';
  else if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled community care appointment';
  else heading = 'Community care appointment';

  return (
    <>
      <DetailPageLayout heading={heading}>
        <StatusAlert appointment={appointment} facility={facility} />
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
        <What>{typeOfCareName || 'Type of care not noted'}</What>
        <Section heading="Provider">
          <span>{`${providerName || 'Provider name not noted'}`}</span>
          <br />
          <span>
            {`${treatmentSpecialty || 'Treatment specialty not noted'}`}
          </span>
          <br />
          {providerAddress && (
            <>
              <span>{providerAddress.line[0]}</span>
              <div className="vads-u-margin-top--1 vads-u-color--link-default">
                <va-icon icon="directions" size="3" srtext="Directions icon" />{' '}
                <FacilityDirectionsLink location={providerAddress} />
              </div>
            </>
          )}
          {!providerAddress && <span>Address not noted</span>}
        </Section>
        <Section heading="Details you shared with your provider">
          <span>
            Reason: {`${reason && reason !== 'none' ? reason : 'Not noted'}`}
          </span>
          <br />
          <span>Other details: {`${otherDetails || 'Not noted'}`}</span>
        </Section>
        <Section heading="Need to make changes?">
          <span>
            Contact this provider if you need to reschedule or cancel your
            appointment.
          </span>
        </Section>
      </DetailPageLayout>
    </>
  );
}
