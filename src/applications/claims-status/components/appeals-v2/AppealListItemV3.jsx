import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import {
  APPEAL_TYPES,
  EVENT_TYPES,
  getTypeName,
  getStatusContents,
  programAreaMap,
} from '../../utils/appeals-v2-helpers';

const capitalizeWord = word => {
  const capFirstLetter = word[0].toUpperCase();
  return `${capFirstLetter}${word.slice(1)}`;
};

// This component is also used by the personalization application, which will pass the external flag.

export default function AppealListItemV3({ appeal, name, external = false }) {
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
  let updatedOn = '';

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

  appealTitle = capitalizeWord(appealTitle);
  updatedOn = moment(updatedEventDateString).format('MMMM D, YYYY');

  return (
    <va-card class="claim-list-item-container">
      <h3 className="claim-list-item-header vads-u-margin-bottom--2">
        {/* eslint-disable-next-line jsx-a11y/aria-role */}
        <span role="text">
          {appealTitle}
          {requestEvent && (
            <span className="submitted-on">
              Submitted on {moment(requestEvent.date).format('MMMM D, YYYY')}
            </span>
          )}
        </span>
      </h3>
      <div className="card-status">
        {appeal.attributes.description && (
          <p>
            {appeal.attributes.issues.length === 1 ? 'Issue' : 'Issues'} on
            {isAppeal ? ' appeal' : ' review'}: {appeal.attributes.description}
          </p>
        )}
        <p>Status: {getStatusContents(appeal, name).title}</p>
        <p>Last updated: {updatedOn}</p>
      </div>
      {!external && (
        <va-link
          active
          aria-label={`View details for ${appealTitle}`}
          href={`appeals/${appeal.id}/status`}
          text="View details"
          class="vads-u-margin-top--3 vads-u-display--block"
        />
      )}
      {external && (
        <va-link
          active
          aria-label={`View details for ${appealTitle}`}
          href={`/track-claims/appeals/${appeal.id}/status`}
          text="View details"
          class="vads-u-margin-top--3 vads-u-display--block"
        />
      )}
    </va-card>
  );
}

AppealListItemV3.propTypes = {
  appeal: PropTypes.shape({
    id: PropTypes.string,
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
    type: PropTypes.string,
  }),
  external: PropTypes.bool,
  name: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
  }),
};
