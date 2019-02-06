import { Link } from 'react-router';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import {
  APPEAL_TYPES,
  EVENT_TYPES,
  getTypeName,
  getStatusContents,
} from '../../utils/appeals-v2-helpers';

const appealTypeMap = {
  compensation: 'Disability Compensation',
  pension: 'Pension',
  insurance: 'Insurance',
  loan_guaranty: 'Loan Guaranty', // eslint-disable-line
  education: 'Education',
  vre: 'Vocational Rehabilitation and Employment',
  medical: 'Medical Benefits',
  burial: 'Burial Benefits',
  fiduciary: 'Fiduciary',
};

export default function AppealListItem({ appeal, name }) {
  const { status } = appeal.attributes;

  let requestEventType;
  switch (appeal.type) {
    case APPEAL_TYPES.legacy:
      requestEventType = EVENT_TYPES.nod;
      break;
    case APPEAL_TYPES.supplementalClaim:
      requestEventType = EVENT_TYPES.scRequest;
      break;
    case APPEAL_TYPES.higherLevelReview:
      requestEventType = EVENT_TYPES.hlrRequest;
      break;
    case APPEAL_TYPES.appeal:
      requestEventType = EVENT_TYPES.amaNod;
      break;
    default:
    // do nothing
  }

  const requestEvent = appeal.attributes.events.find(
    a => a.type === requestEventType,
  );
  const appealType = appealTypeMap[appeal.attributes.programArea];
  const isAppeal =
    appeal.type === APPEAL_TYPES.appeal || appeal.type === APPEAL_TYPES.legacy;

  let appealTitle = '';

  if (isAppeal) {
    if (appealType) {
      appealTitle = `${appealType} `;
    }
    appealTitle += getTypeName(appeal);
  } else {
    appealTitle = getTypeName(appeal);
    if (appealType) {
      appealTitle += ` for ${appealType}`;
    }
  }

  if (requestEvent) {
    appealTitle += ` Received ${moment(requestEvent.date).format(
      'MMMM D, YYYY',
    )}`;
  }

  return (
    <div className="claim-list-item-container">
      <h3 className="claim-list-item-header-v2">{appealTitle}</h3>
      <div className="card-status">
        <div
          className={`status-circle ${
            appeal.attributes.active ? 'open' : 'closed'
          }`}
        />
        <p>
          <strong>Status:</strong>{' '}
          {getStatusContents(status.type, status.details, name).title}
        </p>
      </div>
      {appeal.attributes.description && (
        <p style={{ marginTop: 0 }}>
          <strong>
            {appeal.attributes.issues.length === 1 ? 'Issue' : 'Issues'} on
            {isAppeal ? ' appeal' : ' review'}:
          </strong>{' '}
          {appeal.attributes.description}
        </p>
      )}
      <Link
        className="usa-button usa-button-primary"
        to={`appeals/${appeal.id}/status`}
      >
        View status
        <i className="fa fa-chevron-right" />
      </Link>
    </div>
  );
}

AppealListItem.propTypes = {
  appeal: PropTypes.shape({
    attributes: PropTypes.shape({
      status: PropTypes.shape({
        type: PropTypes.string.isRequired,
        details: PropTypes.object,
      }).isRequired,
      events: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          date: PropTypes.string.isRequired,
        }),
      ),
      programArea: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
      issues: PropTypes.array.isRequired,
      description: PropTypes.string.isRequired,
    }),
  }),
  name: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
  }),
};
