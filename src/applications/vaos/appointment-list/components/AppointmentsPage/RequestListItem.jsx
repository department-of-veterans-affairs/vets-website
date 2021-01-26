import React from 'react';
import { Link } from 'react-router-dom';
import { sentenceCase } from '../../../utils/formatters';
import { getPractitionerLocationDisplay } from '../../../services/appointment';

export default function RequestListItem({ appointment, facility }) {
  const isCC = appointment.vaos.isCommunityCare;
  const typeOfCareText = sentenceCase(appointment.type?.coding?.[0]?.display);
  const ccFacilityName = getPractitionerLocationDisplay(appointment);

  return (
    <li
      data-request-id={appointment.id}
      className="vaos-appts__card vads-u-display--flex vads-u-align-items--center"
    >
      <div className="vads-u-flex--1">
        <h4 className="vads-u-font-size--h4 vads-u-margin-x--0 vads-u-margin-y--0">
          {sentenceCase(typeOfCareText)}
        </h4>
        {!!facility && !isCC && facility.name}
        {isCC && !!ccFacilityName && ccFacilityName}
        {isCC && !ccFacilityName && 'Community care'}
      </div>
      <div>
        <Link
          aria-hidden="true"
          to={`requests/${appointment.id}`}
          className="vads-u-display--none medium-screen:vads-u-display--inline"
        >
          Details
        </Link>
        <Link
          to={`requests/${appointment.id}`}
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
