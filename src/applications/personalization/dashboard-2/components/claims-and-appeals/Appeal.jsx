import React from 'react';
import moment from 'moment';

import {
  APPEAL_TYPES,
  EVENT_TYPES,
  getTypeName,
  getStatusContents,
  programAreaMap,
} from '~/applications/claims-status/utils/appeals-v2-helpers';

const capitalizeFirstLetter = input => {
  const capitalizedFirstLetter = input[0].toUpperCase();
  return `${capitalizedFirstLetter}${input.slice(1)}`;
};

const Appeal = ({ appeal, name }) => {
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
  }

  const requestEvent = appeal.attributes.events.find(
    event => event.type === requestEventType,
  );
  const updatedEventDateString =
    appeal.attributes.events[appeal.attributes.events.length - 1].date;
  const programArea = programAreaMap[appeal.attributes.programArea];

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
  appealTitle = capitalizeFirstLetter(appealTitle);

  return (
    <div className="vads-l-col--12 medium-screen:vads-l-col--6 small-desktop-screen:vads-l-col--8 medium-screen:vads-u-padding-right--3">
      <div className="vads-u-padding-y--2p5 vads-u-padding-x--2p5 vads-u-background-color--gray-lightest">
        <h3 className="vads-u-margin-top--0">
          {appealTitle}
          {/* Claim for compensation received June 7, 1999 */}
        </h3>
        <div className="vads-u-display--flex">
          <i
            aria-hidden="true"
            className={`fas fa-fw fa-check-circle vads-u-margin-right--1 vads-u-margin-top--0p5 vads-u-color--green`}
          />
          <div>
            <p className="vads-u-margin-y--0">
              Status: {getStatusContents(appeal, name).title}
            </p>
            {appeal.attributes.description && (
              <p className="vads-u-margin-y--0">
                {appeal.attributes.issues.length === 1 ? 'Issue' : 'Issues'} on
                {isAppeal ? ' appeal' : ' review'}:{' '}
                {appeal.attributes.description}
              </p>
            )}
            {requestEvent && (
              <p className="vads-u-margin-y--0">
                Submitted on: {moment(requestEvent.date).format('MMMM D, YYYY')}
              </p>
            )}
          </div>
        </div>
        <a
          aria-label={`View details of ${appealTitle} `}
          className="usa-button-primary"
          href={`/track-claims/appeals/${appeal.id}/status`}
        >
          View details
        </a>
      </div>
    </div>
  );
};

export default Appeal;
