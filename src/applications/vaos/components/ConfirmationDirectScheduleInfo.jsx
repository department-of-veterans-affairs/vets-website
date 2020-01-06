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
      <div className="vads-u-border-top--4px vads-u-border-color--green">
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
            {canceled ? (
              <i className="fas fa-exclamation-circle" />
            ) : (
              <i className="fas fa-check-circle" />
            )}
            <span
              id={`card-${index}`}
              className="vads-u-font-weight--bold vads-u-margin-left--1 vads-u-display--inline-block"
            >
              {canceled ? 'Canceled' : 'Confirmed'}
              <span className="sr-only"> appointment</span>
            </span>
          </div>
        </div>

        <div className="vaos-appts__split-section vads-u-margin-top--2">
          <div className="vads-u-flex--1">
            {isVideoVisit(appointment) ? (
              <VideoVisitSection appointment={appointment} />
            ) : (
              <dl className="vads-u-margin--0">
                <dt className="vads-u-font-weight--bold">
                  {getLocationHeader(appointment)}
                </dt>
                <dd>{getAppointmentLocation(appointment, facility)}</dd>
              </dl>
            )}
          </div>
          {hasInstructions(appointment) && (
            <div className="vads-u-flex--1">
              <dl className="vads-u-margin--0">
                <dt className="vads-u-font-weight--bold">
                  {getAppointmentInstructionsHeader(appointment)}
                </dt>
                <dd>{getAppointmentInstructions(appointment)}</dd>
              </dl>
            </div>
          )}
        </div>

      </div>
      <AlertBox backgroundOnly status="info">
        <div className="vads-u-display--flex">
          <div className="vads-u-flex--1">
            <dl className="vads-u-margin-y--0">
              <dt>
                <strong>
                  {clinic?.clinicFriendlyLocationName || clinic?.clinicName}
                </strong>
              </dt>
              <dd>
                {facility?.authoritativeName}
                <br />
                {facility?.city}, {facility?.stateAbbrev}
              </dd>
              <dt>
                <strong>
                  {
                    PURPOSE_TEXT.find(
                      purpose => purpose.id === data.reasonForAppointment,
                    )?.short
                  }
                </strong>
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
