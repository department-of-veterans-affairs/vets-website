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

const programAreaMap = {
  compensation: 'disability compensation',
  pension: 'pension',
  insurance: 'insurance',
  loan_guaranty: 'loan guaranty', // eslint-disable-line camelcase
  education: 'education',
  vre: 'vocational rehabilitation and employment',
  medical: 'health care',
  burial: 'burial benefits',
  fiduciary: 'fiduciary',
};

const capitalizeWord = word => {
  const capFirstLetter = word[0].toUpperCase();
  return `${capFirstLetter}${word.slice(1)}`;
};

// This component is also used by the personalization application, which will pass the external flag.

export default function AppealListItem({ appeal, name, external = false }) {
  let requestEventType;
  let isAppeal;

  switch (appeal.type) {
    case APPEAL_TYPES.legacy:
      requestEventType = EVENT_TYPES.nod;
      isAppeal = true;
      break;
    case APPEAL_TYPES.supplementalClaim:
      requestEventType = EVENT_TYPES.scRequest;
      isAppeal = false;
      break;
    case APPEAL_TYPES.higherLevelReview:
      requestEventType = EVENT_TYPES.hlrRequest;
      isAppeal = false;
      break;
    case APPEAL_TYPES.appeal:
      requestEventType = EVENT_TYPES.amaNod;
      isAppeal = true;
      break;
    default:
    // do nothing
  }

  const requestEvent = appeal.attributes.events.find(
    event => event.type === requestEventType,
  );
  const updatedEventDateString =
    appeal.attributes.events[appeal.attributes.events.length - 1].date;
  const programArea = programAreaMap[appeal.attributes.programArea];

  // appealTitle is in the format:
  // "Supplemental Claim for Disability Compensation Receieved March 6, 2019"
  //
  // If it's an appeal:
  // "Disability Compensation Appeal Receieved March 6, 2019"
  //
  // programArea or requestEvent might be missing:
  // "Appeal updated on March 6, 2019"
  // "Disability Compensation Appeal"

  let appealTitle = '';

  if (isAppeal) {
    if (programArea) {
      appealTitle = `${programArea} `;
    }
    appealTitle += getTypeName(appeal);
  } else {
    appealTitle = getTypeName(appeal);
    if (programArea) {
      appealTitle += ` for ${programArea}`;
    }
  }

  appealTitle += ` updated on ${moment(updatedEventDateString).format(
    'MMMM D, YYYY',
  )}`;
  appealTitle = capitalizeWord(appealTitle);

  return (
    <div className="claim-list-item-container">
      <h3 className="claim-list-item-header-v2">{appealTitle}</h3>
      <div className="card-status">
        {!external && (
          <div
            className={`status-circle ${
              appeal.attributes.active ? 'open' : 'closed'
            }`}
          />
        )}
        <p>
          <strong>Status:</strong> {getStatusContents(appeal, name).title}
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
      {requestEvent && (
        <div className="card-status">
          <p>
            <strong>Submitted on:</strong>{' '}
            {moment(requestEvent.date).format('MMMM D, YYYY')}
          </p>
        </div>
      )}
      {!external && (
        <Link
          className="usa-button usa-button-primary"
          to={`appeals/${appeal.id}/status`}
        >
          View details
          <i className="fa fa-chevron-right" />
        </Link>
      )}
      {external && (
        <Link
          aria-label={`View details of ${appealTitle} `}
          className="usa-button usa-button-primary"
          href={`/track-claims/appeals/${appeal.id}/status`}
        >
          View details
          <i className="fa fa-chevron-right" />
        </Link>
      )}
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
  external: PropTypes.bool,
};
