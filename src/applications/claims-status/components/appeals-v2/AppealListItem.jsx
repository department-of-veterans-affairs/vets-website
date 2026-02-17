import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Toggler } from '~/platform/utilities/feature-toggles';
import ClaimCard from '../ClaimCard';
import UploadType2ErrorAlertSlim from '../UploadType2ErrorAlertSlim';
import {
  APPEAL_TYPES,
  EVENT_TYPES,
  getTypeName,
  getStatusContents,
  programAreaMap,
} from '../../utils/appeals-v2-helpers';
import {
  buildDateFormatter,
  getFailedSubmissionsWithinLast30Days,
} from '../../utils/helpers';

const capitalizeWord = word => {
  const capFirstLetter = word[0].toUpperCase();
  return `${capFirstLetter}${word.slice(1)}`;
};

const formatDate = buildDateFormatter();

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

  let appealTitle = getTypeName(appeal);
  let updatedOn = '';

  if (programArea) {
    if (isAppeal) {
      appealTitle = `${programArea} ${appealTitle}`;
    } else {
      appealTitle += ` for ${programArea}`;
    }
  }

  // Memoize failed submissions to prevent UploadType2ErrorAlertSlim from receiving
  // a new array reference on every render, which would break its useEffect tracking
  const failedSubmissionsWithinLast30Days = useMemo(() => {
    const evidenceSubmissions = appeal.attributes?.evidenceSubmissions || [];

    return getFailedSubmissionsWithinLast30Days(evidenceSubmissions);
  }, [appeal.attributes?.evidenceSubmissions]);

  appealTitle = capitalizeWord(appealTitle);
  updatedOn = formatDate(updatedEventDateString);

  const ariaLabel = `Details for ${appealTitle}`;
  const href = `/appeals/${appeal.id}/status`;

  return (
    <ClaimCard
      title={appealTitle}
      subtitle={requestEvent && `Received on ${formatDate(requestEvent.date)}`}
    >
      <div className="card-status">
        {appeal.attributes.description && (
          <p>
            {appeal.attributes.issues.length === 1 ? 'Issue' : 'Issues'} on
            {isAppeal ? ' appeal' : ' review'}:{' '}
            <span
              className="masked-issue"
              data-dd-privacy="mask"
              data-dd-action-name="appeal issue"
            >
              {appeal.attributes.description}
            </span>
          </p>
        )}
        <p>
          Status:{' '}
          <span
            className="masked-issue"
            data-dd-privacy="mask"
            data-dd-action-name="appeal issue"
          >
            {getStatusContents(appeal, name).title}
          </span>
        </p>
        <p>Last updated: {updatedOn}</p>
        <Toggler toggleName={Toggler.TOGGLE_NAMES.cstShowDocumentUploadStatus}>
          <Toggler.Enabled>
            <UploadType2ErrorAlertSlim
              claimId={appeal.id}
              failedSubmissions={failedSubmissionsWithinLast30Days}
            />
          </Toggler.Enabled>
        </Toggler>
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
      evidenceSubmissions: PropTypes.array,
    }),
    type: PropTypes.string,
  }),
  name: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
  }),
};
