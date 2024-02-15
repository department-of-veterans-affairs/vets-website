import PropTypes from 'prop-types';
import React from 'react';
import { buildDateFormatter } from '../utils/helpers';

const getOldestDocuentDate = item => {
  const arrDocumentDates = item.documents.map(document => document.uploadDate);
  return arrDocumentDates.sort()[0]; // Tried to do Math.min() here and it was erroring out
};

const formatDate = date => buildDateFormatter('MMMM d, yyyy')(date);

const getTrackedItemDateFromStatus = item => {
  switch (item.status) {
    case 'NEEDED_FROM_YOU':
    case 'NEEDED_FROM_OTHERS':
      return item.requestedDate;
    case 'NO_LONGER_REQUIRED':
      return item.closedDate;
    case 'SUBMITTED_AWAITING_REVIEW':
      return getOldestDocuentDate(item);
    case 'INITIAL_REVIEW_COMPLETE':
    case 'ACCEPTED':
      return item.receivedDate;
    default:
      return '';
  }
};

const getTrackedItemDescription = item => {
  switch (item.status) {
    case 'NEEDED_FROM_YOU':
    case 'NEEDED_FROM_OTHERS':
      return `We opened a request for "${item.displayName}"`;
    case 'NO_LONGER_REQUIRED':
      return `We closed a request for "${item.displayName}"`;
    case 'SUBMITTED_AWAITING_REVIEW':
      return `We are awaiting review for request ${item.displayName}`;
    case 'INITIAL_REVIEW_COMPLETE':
    case 'ACCEPTED':
      return `A review was completed for request ${item.displayName}`;
    default:
      return '';
  }
};

const generateTrackedItems = claim => {
  const { trackedItems } = claim.attributes;

  return trackedItems.map(item => ({
    // ...item,
    date: formatDate(getTrackedItemDateFromStatus(item)),
    description: getTrackedItemDescription(item),
    type: 'tracked_item',
  }));
};

function RecentActivity({ claim }) {
  const trackedItems = generateTrackedItems(claim);

  return (
    <div className="recent-activity-container">
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
        Recent activity
      </h3>
      <ol>
        {trackedItems.map(item => (
          <li key={item.id} className="recent-activity-list-item">
            <h4 className="vads-u-margin-y--0">{item.date}</h4>
            <p className="vads-u-margin-top--0p5">{item.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

RecentActivity.propTypes = {
  claim: PropTypes.object,
};

export default RecentActivity;
