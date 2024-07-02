import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
  getItemDate,
  hasBeenReviewed,
  truncateDescription,
} from '../utils/helpers';

export default function SubmittedTrackedItem({ item }) {
  const { closedDate, description, displayName, documents, status } = item;

  const closed = status === 'NO_LONGER_REQUIRED' && closedDate !== null;
  const reviewed = hasBeenReviewed(item);

  return (
    <div className="submitted-file-list-item">
      <h3 className="submission-file-type">{displayName}</h3>
      {description && (
        <p
          className="submission-description"
          data-dd-privacy="mask"
          data-dd-action-name="submission description"
        >
          {truncateDescription(description)}
        </p>
      )}
      {documents &&
        documents.map((doc, index) => (
          <div key={index} className="submission-description">
            <span className="claim-item-label">File:</span>{' '}
            <span
              className="submission-description-filename"
              data-dd-privacy="mask"
              data-dd-action-name="submission description filename"
            >
              {doc.originalFileName}
            </span>
            <br />
            <span className="claim-item-label">Type:</span>{' '}
            {doc.documentTypeLabel}
          </div>
        ))}
      {closed && (
        <div>
          <span className="submission-status">No longer needed</span>
        </div>
      )}
      {!closed &&
        reviewed && (
          <div>
            <span className="submission-status reviewed-file">
              <va-icon icon="check_circle" size={3} class="submission-icon" />
              Reviewed by VA
            </span>
            <span className="submission-date reviewed-file">
              {moment(getItemDate(item)).format('MMM D, YYYY')}
            </span>
          </div>
        )}
      {!closed &&
        !reviewed && (
          <div>
            <span className="submission-status">Submitted</span>
            <span className="submission-date">
              {moment(getItemDate(item)).format('MMM D, YYYY')}
              {' (pending)'}
            </span>
          </div>
        )}
    </div>
  );
}

SubmittedTrackedItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    closedDate: PropTypes.string,
    description: PropTypes.string,
    displayName: PropTypes.string,
    documents: PropTypes.array,
    overdue: PropTypes.bool,
    receivedDate: PropTypes.string,
    requestedDate: PropTypes.string,
    status: PropTypes.string,
    suspenseDate: PropTypes.string,
    uploadsAllowed: PropTypes.bool,
  }).isRequired,
};
