import React from 'react';

import { sentenceCase } from '../../../../utils/formatters';
import { isVideoAppointment } from '../../../../services/appointment';

export default function AppointmentRequestListItem({
  appointment,
  facility,
  index,
}) {
  const isCC = appointment.vaos.isCommunityCare;
  const isVideoRequest = isVideoAppointment(appointment);

  const typeOfCareText = sentenceCase(appointment.type?.coding?.[0]?.display);

  return (
    <li
      aria-labelledby={`card-${index} card-${index}-status`}
      data-request-id={appointment.id}
      className="vads-u-margin-bottom--1p5 vads-u-padding--2p5 vads-u-background-color--gray-lightest"
      data-is-cancelable={!isCC && !isVideoRequest ? 'true' : 'false'}
      style={{ borderRadius: '15px' }}
    >
      <div className="vads-u-display--flex">
        <div className="vads-u-flex--1">
          {appointment.status === 'cancelled' && (
            <span className="vads-u-color--secondary vads-u-font-weight--bold">
              CANCELLED
            </span>
          )}
          <h3
            id={`card-${index}`}
            className="vads-u-font-size--h3 vads-u-margin-y--0 vads-u-font-family--sans"
          >
            {typeOfCareText}
          </h3>
          <span>{facility?.name}</span>
        </div>

        <div className="vads-u-flex--auto" style={{ margin: 'auto' }}>
          <span className="fas fa-chevron-right vads-u-color--link-default" />
        </div>
      </div>
    </li>
  );
}
