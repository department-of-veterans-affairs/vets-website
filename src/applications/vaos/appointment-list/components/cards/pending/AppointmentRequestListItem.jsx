import React, { useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import ListBestTimeToCall from './ListBestTimeToCall';
import { sentenceCase } from '../../../../utils/formatters';
import { getPatientTelecom } from '../../../../services/appointment';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import AppointmentStatus from '../AppointmentStatus';
import VAFacilityLocation from '../../../../components/VAFacilityLocation';
import AppointmentRequestCommunityCareLocation from './AppointmentRequestCommunityCareLocation';
import AdditionalInfoRow from '../AdditionalInfoRow';

const TIME_TEXT = {
  AM: 'in the morning',
  PM: 'in the afternoon',
  'No Time Selected': '',
};

export default function AppointmentRequestListItem({
  appointment,
  cancelAppointment,
  facility,
  facilityId,
  fetchMessages,
  index,
  messages,
  showCancelButton,
}) {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    if (
      !showMore &&
      !messages[appointment.id] &&
      !appointment.vaos.isExpressCare
    ) {
      fetchMessages(appointment.id);
    }

    setShowMore(!showMore);
  };

  const isCC = appointment.vaos.isCommunityCare;
  const isExpressCare = appointment.vaos.isExpressCare;
  const isVideoRequest = appointment.vaos.isVideo;
  const cancelled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const firstMessage = messages?.[appointment.id]?.[0]?.attributes?.messageText;

  const itemClasses = classNames(
    'vaos-appts__list-item vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-bottom--3',
    {
      'vads-u-border-top--4px': true,
      'vads-u-border-color--warning-message': !cancelled,
      'vads-u-border-color--secondary-dark': cancelled,
    },
  );
  const typeOfCareText = sentenceCase(appointment.type?.coding?.[0]?.display);

  return (
    <li
      aria-labelledby={`card-${index} card-${index}-status`}
      data-request-id={appointment.id}
      className={itemClasses}
      data-is-cancelable={!isCC && !isVideoRequest ? 'true' : 'false'}
    >
      <div className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
        {isCC && 'Community Care'}
        {!isCC && !!isVideoRequest && 'VA Video Connect'}
        {!isCC && !isVideoRequest && 'VA Appointment'}
      </div>
      <h3
        id={`card-${index}`}
        className="vads-u-font-size--h3 vads-u-margin-y--0"
      >
        {typeOfCareText} appointment
      </h3>
      <AppointmentStatus status={appointment.status} index={index} />
      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-right--1 vaos-u-word-break--break-word">
          {isCC && (
            <AppointmentRequestCommunityCareLocation
              appointment={appointment}
            />
          )}
          {isExpressCare && facility?.name}
          {!isCC &&
            !isExpressCare && (
              <VAFacilityLocation
                facility={facility}
                facilityName={facility?.name}
                facilityId={facilityId}
              />
            )}
        </div>
        {!isExpressCare && (
          <div className="vads-u-flex--1 vaos-u-word-break--break-word">
            <h4 className="vaos-appts__block-label">Preferred date and time</h4>
            <div>
              <ul className="usa-unstyled-list">
                {appointment.requestedPeriod.map((option, optionIndex) => (
                  <li key={`${appointment.id}-option-${optionIndex}`}>
                    {moment(option.start).format('ddd, MMMM D, YYYY')}{' '}
                    {option.start.includes('00:00:00')
                      ? TIME_TEXT.AM
                      : TIME_TEXT.PM}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="vads-u-margin-top--2 vads-u-display--flex vads-u-flex-wrap--wrap">
        <AdditionalInfoRow
          id={appointment.id}
          open={showMore}
          triggerText={showMore ? 'Show less' : 'Show more'}
          onClick={toggleShowMore}
        >
          <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
            <div className="vaos_appts__message vads-u-flex--1 vads-u-margin-right--1 vaos-u-word-break--break-word">
              {isExpressCare && (
                <>
                  <h4 className="vaos-appts__block-label">
                    Reason for appointment
                  </h4>
                  <div>{appointment.reason}</div>
                </>
              )}
              {!isExpressCare && (
                <>
                  <h4 className="vaos-appts__block-label">
                    {appointment.reason}
                  </h4>
                  <div>{firstMessage}</div>
                </>
              )}
            </div>
            <div className="vads-u-flex--1 vads-u-margin-top--2 small-screen:vads-u-margin-top--0 vaos-u-word-break--break-word">
              <h4 className="vaos-appts__block-label">Your contact details</h4>
              <div>
                {getPatientTelecom(appointment, 'email')}
                <br />
                {getPatientTelecom(appointment, 'phone')}
                <br />
                <span className="vads-u-font-style--italic">
                  <ListBestTimeToCall
                    timesToCall={appointment.legacyVAR?.bestTimeToCall}
                  />
                </span>
              </div>
            </div>
          </div>
        </AdditionalInfoRow>
        {showCancelButton &&
          appointment.status === APPOINTMENT_STATUS.proposed && (
            <button
              className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0"
              onClick={() => cancelAppointment(appointment)}
              aria-label={`Cancel request for ${typeOfCareText}`}
            >
              Cancel request
            </button>
          )}
        <div className="vaos-flex-break" />
      </div>
    </li>
  );
}
