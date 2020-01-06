import React from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import FacilityAddress from './FacilityAddress';
import { PURPOSE_TEXT } from '../utils/constants';

export default function ConfirmationDirectScheduleInfo({
  data,
  facilityDetails,
  clinic,
}) {
  return (
    <div>
      <h1 className="vads-u-font-size--h2">
        Your appointment has been scheduled
      </h1>
      <AlertBox status="success">
        <strong>Your appointment is confirmed.</strong> Please see your
        appointment details below.
      </AlertBox>
      <div className="vaos-appts__list-item vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-y--3 vads-u-border-top--4px vads-u-border-color--green">
        <div className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
          VA Appointment
        </div>
        <h2 className="vaos-appts__date-time vads-u-font-size--lg vads-u-margin-x--0">
          {moment(data.calendarData.selectedDates[0].datetime).format(
            'MMMM D, YYYY [at] hh:mm a',
          )}{' '}
        </h2>
        <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-margin-top--2">
          <div className="vaos-appts__status vads-u-flex--1">
            <i className="fas fa-check-circle" />
            <span className="vads-u-font-weight--bold vads-u-margin-left--1 vads-u-display--inline-block">
              Confirmed
              <span className="sr-only"> appointment</span>
            </span>
          </div>
        </div>

        <div className="vaos-appts__split-section vads-u-margin-top--2">
          <div className="vads-u-flex--1">
            <dl className="vads-u-margin--0">
              <dt className="vads-u-font-weight--bold">
                {clinic?.clinicFriendlyLocationName || clinic?.clinicName}
              </dt>
              <dd>
                {!!facilityDetails && (
                  <>
                    {facilityDetails.name}
                    <br />
                    <FacilityAddress facility={facilityDetails} />
                  </>
                )}
              </dd>
            </dl>
          </div>
          <div className="vads-u-flex--1">
            <dl className="vads-u-margin--0">
              <dt className="vads-u-font-weight--bold">
                {
                  PURPOSE_TEXT.find(
                    purpose => purpose.id === data.reasonForAppointment,
                  )?.short
                }
              </dt>
              <dd>{data.reasonAdditionalInfo}</dd>
            </dl>
          </div>
        </div>
        <div className="vads-u-margin-top--2">
          <AdditionalInfo triggerText="Show more">
            <div className="vaos-appts__split-section">
              <div className="vaos_appts__message vads-u-flex--1" />
              <div className="vads-u-flex--1">
                <dl className="vads-u-margin--0">
                  <dt className="vads-u-font-weight--bold vads-u-display--block">
                    Your contact details
                  </dt>
                  <dd>
                    {data.email}
                    <br />
                    {data.phoneNumber}
                  </dd>
                </dl>
              </div>
            </div>
          </AdditionalInfo>
        </div>
      </div>
    </div>
  );
}
