import React from 'react';
import moment from 'moment';
import { getTypeOfCare } from '../utils/selectors';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { PURPOSE_TEXT } from '../utils/constants';

export default function ConfirmationDirectScheduleInfo({
  data,
  facility,
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
      <AlertBox backgroundOnly status="info">
        <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
          {moment(data.calendarData.selectedDates[0].datetime).format(
            'MMMM D, YYYY [at] hh:mm a',
          )}{' '}
        </h2>
        <hr />
        <h3 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-top--0 vads-u-margin-bottom--2">
          {getTypeOfCare(data)?.name} appointment
        </h3>
        <div className="vads-u-display--flex">
          <div className="vads-u-flex--1">
            <dl className="vads-u-margin-y--0">
              <dt>
                <strong>
                  {clinic?.clinicFriendlyLocationName || clinic?.clinicName}
                </strong>
              </dt>
              <dd>
                {facility?.institution.authoritativeName}
                <br />
                {facility?.institution.city},{' '}
                {facility?.institution.stateAbbrev}
              </dd>
              <dt>
                <strong>{PURPOSE_TEXT[data.reasonForAppointment]}</strong>
              </dt>
              <dd>{data.reasonAdditionalInfo}</dd>
            </dl>
          </div>
          <div className="vads-u-flex--1">
            <dl className="vads-u-margin-y--0">
              <dt>
                <strong>Your contact details</strong>
              </dt>
              <dd>
                {data.email}
                <br />
                {data.phoneNumber}
                <br />
              </dd>
            </dl>
          </div>
        </div>
      </AlertBox>
    </div>
  );
}
