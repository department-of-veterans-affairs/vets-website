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
import { buildDateFormatter } from '../../utils/helpers';
import ClaimCard from '../ClaimCard';

const capitalizeWord = word => {
  const capFirstLetter = word[0].toUpperCase();
  return `${capFirstLetter}${word.slice(1)}`;
};

const formatDate = buildDateFormatter('MMMM d, yyyy');

export default function AppealListItem({ appeal, name }) {
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

  let appealTitle = getTypeName(appeal);
  let updatedOn = '';

  if (programArea) {
    if (isAppeal) {
      appealTitle = `${programArea} ${appealTitle}`;
    } else {
      appealTitle += ` for ${programArea}`;
    }
  }

  appealTitle = capitalizeWord(appealTitle);
  updatedOn = formatDate(updatedEventDateString);

  const ariaLabel = `View details for ${appealTitle}`;
  const href = `appeals/${appeal.id}/status`;

  return (
    <ClaimCard
      title={appealTitle}
      subtitle={
        requestEvent &&
        `Received on ${moment(requestEvent.date).format('MMMM D, YYYY')}`
      }
    >
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
      <ClaimCard.Link ariaLabel={ariaLabel} href={href} />
    </ClaimCard>
  );
}

AppealListItem.propTypes = {
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
  name: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
  }),
};
