import React from 'react';
import { Link } from 'react-router-dom';
import { sentenceCase } from '../../../utils/formatters';

export default function RequestListItem({ appointment, facility }) {
  const isCC = appointment.vaos.isCommunityCare;
  const typeOfCareText = sentenceCase(appointment.type?.coding?.[0]?.display);

  return (
    <li
      data-request-id={appointment.id}
      className="vaos-appts__card vads-u-display--flex vads-u-align-items--center"
    >
      <div className="vads-u-flex--1">
        <h4 className="vads-u-font-size--h4 vads-u-margin-x--0 vads-u-margin-y--0">
          {sentenceCase(typeOfCareText)}
        </h4>
        {!!facility && facility.name}
        {!facility && isCC && 'Community care'}
      </div>
      <div>
        <Link
          aria-hidden="true"
          to={`request/${appointment.id}`}
          className="vads-u-display--none medium-screen:vads-u-display--inline"
        >
          Details
        </Link>
        <Link
          to={`request/${appointment.id}`}
          className="vaos-appts__card-link"
          aria-label={`Details for ${typeOfCareText} request`}
        >
          <i
            aria-hidden="true"
            className="fas fa-chevron-right vads-u-margin-left--1"
          />
        </Link>
      </div>
    </li>
  );
}
