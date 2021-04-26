import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { sentenceCase } from '../../../utils/formatters';
import { getPreferredCommunityCareProviderName } from '../../../services/appointment';
import { APPOINTMENT_STATUS } from '../../../utils/constants';
import moment from 'moment';

export default function RequestListItem({ appointment, facility }) {
  const history = useHistory();
  const isCC = appointment.vaos.isCommunityCare;
  const typeOfCareText = sentenceCase(appointment.type?.coding?.[0]?.display);
  const ccFacilityName = getPreferredCommunityCareProviderName(appointment);
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const preferredDate = moment(appointment.requestedPeriod[0].start).format(
    'MMMM D, YYYY',
  );
  const link = `requests/${appointment.id}`;

  return (
    <li
      data-request-id={appointment.id}
      className="vaos-appts__card vaos-appts__card--clickable"
      data-cy="requested-appointment-list-item"
    >
      <div
        className="vads-u-padding--2 medium-screen:vads-u-padding--3 medium-screen:vads-u-margin-bottom--3 vads-u-display--flex vads-u-align-items--center"
        onClick={() =>
          !window.getSelection().toString() ? history.push(link) : null
        }
      >
        <div className="vads-u-flex--1">
          {canceled && (
            <span className="vads-u-display--block vaos-u-text-transform--uppercase vads-u-color--secondary-dark vads-u-font-weight--bold">
              Canceled
            </span>
          )}
          <h3 className="vads-u-font-size--h4 vads-u-margin-x--0 vads-u-margin-y--0">
            {sentenceCase(typeOfCareText)}
          </h3>
          {!!facility && !isCC && facility.name}
          {isCC && ccFacilityName}
        </div>
        {/* visible to medium screen and larger */}
        <div className="vads-u-display--none medium-screen:vads-u-display--inline">
          <Link
            aria-label={`Details for ${
              canceled ? 'canceled ' : ''
            }${typeOfCareText}request for ${preferredDate}`}
            to={link}
            onClick={e => e.preventDefault()}
          >
            Details
          </Link>
          <i
            aria-hidden="true"
            className="fas fa-chevron-right vads-u-margin-left--1"
          />
        </div>
        {/* visible to small screen breakpoint */}
        <div className="medium-screen:vads-u-display--none">
          <Link
            to={link}
            onClick={e => e.preventDefault()}
            className="vaos-appts__card-link"
            aria-label={`Details for ${
              canceled ? 'canceled ' : ''
            }${typeOfCareText}request for ${preferredDate}`}
          >
            <i
              aria-hidden="true"
              className="fas fa-chevron-right vads-u-margin-left--1"
            />
          </Link>
        </div>
      </div>
    </li>
  );
}
